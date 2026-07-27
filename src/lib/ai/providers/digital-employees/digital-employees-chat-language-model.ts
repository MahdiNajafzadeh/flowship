import type {
    LanguageModelV4,
    LanguageModelV4CallOptions,
    LanguageModelV4GenerateResult,
    LanguageModelV4StreamResult,
    LanguageModelV4StreamPart,
    LanguageModelV4Prompt,
    LanguageModelV4Message,
    LanguageModelV4TextPart,
    LanguageModelV4ToolCallPart,
    LanguageModelV4ToolResultPart,
    SharedV4Warning,
    LanguageModelV4Usage,
} from "@ai-sdk/provider";
import { APICallError } from "@ai-sdk/provider";
import { generateId } from "@ai-sdk/provider-utils";
import type {
    DigitalEmployeesChatSettings,
    DigitalEmployeesChatConfig,
} from "./digital-employees-types";

type ToolCallState = {
    id: string;
    name: string;
    args: string;
};

function createDefaultUsage(): LanguageModelV4Usage {
    return {
        inputTokens: {
            total: undefined,
            noCache: undefined,
            cacheRead: undefined,
            cacheWrite: undefined,
        },
        outputTokens: {
            total: undefined,
            text: undefined,
            reasoning: undefined,
        },
    };
}

export class DigitalEmployeesChatLanguageModel implements LanguageModelV4 {
    readonly specificationVersion = "v4" as const;
    readonly provider: string;
    readonly modelId: string;

    private readonly settings: DigitalEmployeesChatSettings;
    private readonly config: DigitalEmployeesChatConfig;

    constructor(
        modelId: string,
        settings: DigitalEmployeesChatSettings,
        config: DigitalEmployeesChatConfig,
    ) {
        this.provider = config.provider;
        this.modelId = modelId;
        this.settings = settings;
        this.config = config;
    }

    get supportedUrls(): Record<string, RegExp[]> {
        return {};
    }

    async doGenerate(
        options: LanguageModelV4CallOptions,
    ): Promise<LanguageModelV4GenerateResult> {
        throw new APICallError({
            message:
                "The Digital Employees provider only supports streaming. Use streamText instead of generateText.",
            url: this.config.baseURL,
            requestBodyValues: options,
            isRetryable: false,
        });
    }

    async doStream(
        options: LanguageModelV4CallOptions,
    ): Promise<LanguageModelV4StreamResult> {
        const warnings: SharedV4Warning[] = [];
        const body = this.buildRequestBody(options);

        const url = this.config.baseURL;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...this.config.headers?.(),
        };

        const response = await (this.config.fetch ?? globalThis.fetch)(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ ...body, project_id: "6" }),
            signal: options.abortSignal,
        });

        if (!response.ok) {
            const responseBody = await response.text().catch(() => undefined);
            throw new APICallError({
                message: `Digital Employees API error: ${response.status} ${response.statusText}`,
                url,
                requestBodyValues: body,
                statusCode: response.status,
                responseHeaders: Object.fromEntries(response.headers.entries()),
                responseBody,
                isRetryable: response.status >= 500,
            });
        }

        const stream = this.createStream(response, warnings);
        return { stream };
    }

    private buildRequestBody(
        options: LanguageModelV4CallOptions,
    ): Record<string, unknown> {
        const messages = this.convertPrompt(options.prompt);

        const body: Record<string, unknown> = {
            model: this.modelId,
            project_id: options?.providerOptions?.projectId,
            messages,
            stream: true,
        };

        if (options.temperature != null) {
            body.temperature = options.temperature;
        }
        if (options.maxOutputTokens != null) {
            body.max_tokens = options.maxOutputTokens;
        }
        if (options.stopSequences != null && options.stopSequences.length > 0) {
            body.stop = options.stopSequences;
        }
        if (this.settings.allowedTools != null) {
            body.allowed_tools = this.settings.allowedTools;
        }
        if (this.settings.temperature != null) {
            body.temperature = this.settings.temperature;
        }
        if (this.settings.maxTokens != null) {
            body.max_tokens = this.settings.maxTokens;
        }

        return body;
    }

    private convertPrompt(prompt: LanguageModelV4Prompt): unknown[] {
        return prompt.map((message) => this.convertMessage(message));
    }

    private convertMessage(message: LanguageModelV4Message): unknown {
        switch (message.role) {
            case "system":
                return { role: "system", content: message.content };

            case "user": {
                const textParts = message.content.filter(
                    (part): part is LanguageModelV4TextPart =>
                        part.type === "text",
                );
                const content = textParts.map((p) => p.text).join("");
                return { role: "user", content };
            }

            case "assistant": {
                const textParts = message.content.filter(
                    (part): part is LanguageModelV4TextPart =>
                        part.type === "text",
                );
                const content = textParts.map((p) => p.text).join("") || null;

                const toolCallParts = message.content.filter(
                    (part): part is LanguageModelV4ToolCallPart =>
                        part.type === "tool-call",
                );

                const result: Record<string, unknown> = {
                    role: "assistant",
                    content,
                };

                if (toolCallParts.length > 0) {
                    result.tool_calls = toolCallParts.map((tc) => ({
                        id: tc.toolCallId,
                        type: "function",
                        function: {
                            name: tc.toolName,
                            arguments:
                                typeof tc.input === "string"
                                    ? tc.input
                                    : JSON.stringify(tc.input),
                        },
                    }));
                }

                return result;
            }

            case "tool": {
                const toolParts = message.content.filter(
                    (part): part is LanguageModelV4ToolResultPart =>
                        part.type === "tool-result",
                );

                if (toolParts.length === 0) {
                    return { role: "tool", content: "", tool_call_id: "" };
                }

                const first = toolParts[0];
                const content = stringifyToolOutput(first.output);

                return {
                    role: "tool",
                    content,
                    tool_call_id: first.toolCallId,
                };
            }

            default:
                return { role: "user", content: "" };
        }
    }

    private createStream(
        response: Response,
        warnings: SharedV4Warning[],
    ): ReadableStream<LanguageModelV4StreamPart> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new APICallError({
                message: "Response body is not readable",
                url: this.config.baseURL,
                requestBodyValues: {},
                isRetryable: false,
            });
        }

        const decoder = new TextDecoder();

        let responseId: string | undefined;
        let responseModel: string | undefined;
        let responseTimestamp: Date | undefined;

        let textId = generateId();
        let hasStartedText = false;
        let reasoningId = generateId();
        let hasStartedReasoning = false;
        const toolCallMap = new Map<number, ToolCallState>();

        return new ReadableStream<LanguageModelV4StreamPart>({
            async start(controller) {
                controller.enqueue({
                    type: "stream-start",
                    warnings,
                });
            },

            async pull(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            controller.close();
                            return;
                        }

                        const text = decoder.decode(value, { stream: true });
                        const lines = text.split("\n");

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed?.startsWith?.("data: ")) continue;

                            const payload = trimmed.slice(6);
                            if (payload === "[DONE]") {
                                if (hasStartedReasoning) {
                                    controller.enqueue({
                                        type: "reasoning-end",
                                        id: reasoningId,
                                    });
                                    hasStartedReasoning = false;
                                }
                                if (hasStartedText) {
                                    controller.enqueue({
                                        type: "text-end",
                                        id: textId,
                                    });
                                }
                                if (responseId || responseModel) {
                                    controller.enqueue({
                                        type: "response-metadata",
                                        id: responseId,
                                        modelId: responseModel,
                                        timestamp: responseTimestamp,
                                    });
                                }
                                controller.enqueue({
                                    type: "finish",
                                    finishReason: {
                                        unified: "stop",
                                        raw: "stop",
                                    },
                                    usage: createDefaultUsage(),
                                });
                                controller.close();
                                return;
                            }

                            let parsed: Record<string, unknown>;
                            try {
                                parsed = JSON.parse(payload);
                            } catch {
                                continue;
                            }

                            if (parsed.agentic_event) {
                                continue;
                            }

                            if (parsed.id && !responseId) {
                                responseId = parsed.id as string;
                            }
                            if (parsed.model && !responseModel) {
                                responseModel = parsed.model as string;
                            }
                            if (parsed.created && !responseTimestamp) {
                                responseTimestamp = new Date(
                                    (parsed.created as number) * 1000,
                                );
                            }

                            const choices = parsed.choices as
                                | Array<Record<string, unknown>>
                                | undefined;
                            if (!choices || choices.length === 0) continue;

                            const choice = choices[0];
                            const delta = choice.delta as
                                | Record<string, unknown>
                                | undefined;
                            if (!delta) continue;

                            const finishReason = choice.finish_reason as
                                | string
                                | undefined;

                            if (
                                delta.content &&
                                typeof delta.content === "string"
                            ) {
                                if (
                                    delta.content.length > 0 &&
                                    hasStartedReasoning
                                ) {
                                    controller.enqueue({
                                        type: "reasoning-end",
                                        id: reasoningId,
                                    });
                                    hasStartedReasoning = false;
                                }
                                if (!hasStartedText) {
                                    controller.enqueue({
                                        type: "text-start",
                                        id: textId,
                                    });
                                    hasStartedText = true;
                                }
                                controller.enqueue({
                                    type: "text-delta",
                                    id: textId,
                                    delta: delta.content,
                                });
                            }

                            if (
                                delta.reasoning_content &&
                                typeof delta.reasoning_content === "string"
                            ) {
                                if (!hasStartedReasoning) {
                                    controller.enqueue({
                                        type: "reasoning-start",
                                        id: reasoningId,
                                    });
                                    hasStartedReasoning = true;
                                }
                                controller.enqueue({
                                    type: "reasoning-delta",
                                    id: reasoningId,
                                    delta: delta.reasoning_content,
                                });
                            }

                            if (delta.tool_calls) {
                                const toolCalls = delta.tool_calls as Array<{
                                    index: number;
                                    id?: string;
                                    type?: string;
                                    function?: {
                                        name?: string;
                                        arguments?: string;
                                    };
                                }>;

                                for (const tc of toolCalls) {
                                    const idx = tc.index;
                                    if (!toolCallMap.has(idx)) {
                                        const toolId = tc.id ?? generateId();
                                        const toolName =
                                            tc.function?.name ?? "unknown";
                                        toolCallMap.set(idx, {
                                            id: toolId,
                                            name: toolName,
                                            args: "",
                                        });
                                        controller.enqueue({
                                            type: "tool-input-start",
                                            id: toolId,
                                            toolName,
                                        });
                                    }

                                    const state = toolCallMap.get(idx)!;
                                    if (tc.function?.arguments) {
                                        state.args += tc.function.arguments;
                                        controller.enqueue({
                                            type: "tool-input-delta",
                                            id: state.id,
                                            delta: tc.function.arguments,
                                        });
                                    }
                                }
                            }

                            if (finishReason === "tool_calls") {
                                for (const [, tc] of toolCallMap) {
                                    controller.enqueue({
                                        type: "tool-input-end",
                                        id: tc.id,
                                    });
                                    controller.enqueue({
                                        type: "tool-call",
                                        toolCallId: tc.id,
                                        toolName: tc.name,
                                        input: tc.args,
                                    });
                                }
                                toolCallMap.clear();

                                if (hasStartedReasoning) {
                                    controller.enqueue({
                                        type: "reasoning-end",
                                        id: reasoningId,
                                    });
                                    hasStartedReasoning = false;
                                }
                                if (hasStartedText) {
                                    controller.enqueue({
                                        type: "text-end",
                                        id: textId,
                                    });
                                }
                                textId = generateId();
                                hasStartedText = false;
                                reasoningId = generateId();
                                hasStartedReasoning = false;

                                if (responseId || responseModel) {
                                    controller.enqueue({
                                        type: "response-metadata",
                                        id: responseId,
                                        modelId: responseModel,
                                        timestamp: responseTimestamp,
                                    });
                                }
                            }

                            if (
                                finishReason &&
                                finishReason !== "tool_calls" &&
                                finishReason !== "null"
                            ) {
                                if (hasStartedReasoning) {
                                    controller.enqueue({
                                        type: "reasoning-end",
                                        id: reasoningId,
                                    });
                                    hasStartedReasoning = false;
                                }
                                if (hasStartedText) {
                                    controller.enqueue({
                                        type: "text-end",
                                        id: textId,
                                    });
                                }

                                if (responseId || responseModel) {
                                    controller.enqueue({
                                        type: "response-metadata",
                                        id: responseId,
                                        modelId: responseModel,
                                        timestamp: responseTimestamp,
                                    });
                                }

                                const unified = mapFinishReason(finishReason);
                                controller.enqueue({
                                    type: "finish",
                                    finishReason: {
                                        unified,
                                        raw: finishReason,
                                    },
                                    usage: createDefaultUsage(),
                                });

                                controller.close();
                                return;
                            }
                        }
                    }
                } catch (error) {
                    controller.enqueue({
                        type: "error",
                        error,
                    });
                    controller.close();
                }
            },

            async cancel() {
                await reader.cancel();
            },
        });
    }
}

function stringifyToolOutput(
    output: LanguageModelV4ToolResultPart["output"],
): string {
    switch (output.type) {
        case "text":
            return output.value;
        case "json":
            return JSON.stringify(output.value);
        case "error-text":
            return output.value;
        case "error-json":
            return JSON.stringify(output.value);
        case "content":
            return output.value
                .map((part) => {
                    if (part.type === "text") return part.text;
                    return "";
                })
                .join("");
        case "execution-denied":
            return output.reason ?? "Execution denied";
        default:
            return "";
    }
}

function mapFinishReason(
    reason: string,
): "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" {
    switch (reason) {
        case "stop":
            return "stop";
        case "length":
            return "length";
        case "content-filter":
            return "content-filter";
        case "tool_calls":
            return "tool-calls";
        case "error":
            return "error";
        default:
            return "other";
    }
}

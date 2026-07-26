import type { LanguageModelV4, ProviderV4 } from "@ai-sdk/provider";

export interface DigitalEmployeesProviderSettings {
	baseURL?: string;
	headers?: Record<string, string>;
	fetch?: typeof globalThis.fetch;
}

export interface DigitalEmployeesChatSettings {
	employeeId?: number | null;
	allowedTools?: AllowedToolsFilter | null;
	temperature?: number | null;
	maxTokens?: number | null;
}

export interface AllowedToolsFilter {
	workflow_ids?: number[] | null;
	mcp_server_ids?: number[] | null;
	mcp_tool_ids?: number[] | null;
	api_tool_ids?: number[] | null;
	kb_enabled?: boolean | null;
	mcp_server_envs?: Record<string, Record<string, string>> | null;
	mcp_tool_envs?: Record<string, Record<string, string>> | null;
}

export interface DigitalEmployeesChatConfig {
	provider: string;
	baseURL: string;
	headers?: () => Record<string, string | undefined>;
	fetch?: typeof globalThis.fetch;
}

export interface DigitalEmployeesProvider extends ProviderV4 {
	(modelId: string, settings?: DigitalEmployeesChatSettings): LanguageModelV4;

	languageModel(
		modelId: string,
		settings?: DigitalEmployeesChatSettings,
	): LanguageModelV4;
}

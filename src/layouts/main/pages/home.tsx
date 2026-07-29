import React from "react";
import { useChat } from "@ai-sdk/react";
import { match } from "ts-pattern";
import {
    MessageScrollerProvider,
    MessageScroller,
    MessageScrollerViewport,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerButton,
} from "@/components/ui/message-scroller";
import PromptInput from "@/components/prompt-input";
import { TextPart, ToolCallingPart, ReasoningPart } from "@/components/chat";
import { createChat } from "@shadcn/helpers/ai-sdk";
import { loremIpsum } from "lorem-ipsum";
import { ToolLoopAgent, DirectChatTransport, type UIMessage } from "ai";
import { createDigitalEmployees } from "@/lib/ai/providers/digital-employees";
import { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

const random = () => Math.floor(Math.random() * 50);
const randomText = () => loremIpsum({ count: random() });
const chat = createChat();
Array
    //
    .from({ length: 5 })
    .map(() =>
        chat.assistant(({ writer }) => {
            writer.reasoning("i must call some tools");
            writer.text("wait to calling tools");
            writer
                .tool("getData", {
                    input: { query: {} },
                })
                .sleep(100)
                .output({ data: randomText() });
            writer.text(randomText());
        }),
    );
//

const provider = createDigitalEmployees();
const agent = new ToolLoopAgent({
    model: provider("8373526d-e08f-4fe2-a98d-d4dbecc8fbab"),
    providerOptions: {
        projectId: "6",
    } as any,
});

const Message = React.memo(({ message }: { message: UIMessage }) => {
    const renderedParts = useMemo(
        () =>
            message.parts.map((part, i: number) =>
                match(part)
                    .returnType<React.ReactNode>()
                    .with({ type: "text" }, (part) => (
                        <TextPart key={`message-${message.id}/${part.type}/${i.toString()}`} {...part} />
                    ))
                    .with({ type: "reasoning" }, (part) => (
                        <ReasoningPart key={`message-${message.id}/${part.type}/${i.toString()}`} {...part} />
                    ))
                    .when(
                        (v) => v.type.startsWith("tool-"),
                        (part: any) => (
                            <ToolCallingPart key={`message-${message.id}/${part.type}/${i.toString()}`} {...part} />
                        ),
                    )
                    .with({ type: "dynamic-tool" }, (part: any) => (
                        <ToolCallingPart key={`message-${message.id}/${part.type}/${i.toString()}`} {...part} type={part.toolName} />
                    ))
                    .otherwise(() => null),
            ),
        [message.id, message.parts],
    );
    return (
        <div className="flex flex-col gap-1" color={message.role === "user" ? "red" : undefined}>
            <div className="flex flex-col gap-3 text-sm">{renderedParts}</div>
        </div>
    );
});

export default function Home(props: React.HTMLAttributes<HTMLDivElement>) {
    const transport = useRef(new DirectChatTransport({ agent }));
    const { sendMessage, messages, status } = useChat({ transport: transport.current });
    return (
        <div {...props} className={cn(props.className, "flex flex-col w-3/5 h-full mx-auto")}>
            <MessageScrollerProvider autoScroll={true}>
                <div className="flex-1 min-h-0 flex flex-col">
                    <MessageScroller className="flex-1">
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="pt-4 pb-16">
                                {messages.map((message) => (
                                    <MessageScrollerItem key={message.id} messageId={message.id}>
                                        <Message message={message} />
                                    </MessageScrollerItem>
                                ))}
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                        <MessageScrollerButton />
                    </MessageScroller>
                </div>
            </MessageScrollerProvider>

            <PromptInput
                className="flex-none mt-2"
                disabled={status === "submitted" || status === "streaming"}
                onSend={(text) => void sendMessage({ text })}
            />
        </div>
    );
}

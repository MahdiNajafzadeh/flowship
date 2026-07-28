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

const chat = createChat();

const random = () => Math.floor(Math.random() * 50);
const randomText = () => loremIpsum({ count: random() });
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

const MessageItem = React.memo(
    ({ message }: { message: any }) => {
        const renderedParts = useMemo(() => {
            return message.parts.map((part: any, i: number) => {
                const key = `message-${message.id}-[${part.type}]-${i}`;
                return match(part)
                    .returnType<React.ReactNode>()
                    .with({ type: "text" }, (part) => <TextPart key={key} {...part} />)
                    .with({ type: "reasoning" }, (part: any) => <ReasoningPart key={key} {...part} />)
                    .when(
                        (v) => v.type.startsWith("tool-"),
                        (part: any) => <ToolCallingPart key={key} {...part} />,
                    )
                    .otherwise(() => null);
            });
        }, [message.id, message.parts]);
        return (
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-3 text-sm">{renderedParts}</div>
            </div>
        );
    },
    (p, n) => p.message.id === n.message.id && p.message.parts === n.message.parts,
);

export default function Home(props: React.HTMLAttributes<HTMLDivElement>) {
    const transport = useRef(new DirectChatTransport({ agent }));
    const { messages, sendMessage, status } = useChat({
        transport: transport.current,
    });

    return (
        <div {...props} className={cn(props.className, "flex flex-col items-center w-full h-full mx-auto")}>
            <MessageScrollerProvider autoScroll={true}>
                <div className="flex-1 min-h-0 flex flex-col">
                    <MessageScroller className="flex-1">
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="pt-4 pb-16">
                                {messages.map((message) => (
                                    <MessageScrollerItem key={message.id}>
                                        <MessageItem message={message} />
                                    </MessageScrollerItem>
                                ))}
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                        <MessageScrollerButton />
                    </MessageScroller>
                </div>
            </MessageScrollerProvider>

            <PromptInput
                className="flex-none w-3/5 max-w-3xl mt-2"
                disabled={status === "submitted" || status === "streaming"}
                onSend={(text) => void sendMessage({ text })}
            />
        </div>
    );
}

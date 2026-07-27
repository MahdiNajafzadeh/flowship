// import type React from "react";
// import { useRef } from "react";
// import { useChat } from "@ai-sdk/react";
// import { DirectChatTransport, ToolLoopAgent } from "ai";
// import { createDigitalEmployees } from "@/lib/ai/providers/digital-employees";
// import PromptInput from "@/components/prompt-input";
// import {
//     MessageScrollerProvider,
//     MessageScroller,
//     MessageScrollerViewport,
//     MessageScrollerContent,
//     MessageScrollerItem,
//     MessageScrollerButton,
// } from "@/components/ui/message-scroller";
// import Markdown from "react-markdown";
//
// const provider = createDigitalEmployees();
// const agent = new ToolLoopAgent({
//     model: provider("8373526d-e08f-4fe2-a98d-d4dbecc8fbab"),
//     providerOptions: {
//         projectId: "6",
//     } as any,
// });
//
// type ToolLikePart = {
//     type: string;
//     toolName?: string;
//     state?: string;
//     input?: unknown;
//     output?: unknown;
//     errorText?: string;
//     text?: string;
// };
//
// function renderPart(
//     part: { type: string } & Record<string, unknown>,
//     key: React.Key,
// ) {
//     if (part.type === "text") {
//         const text = (part as { text?: string }).text ?? "";
//         return (
//             <div
//                 key={key}
//                 className="space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:overflow-x-auto"
//             >
//                 <Markdown>{text}</Markdown>
//             </div>
//         );
//     }
//
//     if (part.type === "reasoning") {
//         const text = (part as { text?: string }).text ?? "";
//         return (
//             <details
//                 key={key}
//                 className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
//             >
//                 <summary className="cursor-pointer select-none font-medium">
//                     Thinking
//                 </summary>
//                 <div className="mt-2 whitespace-pre-wrap wrap-break-words [&_p]:mb-1 [&_p:last-child]:mb-0">
//                     <Markdown>{text}</Markdown>
//                 </div>
//             </details>
//         );
//     }
//
//     if (part.type.startsWith("tool-")) {
//         const tool = part as ToolLikePart;
//         const name =
//             tool.toolName ??
//             (tool.type.startsWith("dynamic-tool")
//                 ? "tool"
//                 : tool.type.slice("tool-".length));
//         const input = tool.input;
//         const output = tool.output;
//         return (
//             <div
//                 key={key}
//                 className="inline-flex flex-col gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
//             >
//                 <div className="flex items-center gap-2">
//                     <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-foreground">
//                         {name}
//                     </span>
//                     {tool.state && (
//                         <span className="text-[10px] uppercase tracking-wide opacity-70">
//                             {tool.state}
//                         </span>
//                     )}
//                 </div>
//                 {input !== undefined && (
//                     <pre className="max-w-full whitespace-pre-wrap break-all font-mono text-[11px] text-foreground/80">
//                         {typeof input === "string"
//                             ? input
//                             : JSON.stringify(input, null, 2)}
//                     </pre>
//                 )}
//                 {output !== undefined && (
//                     <pre className="max-w-full whitespace-pre-wrap break-all font-mono text-[11px] text-foreground/80">
//                         {typeof output === "string"
//                             ? output
//                             : JSON.stringify(output, null, 2)}
//                     </pre>
//                 )}
//             </div>
//         );
//     }
//
//     return null;
// }
//
// export default function Home(props: React.HTMLAttributes<HTMLDivElement>) {
//     const transport = useRef(new DirectChatTransport({ agent }));
//     const { messages, sendMessage, status } = useChat({
//         transport: transport.current,
//     });
//
//     return (
//         <div {...props} className="flex flex-col w-3/5 h-full">
//             <MessageScrollerProvider autoScroll={true}>
//                 <div className="flex-1 min-h-0 flex flex-col">
//                     <MessageScroller className="flex-1">
//                         <MessageScrollerViewport>
//                             <MessageScrollerContent className="pt-4">
//                                 {messages.map((message) => (
//                                     <MessageScrollerItem key={message.id}>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="text-xs font-medium text-muted-foreground">
//                                                 {message.role === "user"
//                                                     ? "You"
//                                                     : "Assistant"}
//                                             </span>
//                                             <div className="flex flex-col gap-3 text-sm">
//                                                 {message.parts.map((part, i) =>
//                                                     renderPart(
//                                                         part as {
//                                                             type: string;
//                                                         } & Record<
//                                                             string,
//                                                             unknown
//                                                         >,
//                                                         `${message.id}-${part.type}-${i}`,
//                                                     ),
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </MessageScrollerItem>
//                                 ))}
//                             </MessageScrollerContent>
//                         </MessageScrollerViewport>
//                         <MessageScrollerButton />
//                     </MessageScroller>
//                 </div>
//             </MessageScrollerProvider>
//
//             <PromptInput
//                 className="flex-none"
//                 disabled={status === "submitted" || status === "streaming"}
//                 onSend={(text) => sendMessage({ text })}
//             />
//         </div>
//     );
// }


// src/layouts/main/pages/home.tsx

import type React from "react";
import { useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport, ToolLoopAgent } from "ai";
import { createDigitalEmployees } from "@/lib/ai/providers/digital-employees";
import PromptInput from "@/components/prompt-input";
import {
    MessageScrollerProvider,
    MessageScroller,
    MessageScrollerViewport,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";

const provider = createDigitalEmployees();
const agent = new ToolLoopAgent({
    model: provider("8373526d-e08f-4fe2-a98d-d4dbecc8fbab"),
    providerOptions: {
        projectId: "6",
    } as any,
});

type ToolLikePart = {
    type: string;
    toolName?: string;
    state?: string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    text?: string;
};

function renderPart(
    part: { type: string } & Record<string, unknown>,
    key: React.Key,
) {
    if (part.type === "text") {
        const text = (part as { text?: string }).text ?? "";
        return (
            <div
                key={key}
                className="space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:overflow-x-auto"
            >
                <Markdown>{text}</Markdown>
            </div>
        );
    }

    if (part.type === "reasoning") {
        const text = (part as { text?: string }).text ?? "";
        return (
            <details
                key={key}
                className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
            >
                <summary className="cursor-pointer select-none font-medium">
                    Thinking
                </summary>
                <div className="mt-2 whitespace-pre-wrap wrap-break-words [&_p]:mb-1 [&_p:last-child]:mb-0">
                    <Markdown>{text}</Markdown>
                </div>
            </details>
        );
    }

    if (part.type.startsWith("tool-")) {
        const tool = part as ToolLikePart;
        const name =
            tool.toolName ??
            (tool.type.startsWith("dynamic-tool")
                ? "tool"
                : tool.type.slice("tool-".length));
        const input = tool.input;
        const output = tool.output;
        return (
            <div
                key={key}
                className="inline-flex flex-col gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
            >
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-foreground">
                        {name}
                    </span>
                    {tool.state && (
                        <span className="text-[10px] uppercase tracking-wide opacity-70">
                            {tool.state}
                        </span>
                    )}
                </div>
                {input !== undefined && (
                    <pre className="max-w-full whitespace-pre-wrap break-all font-mono text-[11px] text-foreground/80">
                        {typeof input === "string"
                            ? input
                            : JSON.stringify(input, null, 2)}
                    </pre>
                )}
                {output !== undefined && (
                    <pre className="max-w-full whitespace-pre-wrap break-all font-mono text-[11px] text-foreground/80">
                        {typeof output === "string"
                            ? output
                            : JSON.stringify(output, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    return null;
}

export default function Home(props: React.HTMLAttributes<HTMLDivElement>) {
    const transport = useRef(new DirectChatTransport({ agent }));
    const { messages, sendMessage, status } = useChat({
        transport: transport.current,
    });

    return (
        <div {...props} className="flex flex-col h-full w-3/5 max-w-3xl mx-auto">
            <MessageScrollerProvider autoScroll={true}>
                <div className="flex-1 min-h-0 flex flex-col">
                    <MessageScroller className="flex-1">
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="pt-4">
                                {messages.map((message) => (
                                    <MessageScrollerItem key={message.id}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {message.role === "user"
                                                    ? "You"
                                                    : "Assistant"}
                                            </span>
                                            <div className="flex flex-col gap-3 text-sm">
                                                {message.parts.map((part, i) =>
                                                    renderPart(
                                                        part as {
                                                            type: string;
                                                        } & Record<
                                                            string,
                                                            unknown
                                                        >,
                                                        `${message.id}-${part.type}-${i}`,
                                                    ),
                                                )}
                                            </div>
                                        </div>
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
                onSend={(text) => sendMessage({ text })}
            />
        </div>
    );
}

import type { UIMessage } from "ai";

import { ListIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessageScroller, useMessageScrollerVisibility } from "@/components/ui/message-scroller";

export type TranscriptTurn = {
    id: string;
    label: string;
};

const MAX_LABEL_LENGTH = 42;

function getMessageText(message: UIMessage): string {
    return message.parts
        .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
        .map((part) => part.text)
        .join(" ")
        .trim();
}

export function getMessageLabel(message: UIMessage): string {
    const text = getMessageText(message);

    if (text.length <= MAX_LABEL_LENGTH) {
        return text;
    }

    return `${text.slice(0, MAX_LABEL_LENGTH - 3)}...`;
}

export function TranscriptOutline({ turns, className }: { turns: TranscriptTurn[]; className?: string }) {
    const { currentAnchorId } = useMessageScrollerVisibility();
    const { scrollToMessage } = useMessageScroller();

    if (turns.length === 0) {
        return null;
    }

    const jumpToTurn = (id: string) => {
        scrollToMessage(id, { align: "start", behavior: "smooth" });
    };

    return (
        <div className={cn("pointer-events-none absolute top-1/2 inset-e-1 z-10 -translate-y-1/2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button
                            type="button"
                            aria-label="Open transcript outline"
                            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        />
                    }
                >
                    <span className="hidden flex-col items-center gap-4 md:flex">
                        {turns.map((turn) => (
                            <span
                                key={turn.id}
                                data-current={turn.id === currentAnchorId}
                                className="h-0.5 w-4 rounded-full bg-muted-foreground/40 transition-colors data-[current=true]:bg-foreground"
                            />
                        ))}
                    </span>
                    <span className="flex text-muted-foreground md:hidden">
                        <ListIcon />
                        <span className="sr-only">Sections</span>
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="left"
                    align="center"
                    sideOffset={12}
                    className="max-h-80 w-64 overflow-y-auto"
                >
                    {turns.map((turn) => (
                        <DropdownMenuItem
                            key={turn.id}
                            aria-current={currentAnchorId === turn.id ? "location" : undefined}
                            onClick={() => jumpToTurn(turn.id)}
                            className="min-h-7 rounded-xl px-2 py-1.5 aria-current:bg-accent aria-current:text-accent-foreground"
                        >
                            <span className="line-clamp-1 min-w-0">{turn.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

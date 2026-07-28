import { cn } from "@/lib/utils";
import { useState } from "react";
import { marked } from "marked";
import type * as sdk from "ai";
import { Button } from "@base-ui/react";

export function ReasoningPart({ text, state }: sdk.ReasoningUIPart) {
    const [hidden, setHidden] = useState(true);
    const done = state === "done";
    if (!text) return null;
    return (
        <div>
            <Button
                className={cn(!done && "shimmer", "shimmer-color-white text-muted-foreground")}
                onClick={() => setHidden((v) => !v)}
            >
                Thinking
            </Button>
            {!hidden && (
                <div className="text-muted-foreground p-2 ltr:border-l-2">
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
                </div>
            )}
        </div>
    );
}

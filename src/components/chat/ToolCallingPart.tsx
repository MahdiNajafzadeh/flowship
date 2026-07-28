import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type * as sdk from "ai";
import { Button } from "@base-ui/react";

const formatValue = (value: unknown): string => {
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
};

export function ToolCallingPart({ type, state, input, output, errorText }: sdk.ToolUIPart): ReactNode {
    const [hidden, setHidden] = useState<boolean>(true);
    const done = useMemo(() => state.startsWith("output-"), [state]);
    const hasDetails = useMemo(
        () => input !== undefined || output !== undefined || errorText !== undefined,
        [input, output, errorText],
    );

    if (!hasDetails) return null;

    return (
        <div>
            <Button
                className={cn(
                    !done && "shimmer",
                    "shimmer-color-accent-foreground text-muted-foreground flex items-center gap-2",
                )}
                onClick={() => setHidden((v) => !v)}
            >
                Calling {type}
                {!done && "..."}
            </Button>
            <div hidden={hidden} className="flex flex-col gap-2 p-2 ltr:border-l-2 rtl:border-r-2 border-border">
                {input !== undefined && (
                    <pre className="max-w-full whitespace-pre-wrap break-all rounded-md bg-muted/30 p-2 font-mono text-[11px] text-foreground/80">
                        <code>{formatValue(input)}</code>
                    </pre>
                )}
                {output !== undefined && input !== undefined && <div className="h-px bg-border" />}
                {output !== undefined && (
                    <pre className="max-w-full whitespace-pre-wrap break-all rounded-md bg-muted/30 p-2 font-mono text-[11px] text-foreground/80">
                        <code>{formatValue(output)}</code>
                    </pre>
                )}
                {errorText !== undefined && (output !== undefined || input !== undefined) && (
                    <div className="h-px bg-border" />
                )}
                {errorText !== undefined && (
                    <pre className="max-w-full whitespace-pre-wrap break-all rounded-md bg-destructive/10 p-2 font-mono text-[11px] text-destructive/80">
                        <code>{errorText}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}

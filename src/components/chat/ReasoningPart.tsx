import { cn } from "@/lib/utils";
import { useState } from "react";
import Markdown from "react-markdown";
import type * as sdk from "ai";
import { Button } from "@base-ui/react";

export function ReasoningPart({ text, state }: sdk.ReasoningUIPart) {
	const [hidden, setHidden] = useState<boolean>(true);
	const done = state === "done";
	if (!text) return null;
	return (
		<div>
			<Button
				className={cn(!done && "shimmer", "text-lg shimmer-color-accent-foreground text-muted-foreground")}
				onClick={() => setHidden((v) => !v)}
			>
				Thinking{!done && "..."}
			</Button>
			<div hidden={hidden} className="text-muted-foreground p-2 ltr:border-l-2 rtl:border-r-2">
				<Markdown>{text}</Markdown>
			</div>
		</div>
	);
}

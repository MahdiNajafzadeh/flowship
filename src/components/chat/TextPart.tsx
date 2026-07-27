import type { ReactNode } from "react";
import Markdown from "react-markdown";

interface TextPartProps {
	text?: string;
}

export function TextPart({ text }: TextPartProps): ReactNode {
	if (!text) return null;

	return (
		<div className="space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:overflow-x-auto text-foreground">
			<Markdown>{text}</Markdown>
		</div>
	);
}

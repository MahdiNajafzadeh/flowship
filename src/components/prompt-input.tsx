import { ArrowUpIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
	onSend?: (message: string) => void;
	disabled?: boolean;
}

export default function PromptInput({
	onSend,
	disabled,
	...props
}: PromptInputProps) {
	const [input, setInput] = useState("");

	function handleSend() {
		if (input.trim() && onSend) {
			onSend(input);
			setInput("");
		}
	}

	return (
		<div
			{...props}
			className={cn(props.className, "flex flex-col gap-0.5")}
		>
			<InputGroup className="bg-background">
				<InputGroupTextarea
					placeholder="Ask me anything..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					disabled={disabled}
				/>
				<InputGroupAddon align="block-end">
					<InputGroupButton size="icon-xs" variant="ghost">
						<SparklesIcon />
					</InputGroupButton>
					<div className="ms-auto" />
					<InputGroupButton
						className="rounded-full"
						size="icon-xs"
						variant="default"
						onClick={handleSend}
						disabled={disabled}
					>
						<ArrowUpIcon />
						<span className="sr-only">Send</span>
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			<small className="text-center text-xs opacity-50 text-muted-foreground">
				llm can mistake
			</small>
		</div>
	);
}

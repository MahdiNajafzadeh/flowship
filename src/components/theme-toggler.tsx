import { useTheme } from "./theme-provider";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export default function ThemeToggler(
	props: React.HTMLAttributes<HTMLButtonElement>,
) {
	const { theme, setTheme } = useTheme();
	return (
		<AnimatedThemeToggler
			duration={750}
			theme={theme as any}
			onThemeChange={setTheme}
			{...props}
		/>
	);
}

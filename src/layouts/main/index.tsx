import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ThemeToggler from "@/components/theme-toggler";

export default function Main() {
	return (
		<>
			<SidebarProvider defaultOpen={true} className="w-screen h-screen">
				<AppSidebar />
				<main className="w-full h-full">
					<Outlet />
				</main>
			</SidebarProvider>
			<ThemeToggler className="fixed top-0 ltr:right-0 rtl:left-0 bg-sidebar-accent rounded-lg p-2 m-1" />
		</>
	);
}

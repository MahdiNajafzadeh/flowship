import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Main() {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="p-2">
                <Outlet />
            </main>
        </SidebarProvider>
    );
}

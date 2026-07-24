import {
    Archive,
    ChevronDown,
    Home,
    Settings,
    User2,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { t } from "@/lib/t";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

import { useTheme } from "./theme-provider";

export function AppSidebar() {
    const { setTheme, theme } = useTheme();
    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="flex justify-center-safe items-center-safe">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarTrigger />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t("sidebar.header.menu.title")}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Array.from({ length: 20 }).map((_, idx) => {
                                return (
                                    <SidebarMenuItem key={idx.toString()}>
                                        <Link to="/">
                                            <SidebarMenuButton>
                                                <Home />
                                                <span>
                                                    {t(
                                                        "sidebar.content.home.text",
                                                    )}
                                                </span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                            <SidebarMenuItem>
                                <Link to="/users">
                                    <SidebarMenuButton>
                                        <Users />
                                        <span>
                                            {t("sidebar.content.users.text")}
                                        </span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t("sidebar.content.settings.title")}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link to="/settings">
                                    <SidebarMenuButton>
                                        <Settings />
                                        <span>
                                            {t("sidebar.content.settings.text")}
                                        </span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <AnimatedThemeToggler
                                duration={750}
                                theme={theme as any}
                                onThemeChange={setTheme}
                            />
                            {theme}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User2 /> Username
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

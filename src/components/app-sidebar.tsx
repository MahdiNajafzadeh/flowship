import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    GalleryVerticalEndIcon,
    AudioLinesIcon,
    TerminalIcon,
    TerminalSquareIcon,
    BotIcon,
    BookOpenIcon,
    Settings2Icon,
    FrameIcon,
    PieChartIcon,
    MapIcon,
    PanelLeftOpen,
    PanelRightOpen,
    User,
} from "lucide-react";

// This is sample data.
const data = {
    user: {
        name: "mahdi najafzadeh",
        email: "mahdi.najafzadeh@partsoftware.com",
        avatar: "https://chat.partcorp.ir/avatar/mahdi.najafzadeh",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: <GalleryVerticalEndIcon />,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: <AudioLinesIcon />,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: <TerminalIcon />,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: <TerminalSquareIcon />,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: <BotIcon />,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: <BookOpenIcon />,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: <Settings2Icon />,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: <FrameIcon />,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: <PieChartIcon />,
        },
        {
            name: "Travel",
            url: "#",
            icon: <MapIcon />,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open, toggleSidebar } = useSidebar();
    return (
        <Sidebar variant="floating" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenuButton>
                    <User />
                </SidebarMenuButton>
                <SidebarMenuButton onClick={toggleSidebar}>
                    {open ? <PanelRightOpen /> : <PanelLeftOpen />}
                    <span>collapse</span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}

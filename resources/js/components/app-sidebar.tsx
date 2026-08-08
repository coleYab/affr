import { Link, usePage } from '@inertiajs/react';
import { BadgeCheck, Bell, CreditCard, Gift, Home, LayoutGrid, RefreshCw, Settings, Ticket, Users } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/hooks/use-language';
import { dashboard } from '@/routes';
import { mypayments } from '@/routes';
import { settings as adminSettings, notifications as adminNotifications, payments as adminPayments, prize as adminPrize, users, dashboard as adminDashboard, cycle } from '@/routes/admin';
import { mytickets, mynotifications } from '@/routes/user';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavLabels = {
    en: {
        dashboard: 'Home',
        myTickets: 'Tickets',
        myPayments: 'Payments',
        notifications: 'Notifications',
    },
    am: {
        dashboard: 'መነሻ',
        myTickets: 'ቲኬቶች',
        myPayments: 'ክፍያዎች',
        notifications: 'ማሳወቂያዎች',
    },
} as const;

const adminNavLabels = {
    en: {
        adminDashboard: 'Admin Dashboard',
        cycleManagement: 'Cycle Management',
        prizeManagement: 'Prize Management',
        userManagement: 'User Management',
        validatePayments: 'Validate Payments',
        adminNotifications: 'Admin Notifications',
        appSettings: 'App Settings',
    },
    am: {
        adminDashboard: 'የአስተዳዳሪ ዳሽቦርድ',
        cycleManagement: 'የዙር አስተዳደር',
        prizeManagement: 'የሽልማት አስተዳደር',
        userManagement: 'የተጠቃሚ አስተዳደር',
        validatePayments: 'ክፍያ ማረጋገጫ',
        adminNotifications: 'የአስተዳዳሪ ማሳወቂያዎች',
        appSettings: 'የመተግበሪያ ቅንብሮች',
    },
} as const;

export function AppSidebar() {
    const { language } = useLanguage();
    const labels = mainNavLabels[language];
    const adminLabels = adminNavLabels[language];

    const mainNavItems: NavItem[] = [
        {
            title: labels.dashboard,
            href: dashboard(),
            icon: Home,
        },
        {
            title: labels.myTickets,
            href: mytickets(),
            icon: Ticket,
        },
        {
            title: labels.myPayments,
            href: mypayments(),
            icon: CreditCard,
        },
        {
            title: labels.notifications,
            href: mynotifications(),
            icon: Bell,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: adminLabels.adminDashboard,
            href: adminDashboard(),
            icon: LayoutGrid,
        },
        {
            title: adminLabels.cycleManagement,
            href: cycle(),
            icon: RefreshCw,
        },
        {
            title: adminLabels.prizeManagement,
            href: adminPrize(),
            icon: Gift,
        },
        {
            title: adminLabels.userManagement,
            href: users(),
            icon: Users,
        },
        {
            title: adminLabels.validatePayments,
            href: adminPayments(),
            icon: BadgeCheck,
        },
        {
            title: adminLabels.adminNotifications,
            href: adminNotifications(),
            icon: Bell,
        },
        {
            title: adminLabels.appSettings,
            href: adminSettings(),
            icon: Settings,
        },
    ];

    const user = usePage().props.auth.user;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {(user.is_admin === '1' || user.is_admin === 1 || user.is_admin === true) ?
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    : null
                }
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

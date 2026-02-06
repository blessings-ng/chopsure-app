import { LayoutDashboard, Wallet, Store, Users, Receipt } from "lucide-react";

export const navItems = {
  worker: [
    { name: "My Wallet", href: "/worker", icon: Wallet },
    { name: "Vendors", href: "/worker/vendors", icon: Store },
    { name: "History", href: "/worker/history", icon: Receipt },
  ],
  employer: [
    { name: "Staff Overview", href: "/employer", icon: LayoutDashboard },
    { name: "Manage Staff", href: "/employer/staff", icon: Users },
    { name: "Billing", href: "/employer/billing", icon: Receipt },
  ],
  vendor: [
    { name: "Sales Feed", href: "/vendor", icon: LayoutDashboard },
    { name: "Settlements", href: "/vendor/payout", icon: Wallet },
  ],
};
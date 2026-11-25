import {
  Bot,
  Bug,
  ChartColumn,
  CirclePlay,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export const navSections = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }],
  },
  {
    label: "Quality",
    items: [
      { label: "Test Management", to: "/test-management", icon: ClipboardList },
      { label: "Test Execution", to: "/test-execution", icon: CirclePlay },
      { label: "Defect Management", to: "/defects", icon: Bug },
      { label: "Automation Reports", to: "/automation", icon: Bot },
      { label: "Test Reports", to: "/reports", icon: ChartColumn },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Team Management", to: "/team", icon: Users },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

export function findNavItem(pathname) {
  const items = navSections.flatMap((section) => section.items);
  return items.find((item) => item.to === pathname) ?? items[0];
}

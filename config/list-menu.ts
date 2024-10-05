// list-menu.ts
import {
  Home,
  Box,
  ClipboardList,
  ClipboardCheck,
  UserPlus,
  Boxes,
  ScrollText,
} from "lucide-react";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  srLabel: string;
}

export const menuItems: MenuItem[] = [
  {
    href: "",
    icon: Home,
    label: "แผงควบคุม",
    srLabel: "แผงควบคุม",
  },
  {
    href: "/manage-items",
    icon: Box,
    label: "จัดการรายการ",
    srLabel: "จัดการรายการ",
  },
  {
    href: "/manage-users",
    icon: UserPlus,
    label: "จัดการผู้ใช้งาน",
    srLabel: "จัดการผู้ใช้งาน",
  },
  {
    href: "/borrowing",
    icon: ClipboardList,
    label: "การทำรายการยืมรออนุมัติ",
    srLabel: "การทำรายการยืมรออนุมัติ",
  },
  {
    href: "/returning",
    icon: ClipboardCheck,
    label: "การทำรายการคืนรออนุมัติ",
    srLabel: "การทำรายการคืนรออนุมัติ",
  },
  {
    href: "/transactions",
    icon: ScrollText,
    label: "การทำรายการยืม/คืน",
    srLabel: "การทำรายการยืม/คืน",
  },
  {
    href: "/categories",
    icon: Boxes,
    label: "หมวดหมู่",
    srLabel: "หมวดหมู่",
  },
];

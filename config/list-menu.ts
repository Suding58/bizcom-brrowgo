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
import { MenuItem } from "@/interface";

export const menuItems: MenuItem[] = [
  {
    href: "",
    icon: Home,
    label: "แผงควบคุม",
    srLabel: "แผงควบคุม",
    notifications: 0,
  },
  {
    href: "/manage-items",
    icon: Box,
    label: "จัดการรายการ",
    srLabel: "จัดการรายการ",
    notifications: 0,
  },
  {
    href: "/manage-users",
    icon: UserPlus,
    label: "จัดการผู้ใช้งาน",
    srLabel: "จัดการผู้ใช้งาน",
    notifications: 0,
  },
  {
    href: "/borrowing",
    icon: ClipboardList,
    label: "การทำรายการยืมรออนุมัติ",
    srLabel: "การทำรายการยืมรออนุมัติ",
    notifications: 0,
  },
  {
    href: "/returning",
    icon: ClipboardCheck,
    label: "การทำรายการคืนรออนุมัติ",
    srLabel: "การทำรายการคืนรออนุมัติ",
    notifications: 0,
  },
  {
    href: "/transactions",
    icon: ScrollText,
    label: "การทำรายการยืม/คืน",
    srLabel: "การทำรายการยืม/คืน",
    notifications: 0,
  },
  {
    href: "/categories",
    icon: Boxes,
    label: "หมวดหมู่",
    srLabel: "หมวดหมู่",
    notifications: 0,
  },
];

import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FileText,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DetailTabDefinition, MenuDefinition, MenuKey } from "./hr.types";

type DashboardStatDefinition = {
  title: string;
  icon: LucideIcon;
  color: string;
  target: MenuKey;
};

export const menuItems: MenuDefinition[] = [
  { key: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { key: "employees", label: "ทะเบียนพนักงาน", icon: Users },
  {
    key: "attendance",
    label: "เวลาทำงาน & การลา",
    icon: CalendarClock,
    href: "/dashboard/leaves",
  },
  { key: "payroll", label: "ระบบเงินเดือน", icon: CircleDollarSign },
];

export const menuTitles: Record<MenuKey, string> = {
  dashboard: "ภาพรวมระบบ (Dashboard)",
  employees: "ทะเบียนประวัติพนักงาน",
  attendance: "ระบบจัดการเวลาทำงานและการลา",
  payroll: "ระบบจัดการเงินเดือนและค่าตอบแทน",
};

export const dashboardStats: DashboardStatDefinition[] = [
  {
    title: "พนักงานทั้งหมด",
    icon: Users,
    color: "bg-blue-500",
    target: "employees",
  },
  {
    title: "ลางานวันนี้",
    icon: CalendarClock,
    color: "bg-orange-500",
    target: "attendance",
  },
  {
    title: "มาสายวันนี้",
    icon: Clock,
    color: "bg-red-500",
    target: "attendance",
  },
  {
    title: "รอบเงินเดือนถัดไป",
    icon: CircleDollarSign,
    color: "bg-emerald-500",
    target: "payroll",
  },
];

export const employeeDetailTabs: DetailTabDefinition[] = [
  { key: "info", label: "ข้อมูลพื้นฐาน & เอกสาร", icon: FileText },
  {
    key: "attendance",
    label: "ประวัติ ลา/ขาด/สาย",
    icon: CalendarClock,
  },
  { key: "payroll", label: "ข้อมูลเงินเดือน", icon: CircleDollarSign },
  {
    key: "warnings",
    label: "ประวัติการตักเตือน",
    icon: AlertTriangle,
  },
];

export const statusStyles = {
  ปกติ: "bg-green-100 text-green-700 border-green-200",
  ลางาน: "bg-orange-100 text-orange-700 border-orange-200",
  ลาพักร้อน: "bg-orange-100 text-orange-700 border-orange-200",
  ลาป่วย: "bg-yellow-100 text-yellow-700 border-yellow-200",
  มาสาย: "bg-red-100 text-red-700 border-red-200",
} as const;

export function formatThaiCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDisplayDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getCurrentMonthThai(): string {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return months[new Date().getMonth()];
}

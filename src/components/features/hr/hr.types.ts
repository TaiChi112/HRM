import type { LucideIcon } from "lucide-react";

export type {
  AttendanceRecord,
  Employee,
  PayrollRecord,
  Status,
} from "../../../modules/hr/hr.types";

export type MenuKey = "dashboard" | "employees" | "attendance" | "payroll";
export type DetailTabKey = "info" | "attendance" | "payroll" | "warnings";

export type MenuDefinition = {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
  href?: string;
};

export type DashboardStat = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  target: MenuKey;
};

export type DetailTabDefinition = {
  key: DetailTabKey;
  label: string;
  icon: LucideIcon;
};

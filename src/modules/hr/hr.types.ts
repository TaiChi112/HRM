export type Status = "ปกติ" | "ลางาน" | "ลาพักร้อน" | "ลาป่วย" | "มาสาย";

export type EmployeeStatus = Extract<Status, "ปกติ" | "ลางาน">;
export type AttendanceType = Extract<Status, "ลาพักร้อน" | "ลาป่วย" | "มาสาย">;

export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: EmployeeStatus;
};

export type AttendanceRecord = {
  date: string;
  empId: string;
  name: string;
  type: AttendanceType;
  note: string;
};

export type PayrollRecord = {
  empId: string;
  name: string;
  base: number;
  commission: number;
  allowance: number;
  deduct: number;
  total: number;
};

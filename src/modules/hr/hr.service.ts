import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";
import { Pool } from "pg";
import type { AttendanceRecord, Employee, PayrollRecord } from "./hr.types";

declare global {
  var __hrEasyPgPool: Pool | undefined;
  var __hrEasyPrismaClient: PrismaClient | undefined;
}

const fallbackEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "สมชาย ใจดี",
    position: "ผู้จัดการฝ่ายขาย",
    department: "ฝ่ายขาย",
    startDate: "2020-01-15",
    salary: 35000,
    status: "ปกติ",
  },
  {
    id: "EMP-002",
    name: "สมหญิง รักงาน",
    position: "พนักงานบัญชี",
    department: "บัญชีและการเงิน",
    startDate: "2021-03-01",
    salary: 25000,
    status: "ปกติ",
  },
  {
    id: "EMP-003",
    name: "มานะ อดทน",
    position: "เจ้าหน้าที่ IT",
    department: "ไอที",
    startDate: "2022-06-10",
    salary: 28000,
    status: "ลางาน",
  },
  {
    id: "EMP-004",
    name: "ปิติ ดีใจ",
    position: "พนักงานขาย",
    department: "ฝ่ายขาย",
    startDate: "2023-01-05",
    salary: 18000,
    status: "ปกติ",
  },
  {
    id: "EMP-005",
    name: "ชูใจ ร่าเริง",
    position: "ฝ่ายบุคคล",
    department: "ทรัพยากรบุคคล",
    startDate: "2019-11-20",
    salary: 30000,
    status: "ปกติ",
  },
];

const fallbackAttendance: AttendanceRecord[] = [
  {
    date: "2023-10-25",
    empId: "EMP-003",
    name: "มานะ อดทน",
    type: "ลาป่วย",
    note: "ไข้หวัดใหญ่",
  },
  {
    date: "2023-10-25",
    empId: "EMP-004",
    name: "ปิติ ดีใจ",
    type: "มาสาย",
    note: "สาย 15 นาที",
  },
  {
    date: "2023-10-24",
    empId: "EMP-001",
    name: "สมชาย ใจดี",
    type: "ลาพักร้อน",
    note: "พาครอบครัวไปเที่ยว",
  },
];

const fallbackPayroll: PayrollRecord[] = [
  {
    empId: "EMP-001",
    name: "สมชาย ใจดี",
    base: 35000,
    commission: 15000,
    allowance: 0,
    deduct: 0,
    total: 50000,
  },
  {
    empId: "EMP-002",
    name: "สมหญิง รักงาน",
    base: 25000,
    commission: 0,
    allowance: 1000,
    deduct: 0,
    total: 26000,
  },
  {
    empId: "EMP-003",
    name: "มานะ อดทน",
    base: 28000,
    commission: 0,
    allowance: 1000,
    deduct: 500,
    total: 28500,
  },
  {
    empId: "EMP-004",
    name: "ปิติ ดีใจ",
    base: 18000,
    commission: 5000,
    allowance: 1000,
    deduct: 200,
    total: 23800,
  },
];

function cloneRecords<TRecord>(records: TRecord[]): TRecord[] {
  return records.map((record) => ({ ...record }));
}

function filterEmployeesBySearch(
  employees: Employee[],
  search: string,
): Employee[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (normalizedSearch.length === 0) {
    return employees;
  }

  return employees.filter((employee) => {
    return [employee.id, employee.name].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
  });
}

function createPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!globalThis.__hrEasyPgPool) {
    globalThis.__hrEasyPgPool = new Pool({ connectionString });
  }

  if (!globalThis.__hrEasyPrismaClient) {
    const adapter = new PrismaPg(globalThis.__hrEasyPgPool, {
      disposeExternalPool: false,
    });

    globalThis.__hrEasyPrismaClient = new PrismaClient({ adapter });
  }

  return globalThis.__hrEasyPrismaClient;
}

function getPrismaClient(): PrismaClient | null {
  try {
    return createPrismaClient();
  } catch (error: unknown) {
    console.warn("[Fallback] DB connection failed, returning mock data", error);
    return null;
  }
}

function isFallbackError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /P1001|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|connection/i.test(
    error.message,
  );
}

function toEmployee(record: {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: string;
}): Employee {
  return {
    id: record.id,
    name: record.name,
    position: record.position,
    department: record.department,
    startDate: record.startDate,
    salary: record.salary,
    status: record.status === "ลางาน" ? "ลางาน" : "ปกติ",
  };
}

function toAttendance(record: {
  date: string;
  empId: string;
  name: string;
  type: string;
  note: string;
}): AttendanceRecord {
  const type: AttendanceRecord["type"] =
    record.type === "ลาพักร้อน" || record.type === "ลาป่วย" || record.type === "มาสาย"
      ? record.type
      : "ลาป่วย";

  return {
    date: record.date,
    empId: record.empId,
    name: record.name,
    type,
    note: record.note,
  };
}

function toPayroll(record: {
  empId: string;
  name: string;
  base: number;
  commission: number;
  allowance: number;
  deduct: number;
  total: number;
}): PayrollRecord {
  return {
    empId: record.empId,
    name: record.name,
    base: record.base,
    commission: record.commission,
    allowance: record.allowance,
    deduct: record.deduct,
    total: record.total,
  };
}

async function executeWithFallback<TRecord>(
  fallbackRecords: TRecord[],
  query: (client: PrismaClient) => Promise<TRecord[]>,
): Promise<TRecord[]> {
  const prisma = getPrismaClient();

  if (!prisma) {
    console.warn("[Fallback] DB connection failed, returning mock data");
    return cloneRecords(fallbackRecords);
  }

  try {
    return await query(prisma);
  } catch (error: unknown) {
    if (isFallbackError(error)) {
      console.warn("[Fallback] DB connection failed, returning mock data", error);
      return cloneRecords(fallbackRecords);
    }

    throw error;
  }
}

export const hrService = {
  async getEmployees(search?: string): Promise<Employee[]> {
    const filteredFallbackEmployees = filterEmployeesBySearch(
      fallbackEmployees,
      search ?? "",
    );

    return executeWithFallback(filteredFallbackEmployees, async (client) => {
      const normalizedSearch = search?.trim();

      const employees = await client.employee.findMany({
        orderBy: {
          id: "asc",
        },
        ...(normalizedSearch
          ? {
              where: {
                OR: [
                  {
                    name: {
                      contains: normalizedSearch,
                      mode: "insensitive",
                    },
                  },
                  {
                    id: {
                      contains: normalizedSearch,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            }
          : {}),
      });

      return employees.map(toEmployee);
    });
  },

  async getAttendance(): Promise<AttendanceRecord[]> {
    return executeWithFallback(fallbackAttendance, async (client) => {
      const attendance = await client.attendance.findMany({
        orderBy: {
          date: "desc",
        },
      });

      return attendance.map(toAttendance);
    });
  },

  async getPayroll(): Promise<PayrollRecord[]> {
    return executeWithFallback(fallbackPayroll, async (client) => {
      const payroll = await client.payroll.findMany({
        orderBy: {
          empId: "asc",
        },
      });

      return payroll.map(toPayroll);
    });
  },
};

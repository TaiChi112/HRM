import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

type SeedEmployee = {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: string;
};

type SeedAttendance = {
  date: string;
  empId: string;
  name: string;
  type: string;
  note: string;
};

type SeedPayroll = {
  empId: string;
  name: string;
  base: number;
  commission: number;
  allowance: number;
  deduct: number;
  total: number;
};

const employees: SeedEmployee[] = [
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

const attendance: SeedAttendance[] = [
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

const payroll: SeedPayroll[] = [
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

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool, {
      disposeExternalPool: false,
    }),
  });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany();
      await tx.payroll.deleteMany();
      await tx.employee.deleteMany();

      await tx.employee.createMany({ data: employees });
      await tx.attendance.createMany({ data: attendance });
      await tx.payroll.createMany({ data: payroll });
    });

    console.log(
      `Seeded ${employees.length} employees, ${attendance.length} attendance rows, and ${payroll.length} payroll rows.`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error("Database seed failed:", error);
  process.exitCode = 1;
});
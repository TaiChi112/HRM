import { Elysia, t } from "elysia";
import { hrService } from "./hr.service";

const EmployeeStatusSchema = t.Union([t.Literal("ปกติ"), t.Literal("ลางาน")]);
const AttendanceTypeSchema = t.Union([
  t.Literal("ลาพักร้อน"),
  t.Literal("ลาป่วย"),
  t.Literal("มาสาย"),
]);

const EmployeeSchema = t.Object({
  id: t.String(),
  name: t.String(),
  position: t.String(),
  department: t.String(),
  startDate: t.String(),
  salary: t.Number(),
  status: EmployeeStatusSchema,
});

const AttendanceSchema = t.Object({
  date: t.String(),
  empId: t.String(),
  name: t.String(),
  type: AttendanceTypeSchema,
  note: t.String(),
});

const PayrollSchema = t.Object({
  empId: t.String(),
  name: t.String(),
  base: t.Number(),
  commission: t.Number(),
  allowance: t.Number(),
  deduct: t.Number(),
  total: t.Number(),
});

const EmployeeQuerySchema = t.Object({
  search: t.Optional(t.String()),
});

export const hrController = new Elysia({ prefix: "/hr" })
  .get(
    "/employees",
    ({ query }) => hrService.getEmployees(query.search),
    {
      query: EmployeeQuerySchema,
      response: t.Array(EmployeeSchema),
    },
  )
  .get("/attendance", () => hrService.getAttendance(), {
    response: t.Array(AttendanceSchema),
  })
  .get("/payroll", () => hrService.getPayroll(), {
    response: t.Array(PayrollSchema),
  });

-- CreateTable
CREATE TABLE "Employee" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "startDate" VARCHAR(10) NOT NULL,
    "salary" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "empId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "note" VARCHAR(255) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "empId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "base" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "allowance" INTEGER NOT NULL,
    "deduct" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_empId_idx" ON "Attendance"("empId");

-- CreateIndex
CREATE INDEX "Payroll_empId_idx" ON "Payroll"("empId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

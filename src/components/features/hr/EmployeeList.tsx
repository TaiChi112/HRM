"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { client, unwrapEdenResponse } from "../../../lib/api-client";
import { formatDisplayDate, formatThaiCurrency } from "./hr.constants";
import { StatusBadge } from "../../ui/StatusBadge";
import type { Employee } from "./hr.types";

type EmployeeListProps = {
  onSelect: (employee: Employee) => void;
};

export function EmployeeList({ onSelect }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employees = [], error, isLoading } = useSWR<Employee[]>(
    "hr-employees",
    () => unwrapEdenResponse(client.api.hr.employees.get()),
  );

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (normalizedSearch.length === 0) {
      return employees;
    }

    return employees.filter((employee) => {
      const searchableText = [employee.id, employee.name, employee.position, employee.department]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [employees, searchTerm]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">กำลังโหลดทะเบียนพนักงาน...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
        {error instanceof Error ? error.message : "ไม่สามารถโหลดทะเบียนพนักงานได้"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:gap-4 sm:p-5 md:flex-row md:items-center">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัสพนักงาน..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <Plus className="h-4 w-4" /> + เพิ่มพนักงาน
        </button>
      </div>

      <div className="divide-y divide-gray-100 md:hidden">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="p-4 hover:bg-gray-50">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-500">{employee.id}</p>
              </div>
              <StatusBadge status={employee.status} />
            </div>
            <div className="mb-3 space-y-1 text-sm text-gray-600">
              <p>{employee.position}</p>
              <p className="text-xs text-gray-500">{employee.department}</p>
              <p className="text-xs text-gray-500">
                เริ่มงาน: {formatDisplayDate(employee.startDate)}
              </p>
              <p className="text-xs text-gray-500">
                เงินเดือน: {formatThaiCurrency(employee.salary)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(employee)}
              className="w-full rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              ดูข้อมูล
            </button>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
              <th className="p-4 font-medium">รหัส</th>
              <th className="p-4 font-medium">ชื่อ - นามสกุล</th>
              <th className="p-4 font-medium">ตำแหน่ง / แผนก</th>
              <th className="p-4 font-medium">วันเริ่มงาน</th>
              <th className="p-4 font-medium">เงินเดือน</th>
              <th className="p-4 font-medium">สถานะ</th>
              <th className="p-4 text-center font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="transition-colors hover:bg-blue-50/50"
              >
                <td className="p-4 text-gray-500">{employee.id}</td>
                <td className="p-4 font-medium text-gray-900">
                  {employee.name}
                </td>
                <td className="p-4">
                  <div>{employee.position}</div>
                  <div className="text-xs text-gray-500">{employee.department}</div>
                </td>
                <td className="p-4">{formatDisplayDate(employee.startDate)}</td>
                <td className="p-4">{formatThaiCurrency(employee.salary)}</td>
                <td className="p-4">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => onSelect(employee)}
                    className="rounded-md px-3 py-1 text-blue-600 transition-colors hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    ดูข้อมูล
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

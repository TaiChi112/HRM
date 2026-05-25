"use client";

import {
  AlertTriangle,
  Briefcase,
  FileBadge,
  FileText,
  X,
} from "lucide-react";
import { employeeDetailTabs, formatThaiCurrency } from "./hr.constants";
import type { DetailTabKey, Employee } from "./hr.types";
import { StatusBadge } from "../../ui/StatusBadge";
import { TabButton } from "../../ui/TabButton";

type EmployeeDetailProps = {
  employee: Employee;
  activeTab: DetailTabKey;
  onTabChange: (tab: DetailTabKey) => void;
  onBack: () => void;
};

export function EmployeeDetail({
  employee,
  activeTab,
  onTabChange,
  onBack,
}: EmployeeDetailProps) {
  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 flex items-center gap-2 rounded text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 md:mb-4"
      >
        <X className="h-4 w-4" /> ปิดหน้าต่าง
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4 bg-linear-to-r from-blue-600 to-indigo-700 p-4 text-white sm:flex-row sm:gap-6 sm:p-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-2xl font-bold backdrop-blur-sm sm:h-24 sm:w-24 sm:text-3xl">
            {employee.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="mb-1 text-xl font-bold sm:text-2xl">{employee.name}</h2>
            <p className="flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
              <Briefcase className="h-4 w-4" /> {employee.position}
            </p>
            <p className="text-xs text-blue-100 sm:text-sm">{employee.department}</p>
            <p className="mt-2 flex flex-col items-center gap-1 text-xs text-blue-100 sm:flex-row sm:gap-3">
              <span>
                <FileBadge className="mr-1 inline h-3 w-3" />
                รหัส: {employee.id}
              </span>
              <span className="hidden sm:inline">|</span>
              <span>เริ่มงาน: {employee.startDate}</span>
            </p>
          </div>
        </div>

        <div
          className="flex overflow-x-auto border-b border-gray-200 px-2"
          style={{ overscrollBehavior: "contain" }}
        >
          {employeeDetailTabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>

        <div className="min-h-75 bg-gray-50/50 p-4 sm:p-6">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h4 className="mb-4 border-b pb-2 font-semibold text-gray-800">
                  ข้อมูลส่วนตัว
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">วันเกิด:</span>
                    <span>15 เมษายน 2530</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                    <span>081-234-5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">อีเมล:</span>
                    <span>somchai@company.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ที่อยู่:</span>
                    <span>123 ซอยลาดพร้าว กรุงเทพฯ</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h4 className="mb-4 flex justify-between border-b pb-2 font-semibold text-gray-800">
                  <span>เอกสารพนักงาน</span>
                  <button
                    type="button"
                    className="rounded text-xs text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    + อัปโหลด
                  </button>
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สำเนาบัตรประชาชน.pdf
                  </div>
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สำเนาทะเบียนบ้าน.pdf
                  </div>
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สัญญาจ้างงาน.pdf
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-3 font-medium">วันที่</th>
                    <th className="p-3 font-medium">ประเภท</th>
                    <th className="p-3 font-medium">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3">2023-10-25</td>
                    <td className="p-3">
                      <StatusBadge status="ลาป่วย" />
                    </td>
                    <td className="p-3 text-gray-600">ไข้หวัดใหญ่</td>
                  </tr>
                  <tr>
                    <td className="p-3">2023-10-20</td>
                    <td className="p-3">
                      <StatusBadge status="ลาพักร้อน" />
                    </td>
                    <td className="p-3 text-gray-600">ลาตามประสงค์</td>
                  </tr>
                  <tr>
                    <td className="p-3">2023-10-15</td>
                    <td className="p-3">
                      <StatusBadge status="ปกติ" />
                    </td>
                    <td className="p-3 text-gray-600">ปกติ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payroll" && (
            <div className="max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="mb-4 border-b pb-2 font-semibold text-gray-800">
                โครงสร้างรายได้/เดือน
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">เงินเดือนพื้นฐาน:</span>
                  <span className="text-lg font-medium">
                    {formatThaiCurrency(employee.salary)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">เบี้ยขยัน (สูงสุด):</span>
                  <span className="font-medium text-green-600">
                    + {formatThaiCurrency(1000)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ค่าคอมมิชชั่น:</span>
                  <span className="font-medium text-blue-600">ตามยอดขาย</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="rounded-lg border border-red-100 bg-red-50/30 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold text-red-800">
                  <AlertTriangle className="h-5 w-5" /> ประวัติการตักเตือน
                </h4>
                <button
                  type="button"
                  className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  + เพิ่มใบเตือน
                </button>
              </div>
              <div className="rounded border border-gray-100 bg-white py-8 text-center text-sm text-gray-500">
                ไม่มีประวัติการตักเตือน (พฤติกรรมดีเยี่ยม)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

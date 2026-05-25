"use client";

import useSWR from "swr";
import { client, unwrapEdenResponse } from "../../../lib/api-client";
import { formatThaiCurrency, getCurrentMonthThai } from "./hr.constants";
import type { PayrollRecord } from "./hr.types";

export function PayrollView() {
  const { data: payroll = [], error, isLoading } = useSWR<PayrollRecord[]>(
    "hr-payroll",
    () => unwrapEdenResponse(client.api.hr.payroll.get()),
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">กำลังโหลดข้อมูลเงินเดือน...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
        {error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลเงินเดือนได้"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:gap-4 sm:p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">
            เงินเดือนประจำเดือน {getCurrentMonthThai()}
          </h3>
          <p className="text-xs text-gray-500 sm:text-sm">
            จำนวนพนักงาน: {payroll.length} คน
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            📥 ส่งออก Excel
          </button>
          <button
            type="button"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-300"
          >
            ✓ ยืนยันจ่ายเงินเดือน {getCurrentMonthThai()}
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100 md:hidden">
        {payroll.map((record) => (
          <div key={record.empId} className="p-4 hover:bg-gray-50">
            <div className="mb-2">
              <p className="font-medium text-gray-900">{record.name}</p>
              <p className="text-xs text-gray-500">{record.empId}</p>
            </div>
            <div className="space-y-1 text-xs text-gray-600 sm:text-sm">
              <div className="flex justify-between">
                <span>เงินเดือน:</span>
                <span>{formatThaiCurrency(record.base)}</span>
              </div>
              {record.commission > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>ค่าคอมฯ:</span>
                  <span>{formatThaiCurrency(record.commission)}</span>
                </div>
              )}
              {record.allowance > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>เบี้ยขยัน:</span>
                  <span>{formatThaiCurrency(record.allowance)}</span>
                </div>
              )}
              {record.deduct > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>หัก:</span>
                  <span>-{formatThaiCurrency(record.deduct)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-1 font-bold text-blue-800">
                <div className="flex justify-between">
                  <span>รับสุทธิ:</span>
                  <span>{formatThaiCurrency(record.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-medium">รหัส</th>
              <th className="p-3 font-medium">ชื่อพนักงาน</th>
              <th className="p-3 text-right font-medium">เงินเดือน (Base)</th>
              <th className="p-3 text-right font-medium text-blue-600">ค่าคอมฯ</th>
              <th className="p-3 text-right font-medium text-green-600">เบี้ยขยัน</th>
              <th className="p-3 text-right font-medium text-red-600">หักสาย/ลา</th>
              <th className="bg-blue-50 p-3 text-right font-medium">รับสุทธิ (Net)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payroll.map((record) => (
              <tr key={record.empId} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{record.empId}</td>
                <td className="p-3 font-medium">{record.name}</td>
                <td className="p-3 text-right">{formatThaiCurrency(record.base)}</td>
                <td className="p-3 text-right">
                  {record.commission > 0 ? formatThaiCurrency(record.commission) : "-"}
                </td>
                <td className="p-3 text-right">
                  {record.allowance > 0 ? formatThaiCurrency(record.allowance) : "-"}
                </td>
                <td className="p-3 text-right text-red-500">
                  {record.deduct > 0
                    ? `-${formatThaiCurrency(record.deduct)}`
                    : "-"}
                </td>
                <td className="bg-blue-50/50 p-3 text-right font-bold text-blue-800">
                  {formatThaiCurrency(record.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

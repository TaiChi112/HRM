"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { formatDisplayDate, formatThaiCurrency } from "./hr.constants";
import { StatusBadge } from "../../ui/StatusBadge";
import type { Employee } from "./hr.types";

type EmployeeDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function EmployeeDetailModal({ isOpen, onClose, employee }: EmployeeDetailModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-detail-title"
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Employee Details
            </p>
            <h2 id="employee-detail-title" className="mt-2 text-2xl font-semibold text-slate-900">
              {employee.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">รายละเอียดพนักงานแบบสรุป</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close employee details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <DetailRow label="Employee ID" value={employee.id} />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Status
            </p>
            <div className="mt-2">
              <StatusBadge status={employee.status} />
            </div>
          </div>
          <DetailRow label="Position" value={employee.position} />
          <DetailRow label="Department" value={employee.department} />
          <DetailRow label="Start Date" value={formatDisplayDate(employee.startDate)} />
          <DetailRow label="Salary" value={formatThaiCurrency(employee.salary)} />
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

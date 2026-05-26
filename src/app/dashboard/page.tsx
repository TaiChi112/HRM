"use client";

import { Menu, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AttendanceView } from "../../components/features/hr/AttendanceView";
import { DashboardView } from "../../components/features/hr/DashboardView";
import { EmployeeDetail } from "../../components/features/hr/EmployeeDetail";
import { EmployeeList } from "../../components/features/hr/EmployeeList";
import { menuItems, menuTitles } from "../../components/features/hr/hr.constants";
import type { DetailTabKey, Employee, MenuKey } from "../../components/features/hr/hr.types";
import { PayrollView } from "../../components/features/hr/PayrollView";
import { MenuButton } from "../../components/ui/MenuButton";
import { UserProfileDropdown } from "../../components/ui/UserProfileDropdown";
import { client } from "../../lib/api-client";
import { useDashboardSession } from "./session-context";

function isMenuKey(value: string | null): value is MenuKey {
  return (
    value === "dashboard" ||
    value === "employees" ||
    value === "attendance" ||
    value === "payroll"
  );
}

function isDetailTabKey(value: string | null): value is DetailTabKey {
  return (
    value === "info" ||
    value === "attendance" ||
    value === "payroll" ||
    value === "warnings"
  );
}

function renderActiveView(
  activeMenu: MenuKey,
  onNavigate: (menu: MenuKey) => void,
  onSelectEmployee: (employee: Employee) => void,
) {
  switch (activeMenu) {
    case "dashboard":
      return <DashboardView onNavigate={onNavigate} />;
    case "employees":
      return <EmployeeList onSelect={onSelectEmployee} />;
    case "attendance":
      return <AttendanceView />;
    case "payroll":
      return <PayrollView />;
    default:
      return <DashboardView onNavigate={onNavigate} />;
  }
}

function PageContent() {
  const sessionUser = useDashboardSession();
  const searchParams = useSearchParams();
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTabKey>("info");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSelectionHydrated, setIsSelectionHydrated] = useState(
    searchParams.get("empId") === null,
  );

  const menuParam = searchParams.get("menu");
  const currentMenu = selectedEmployee
    ? "employees"
    : isMenuKey(menuParam)
      ? menuParam
      : activeMenu;

  const tabParam = searchParams.get("tab");
  const currentTab = isDetailTabKey(tabParam) ? tabParam : activeDetailTab;

  const employeeIdParam = searchParams.get("empId");

  useEffect(() => {
    let isActive = true;

    if (employeeIdParam === null) {
      queueMicrotask(() => {
        if (isActive) {
          setIsSelectionHydrated(true);
        }
      });
      return undefined;
    }

    async function resolveSelectedEmployee() {
      const response = await client.api.hr.employees.get();

      if (!isActive || response.error) {
        setIsSelectionHydrated(true);
        return;
      }

      const employees: Employee[] = response.data ?? [];
      const resolvedEmployee =
        employees.find((employee) => employee.id === employeeIdParam) ?? null;

      setSelectedEmployee(resolvedEmployee);

      if (resolvedEmployee) {
        setActiveMenu("employees");
      }

      setIsSelectionHydrated(true);
    }

    void resolveSelectedEmployee();

    return () => {
      isActive = false;
    };
  }, [employeeIdParam]);

  useEffect(() => {
    if (!isSelectionHydrated) {
      return;
    }

    const params = new URLSearchParams();
    params.set("menu", activeMenu);

    if (selectedEmployee) {
      params.set("empId", selectedEmployee.id);
      params.set("tab", activeDetailTab);
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [activeMenu, selectedEmployee, activeDetailTab, isSelectionHydrated]);

  const handleMenuChange = (menu: MenuKey) => {
    setActiveMenu(menu);
    setSelectedEmployee(null);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50 font-sans text-gray-800 md:flex-row">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <div className="rounded-lg bg-blue-500 p-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HR Easy</h1>
            <p className="text-xs text-slate-400">ระบบจัดการบุคคล</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <MenuButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={currentMenu === item.key}
              onClick={() => handleMenuChange(item.key)}
            />
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 text-center text-xs text-slate-400">
          รองรับพนักงานสูงสุด 50 คน
          <br />
          (ปัจจุบัน 45/50)
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prevOpen) => !prevOpen)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
              {menuTitles[currentMenu]}
            </h2>
          </div>
          <UserProfileDropdown
            user={{
              name: sessionUser?.name ?? null,
              email: sessionUser?.email ?? null,
              image: sessionUser?.image ?? null,
            }}
          />
        </header>

        <div className="relative flex-1 overflow-auto p-4 md:p-6">
          {selectedEmployee ? (
            <EmployeeDetail
              employee={selectedEmployee}
              activeTab={currentTab}
              onTabChange={setActiveDetailTab}
              onBack={() => setSelectedEmployee(null)}
            />
          ) : (
            renderActiveView(currentMenu, handleMenuChange, setSelectedEmployee)
          )}
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
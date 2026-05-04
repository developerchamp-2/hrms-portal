import { redirect } from "next/navigation";

import { AttendanceMarkPanel } from "@/components/attendance/attendance-mark-panel";
import { AttendanceSheet } from "@/components/attendance/attendance-sheet";
import {
  getAttendanceDashboard,
  getAttendanceOptions,
  getMonthlyAttendance,
} from "@/lib/actions/attendance";
import {
  getRoutePermissions,
  getUserPermissions,
  isEmployeeRole,
} from "@/lib/rbac";

export default async function MyAttendancePage() {
  const [permissions, user] = await Promise.all([
    getRoutePermissions("/attendance/my"),
    getUserPermissions(),
  ]);

  if (!permissions.canView) {
    redirect("/404");
  }

  if (!isEmployeeRole(user?.role?.name)) {
    redirect("/attendance");
  }

  const [dashboard, sheet, options] = await Promise.all([
    getAttendanceDashboard(),
    getMonthlyAttendance(),
    getAttendanceOptions(),
  ]);
  const employeeId =
    dashboard.currentEmployeeId || options.employees.at(0)?.id || "";
  const todayRecord = dashboard.todayRecords.find(
    (record) => record.employeeId === employeeId,
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Attendance
        </h1>
        <p className="text-sm text-slate-500">
          Check in, check out, and review your monthly attendance records.
        </p>
      </div>

      <AttendanceMarkPanel
        employeeId={employeeId}
        employees={options.employees}
        todayRecord={todayRecord}
        canCreate={permissions.canCreate}
      />

      <AttendanceSheet
        initialSheet={sheet}
        employees={options.employees}
        departments={options.departments}
        canFilterEmployees={false}
        title="My Monthly Records"
        compact
      />
    </div>
  );
}

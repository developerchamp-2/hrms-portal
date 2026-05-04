import { redirect } from "next/navigation";

import { AttendanceMarkPanel } from "@/components/attendance/attendance-mark-panel";
import {
  getAttendanceDashboard,
} from "@/lib/actions/attendance";
import {
  canManageAllAttendance,
  getRoutePermissions,
  getUserPermissions,
} from "@/lib/rbac";

export default async function MarkAttendancePage() {
  const permissions = await getRoutePermissions("/attendance");

  if (!permissions.canCreate) {
    redirect("/404");
  }

  const user = await getUserPermissions();
  if (!canManageAllAttendance(user?.role?.name)) {
    redirect("/attendance/my");
  }

  const dashboard = await getAttendanceDashboard();
  const employeeId = dashboard.currentEmployeeId;
  const todayRecord = dashboard.todayRecords.find(
    (record) => record.employeeId === employeeId,
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Check In
        </h1>
        <p className="text-sm text-slate-500">
          Record your own check-in and check-out for the current day.
        </p>
      </div>
      <AttendanceMarkPanel
        employeeId={employeeId}
        todayRecord={todayRecord}
        canCreate={permissions.canCreate}
      />
    </div>
  );
}

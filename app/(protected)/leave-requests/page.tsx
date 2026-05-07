import { redirect } from "next/navigation";

import { LeaveRequestReviewTable } from "@/components/leave-requests/leave-request-review-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  getLeaveDashboard,
  getLeaveRequests,
} from "@/lib/actions/leave-requests";
import { isCurrentEmployeeHr } from "@/lib/employee-job-role";
import {
  canManageAllAttendance,
  getRoutePermissions,
  getUserPermissions,
} from "@/lib/rbac";

export default async function LeaveRequestsPage() {
  const [permissions, user] = await Promise.all([
    getRoutePermissions("/leave-requests"),
    getUserPermissions(),
  ]);
  const isHrEmployee = await isCurrentEmployeeHr();

  if (
    (!permissions.canView || !canManageAllAttendance(user?.role?.name)) &&
    !isHrEmployee
  ) {
    redirect("/404");
  }

  const [requests, summary] = await Promise.all([
    getLeaveRequests(),
    getLeaveDashboard(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Leave Requests
        </h1>
        <p className="text-sm text-slate-500">
          Review employee leave requests and approve or reject pending items.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-5">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">
              {summary.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-5">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {summary.approved}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-5">
            <p className="text-sm text-slate-500">Rejected</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">
              {summary.rejected}
            </p>
          </CardContent>
        </Card>
      </div>

      <LeaveRequestReviewTable initialRequests={requests} />
    </div>
  );
}

import { redirect } from "next/navigation";

import { LeaveRequestForm } from "@/components/leave-requests/leave-request-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  getLeaveDashboard,
  getLeaveRequests,
} from "@/lib/actions/leave-requests";
import {
  getRoutePermissions,
  getUserPermissions,
  isEmployeeRole,
} from "@/lib/rbac";

export default async function MyLeaveRequestsPage() {
  const [permissions, user] = await Promise.all([
    getRoutePermissions("/leave-requests/my"),
    getUserPermissions(),
  ]);

  if (!permissions.canView || !isEmployeeRole(user?.role?.name)) {
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
          My Leave Requests
        </h1>
        <p className="text-sm text-slate-500">
          Apply for leave and track approval status from HR or admin.
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

      <LeaveRequestForm initialRequests={requests} />
    </div>
  );
}

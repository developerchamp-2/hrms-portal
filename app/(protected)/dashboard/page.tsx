import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Briefcase,
  Building,
  CalendarCheck,
  Clock,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  if (session.user.role?.toLowerCase() === "employee") {
    redirect("/employee-dashboard");
  }

  const stats = [
    { title: "Total Employees", value: "120", icon: Users },
    { title: "Active Employees", value: "105", icon: Users },
    { title: "New Hires (Month)", value: "6", icon: UserPlus },
    { title: "Attrition (Month)", value: "2", icon: UserMinus },
    { title: "Departments", value: "5", icon: Building },
    { title: "Projects", value: "8", icon: Briefcase },
    { title: "Payroll (Monthly)", value: "5.2L", icon: IndianRupee },
    { title: "Compliance Score", value: "92%", icon: ShieldCheck },
    { title: "Pending Approvals", value: "7", icon: Clock },
    { title: "Attendance Today", value: "98", icon: CalendarCheck },
    { title: "Growth Rate", value: "+12%", icon: TrendingUp },
    { title: "System Alerts", value: "3", icon: AlertTriangle },
  ];

  const approvals = [
    { name: "Jane Smith", action: "Leave Request" },
    { name: "Amit Verma", action: "Promotion" },
    { name: "Riya Sharma", action: "Transfer" },
    { name: "Rahul Singh", action: "Document Upload" },
  ];

  const alerts = [
    "Payroll pending for April",
    "3 inactive employees detected",
    "2 documents pending verification",
  ];

  const hiring = [
    { dept: "IT", open: 3 },
    { dept: "Sales", open: 2 },
    { dept: "HR", open: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Organization-wide control and insights
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="flex justify-between rounded-xl border bg-white p-4"
          >
            <div>
              <p className="text-xs text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
            <item.icon size={18} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-medium">Pending Approvals</h2>
          <div className="space-y-3 text-sm">
            {approvals.map((item) => (
              <div key={`${item.name}-${item.action}`} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-yellow-600">{item.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-medium">System Alerts</h2>
          <div className="space-y-2 text-sm text-red-500">
            {alerts.map((alert) => (
              <div key={alert}>Warning: {alert}</div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-medium">Hiring Status</h2>
          <div className="space-y-2 text-sm">
            {hiring.map((item) => (
              <div key={item.dept} className="flex justify-between">
                <span>{item.dept}</span>
                <span>{item.open} Open Roles</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-medium">Attendance Insights</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Present</span>
              <span className="text-green-600">98</span>
            </div>
            <div className="flex justify-between">
              <span>On Leave</span>
              <span className="text-yellow-600">15</span>
            </div>
            <div className="flex justify-between">
              <span>Absent</span>
              <span className="text-red-500">7</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-medium">Quick Admin Actions</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="rounded border p-2">Add Employee</button>
            <button className="rounded border p-2">Add Department</button>
            <button className="rounded border p-2">Manage Roles</button>
            <button className="rounded border p-2">Run Payroll</button>
            <button className="rounded border p-2">View Reports</button>
            <button className="rounded border p-2">System Settings</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-medium">Compliance and Documents</h2>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div className="rounded border p-3">
            <p className="text-gray-500">KYC Pending</p>
            <p className="font-semibold">4</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-gray-500">Docs Verified</p>
            <p className="font-semibold">110</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-gray-500">Expiring Contracts</p>
            <p className="font-semibold">3</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-gray-500">Policy Violations</p>
            <p className="font-semibold text-red-500">2</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-medium">System Activity</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Admin updated payroll • 09:00 AM</div>
          <div>New employee added • 11:00 AM</div>
          <div>Role permissions changed • 01:30 PM</div>
          <div>Leave approved • 03:00 PM</div>
        </div>
      </div>
    </div>
  );
}

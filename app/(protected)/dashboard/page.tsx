"use client";

import {
  Users,
  UserPlus,
  UserMinus,
  Building,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  FileWarning,
  Clock,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Employees", value: "120", icon: Users },
    { title: "Active Employees", value: "105", icon: Users },
    { title: "New Hires (Month)", value: "6", icon: UserPlus },
    { title: "Attrition (Month)", value: "2", icon: UserMinus },
    { title: "Departments", value: "5", icon: Building },
    { title: "Projects", value: "8", icon: Briefcase },
    { title: "Payroll (Monthly)", value: "₹5.2L", icon: IndianRupee },
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

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Organization-wide control & insights
        </p>
      </div>

      {/* 🔥 KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white border rounded-xl p-4 flex justify-between">
            <div>
              <p className="text-xs text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
            <item.icon size={18} />
          </div>
        ))}
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* APPROVAL QUEUE */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-medium mb-3">Pending Approvals</h2>
          <div className="space-y-3 text-sm">
            {approvals.map((a, i) => (
              <div key={i} className="flex justify-between">
                <span>{a.name}</span>
                <span className="text-yellow-600">{a.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM ALERTS */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-medium mb-3">System Alerts</h2>
          <div className="space-y-2 text-sm text-red-500">
            {alerts.map((a, i) => (
              <div key={i}>⚠ {a}</div>
            ))}
          </div>
        </div>

        {/* HIRING STATUS */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-medium mb-3">Hiring Status</h2>
          <div className="space-y-2 text-sm">
            {hiring.map((h, i) => (
              <div key={i} className="flex justify-between">
                <span>{h.dept}</span>
                <span>{h.open} Open Roles</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 SECOND ROW */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* ATTENDANCE INSIGHT */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-medium mb-3">Attendance Insights</h2>

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

        {/* ADMIN ACTIONS */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-medium mb-3">Quick Admin Actions</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="border p-2 rounded">➕ Add Employee</button>
            <button className="border p-2 rounded">🏢 Add Department</button>
            <button className="border p-2 rounded">🔐 Manage Roles</button>
            <button className="border p-2 rounded">💰 Run Payroll</button>
            <button className="border p-2 rounded">📊 View Reports</button>
            <button className="border p-2 rounded">⚙ System Settings</button>
          </div>
        </div>
      </div>

      {/* 🔥 COMPLIANCE + DOCUMENTS */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-medium mb-3">Compliance & Documents</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 border rounded">
            <p className="text-gray-500">KYC Pending</p>
            <p className="font-semibold">4</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-gray-500">Docs Verified</p>
            <p className="font-semibold">110</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-gray-500">Expiring Contracts</p>
            <p className="font-semibold">3</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-gray-500">Policy Violations</p>
            <p className="font-semibold text-red-500">2</p>
          </div>
        </div>
      </div>

      {/* 🔥 ACTIVITY */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-medium mb-3">System Activity</h2>

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
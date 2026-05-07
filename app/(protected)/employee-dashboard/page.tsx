import { auth } from "@/auth";
import { getAttendanceDashboard } from "@/lib/actions/attendance";
import { getLeaveDashboard } from "@/lib/actions/leave-requests";
import { getEmployeeProfiles } from "@/lib/actions/employee-profiles";
import { getEmployeeDocuments } from "@/lib/actions/employee-documents";
import { getLeaveRequests } from "@/lib/actions/leave-requests";
import { LeaveRequestReviewTable } from "@/components/leave-requests/leave-request-review-table";
import {
  isCurrentEmployeeHr,
  isCurrentEmployeeManager,
} from "@/lib/employee-job-role";
import { prisma } from "@/lib/prisma";
import {
  ArrowRightLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartHandshake,
  Mail,
  Plus,
  MapPin,
  Phone,
  UserCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const formatDate = (value?: Date | null) =>
  value ? new Date(value).toLocaleDateString("en-GB") : "-";

const toDateOnly = (value = new Date()) =>
  new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));

export default async function EmployeeDashboardPage() {
  const session = await auth();
  const isEmployee = session?.user?.role?.toLowerCase() === "employee";
  const isHrEmployee = isEmployee ? await isCurrentEmployeeHr() : false;
  const isManagerEmployee =
    isEmployee && !isHrEmployee ? await isCurrentEmployeeManager() : false;

  if (!session?.user?.email) {
    redirect("/");
  }

  if (!isEmployee) {
    const employeeProfiles = await prisma.employeeProfile.findMany({
      orderBy: [{ employeeName: "asc" }, { employeeCode: "asc" }],
      include: {
        department: {
          select: {
            name: true,
          },
        },
        jobRole: {
          select: {
            name: true,
          },
        },
        workLocation: {
          select: {
            name: true,
          },
        },
        manager: {
          select: {
            employeeName: true,
          },
        },
      },
    });

    const activeEmployees = employeeProfiles.filter(
      (profile) => profile.status === "ACTIVE",
    ).length;

    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_55%,#1d4ed8_100%)] p-6 text-white shadow-sm lg:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-100">
            Employee Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold">All Employees Overview</h1>
          <p className="mt-3 max-w-2xl text-sm text-cyan-50">
            Admin and HR users can review every employee from one place.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Total Employees</p>
              <p className="mt-2 text-2xl font-semibold">{employeeProfiles.length}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">Active Employees</p>
              <p className="mt-2 text-2xl font-semibold">{activeEmployees}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-sm text-cyan-100">View Full Records</p>
              <Link
                href="/employee-profiles"
                className="mt-2 inline-flex text-sm font-medium text-white underline underline-offset-4"
              >
                Open employee profiles
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Employee List
              </h2>
              <p className="text-sm text-slate-500">
                Quick visibility into every employee linked to the HRMS.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {employeeProfiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {profile.employeeName}
                    </h3>
                    <p className="text-sm text-slate-500">{profile.employeeCode}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                    {profile.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Email: {profile.email || "-"}</p>
                  <p>Phone: {profile.phone || "-"}</p>
                  <p>Department: {profile.department?.name || "Not assigned"}</p>
                  <p>Manager: {profile.manager?.employeeName || "Not assigned"}</p>
                  <p>Job Role: {profile.jobRole?.name || "Not assigned"}</p>
                  <p>Location: {profile.workLocation?.name || "Not assigned"}</p>
                  <p>Joining Date: {formatDate(profile.joiningDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isEmployee && isHrEmployee) {
    const [employeeProfile, employeeProfiles, leaveSummary, attendanceSummary, leaveRequests, documents] =
      await Promise.all([
        prisma.employeeProfile.findFirst({
          where: {
            email: session.user.email,
          },
          include: {
            department: {
              select: {
                name: true,
              },
            },
            jobRole: {
              select: {
                name: true,
              },
            },
            manager: {
              select: {
                employeeName: true,
              },
            },
            workLocation: {
              select: {
                name: true,
              },
            },
          },
        }),
        getEmployeeProfiles(),
        getLeaveDashboard(),
        getAttendanceDashboard(),
        getLeaveRequests(),
        getEmployeeDocuments(),
      ]);

    if (!employeeProfile) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">
              Employee Dashboard
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Your account is logged in, but no employee profile is linked yet.
              Please contact HR or admin to complete your profile setup.
            </p>
          </div>
        </div>
      );
    }

    const pendingDocs = documents.filter(
      (document) => document.reviewStatus === "PENDING",
    );
    const pendingLeaveRequests = leaveRequests.filter(
      (request) => request.status === "PENDING",
    );

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f8fafc_22%,#ffffff_100%)] p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-sm">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-violet-100">
                  HR Employee Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-semibold">
                  {employeeProfile.employeeName}
                </h1>
                <p className="mt-3 max-w-xl text-sm text-violet-50">
                  Review employee records, approve leave and document uploads,
                  and keep the team moving from one place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/employee-profiles"
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm"
                  >
                    Employee Profiles
                  </Link>
                  <Link
                    href="/attendance"
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    Attendance
                  </Link>
                  <Link
                    href="/leave-requests"
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    Leave Requests
                  </Link>
                  <Link
                    href="/employee-documents"
                    className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    Document Review
                  </Link>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-violet-50">
                  HR Snapshot
                </p>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total Employees</span>
                    <strong>{employeeProfiles.length}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Leaves</span>
                    <strong>{leaveSummary.pending}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Document Reviews</span>
                    <strong>{pendingDocs.length}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Today Attendance Records</span>
                    <strong>{attendanceSummary.todayRecords.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Employees",
                value: employeeProfiles.length,
              },
              {
                label: "Active",
                value: employeeProfiles.filter((profile) => profile.status === "ACTIVE").length,
              },
              {
                label: "Leave Pending",
                value: leaveSummary.pending,
              },
              {
                label: "Doc Reviews",
                value: pendingDocs.length,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Leave Approvals
                  </h2>
                  <p className="text-sm text-slate-500">
                    Review and approve leave requests from the team.
                  </p>
                </div>
                <Link
                  href="/leave-requests"
                  className="text-sm font-medium text-cyan-700"
                >
                  Open module
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {pendingLeaveRequests.slice(0, 4).map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {request.employeeName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {request.leaveType.replace("_", " ")} · {request.totalDays} days
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{request.reason}</p>
                  </div>
                ))}
                {!pendingLeaveRequests.length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No pending leave requests right now.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Document Reviews
                  </h2>
                  <p className="text-sm text-slate-500">
                    Approve or reject employee uploads with remarks.
                  </p>
                </div>
                <Link
                  href="/employee-documents"
                  className="text-sm font-medium text-cyan-700"
                >
                  Open module
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {pendingDocs.slice(0, 4).map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {document.employeeName || "Employee"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {document.employeeCode} · {document.experienceType.replaceAll("_", " ")}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        {document.reviewStatus}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {document.reviewRemark || "Awaiting HR review"}
                    </p>
                  </div>
                ))}
                {!pendingDocs.length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No pending document reviews right now.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Leave Approval Queue
                </h2>
                <p className="text-sm text-slate-500">
                  Review and resolve pending requests directly inside the HR dashboard.
                </p>
              </div>
              <Link
                href="/leave-requests"
                className="text-sm font-medium text-cyan-700"
              >
                Open full module
              </Link>
            </div>
            <LeaveRequestReviewTable initialRequests={leaveRequests} />
          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Employee Management Modules
                </h2>
                <p className="text-sm text-slate-500">
                  Quick links into the HR tools already built into the portal.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Employee Profiles", href: "/employee-profiles" },
                { label: "Department", href: "/department" },
                { label: "Job Roles", href: "/job-roles" },
                { label: "Work Location", href: "/work-location" },
                { label: "Employee Documents", href: "/employee-documents" },
                { label: "Attendance", href: "/attendance" },
                { label: "Leave Requests", href: "/leave-requests" },
                { label: "Transfer & Promotion", href: "/transfer-promotion" },
                { label: "HR Review Queue", href: "/employee-documents" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (isEmployee && isManagerEmployee) {
    const today = toDateOnly();
    const employeeProfile = await prisma.employeeProfile.findFirst({
      where: {
        email: session.user.email,
        status: "ACTIVE",
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
        jobRole: {
          select: {
            name: true,
          },
        },
        manager: {
          select: {
            employeeName: true,
          },
        },
        workLocation: {
          select: {
            name: true,
          },
        },
        directReports: {
          orderBy: [{ employeeName: "asc" }, { employeeCode: "asc" }],
          include: {
            department: {
              select: {
                name: true,
              },
            },
            jobRole: {
              select: {
                name: true,
              },
            },
            workLocation: {
              select: {
                name: true,
              },
            },
            employeeDocuments: {
              select: {
                id: true,
                reviewStatus: true,
              },
            },
            leaveRequests: {
              orderBy: {
                createdAt: "desc",
              },
              take: 3,
              select: {
                id: true,
                leaveType: true,
                startDate: true,
                endDate: true,
                totalDays: true,
                reason: true,
                status: true,
              },
            },
            attendances: {
              where: {
                date: today,
              },
              select: {
                id: true,
                status: true,
                checkIn: true,
                checkOut: true,
              },
            },
            projectMembers: {
              include: {
                project: {
                  select: {
                    name: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!employeeProfile) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">
              Manager Dashboard
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Your manager login is active, but no active employee profile is
              linked to this email yet.
            </p>
          </div>
        </div>
      );
    }

    const directReports = employeeProfile.directReports;
    const teamIds = directReports.map((report) => report.id);
    const pendingLeaveRequests = directReports.flatMap((report) =>
      report.leaveRequests
        .filter((request) => request.status === "PENDING")
        .map((request) => ({
          ...request,
          employeeName: report.employeeName,
          employeeCode: report.employeeCode,
        })),
    );
    const pendingDocumentReviews = directReports.reduce(
      (total, report) =>
        total +
        report.employeeDocuments.filter(
          (document) => document.reviewStatus === "PENDING",
        ).length,
      0,
    );
    const todayAttendance = directReports.flatMap((report) =>
      report.attendances.map((attendance) => ({
        ...attendance,
        employeeName: report.employeeName,
        employeeCode: report.employeeCode,
      })),
    );
    const activeProjects = new Set(
      directReports.flatMap((report) =>
        report.projectMembers
          .filter((member) => member.project.status === "ACTIVE")
          .map((member) => member.project.name),
      ),
    );

    const managerStats = [
      {
        title: "Direct Reports",
        value: directReports.length,
        icon: Users,
        tone: "bg-sky-50 text-sky-700",
      },
      {
        title: "Active Team",
        value: directReports.filter((report) => report.status === "ACTIVE").length,
        icon: BadgeCheck,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "Pending Leaves",
        value: pendingLeaveRequests.length,
        icon: CalendarDays,
        tone: "bg-amber-50 text-amber-700",
      },
      {
        title: "Pending Docs",
        value: pendingDocumentReviews,
        icon: FileText,
        tone: "bg-violet-50 text-violet-700",
      },
    ];

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f0fdfa_0%,#f8fafc_24%,#ffffff_100%)] p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-teal-600 via-cyan-700 to-slate-900 text-white shadow-sm">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <div>
                <p className="text-sm uppercase text-cyan-100">
                  Manager Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-semibold">
                  {employeeProfile.employeeName}
                </h1>
                <p className="mt-3 max-w-xl text-sm text-cyan-50">
                  Your manager view is built from employees assigned to you in
                  the employee profile form. HR access is controlled by job
                  role; manager access is controlled by reporting relation.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/attendance/my"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-cyan-800 shadow-sm"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    My Attendance
                  </Link>
                  <Link
                    href="/leave-requests/my"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Apply Leave
                  </Link>
                  <Link
                    href="/employee-documents"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    <FileText className="h-4 w-4" />
                    My Documents
                  </Link>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-cyan-50">
                  Login Relation
                </p>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span>Portal role</span>
                    <strong>Employee</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Job role</span>
                    <strong>{employeeProfile.jobRole?.name || "Not assigned"}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Manager field</span>
                    <strong>{employeeProfile.manager?.employeeName || "Top level"}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Direct reports</span>
                    <strong>{teamIds.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {managerStats.map((item) => (
              <div key={item.title} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                  <div className={`rounded-2xl p-3 ${item.tone}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Direct Reports
                  </h2>
                  <p className="text-sm text-slate-500">
                    Employees with their Manager field set to your profile.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {directReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {report.employeeName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {report.employeeCode}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        {report.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>{report.jobRole?.name || "Role not assigned"}</p>
                      <p>{report.department?.name || "Department not assigned"}</p>
                      <p>{report.workLocation?.name || "Location not assigned"}</p>
                      <p>{report.projectMembers.length} project assignment(s)</p>
                    </div>
                  </div>
                ))}

                {!directReports.length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 md:col-span-2">
                    No direct reports are assigned yet. In the employee creation
                    form, choose this employee in the Manager dropdown for each
                    team member.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Team Signals
                    </h2>
                    <p className="text-sm text-slate-500">
                      Today and this month at a glance.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Attendance marked today</span>
                    <strong className="text-slate-900">
                      {todayAttendance.length}
                    </strong>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Active projects</span>
                    <strong className="text-slate-900">
                      {activeProjects.size}
                    </strong>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Pending leaves</span>
                    <strong className="text-slate-900">
                      {pendingLeaveRequests.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      My Profile
                    </h2>
                    <p className="text-sm text-slate-500">
                      Your own employee login remains self-service.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p>Email: {session.user.email || "-"}</p>
                  <p>Department: {employeeProfile.department?.name || "-"}</p>
                  <p>Location: {employeeProfile.workLocation?.name || "-"}</p>
                  <p>Joined: {formatDate(employeeProfile.joiningDate)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Team Leave Requests
                  </h2>
                  <p className="text-sm text-slate-500">
                    Pending requests from your direct reports.
                  </p>
                </div>
                <Link
                  href="/leave-requests/my"
                  className="text-sm font-medium text-cyan-700"
                >
                  My requests
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {pendingLeaveRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {request.employeeName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {request.leaveType.replace("_", " ")} · {request.totalDays} days
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {request.reason}
                    </p>
                  </div>
                ))}
                {!pendingLeaveRequests.length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No pending leave requests from direct reports right now.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Today Attendance
                  </h2>
                  <p className="text-sm text-slate-500">
                    Attendance already recorded by your direct reports today.
                  </p>
                </div>
                <Link
                  href="/attendance/my"
                  className="text-sm font-medium text-cyan-700"
                >
                  My attendance
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {todayAttendance.slice(0, 5).map((attendance) => (
                  <div
                    key={attendance.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {attendance.employeeName}
                      </p>
                      <p className="text-slate-500">{attendance.employeeCode}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {attendance.status}
                    </span>
                  </div>
                ))}
                {!todayAttendance.length && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No direct-report attendance has been marked today.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const employeeProfile = await prisma.employeeProfile.findFirst({
    where: {
      email: session.user.email,
    },
    include: {
      department: {
        select: {
          name: true,
        },
      },
      jobRole: {
        select: {
          name: true,
        },
      },
      manager: {
        select: {
          employeeName: true,
        },
      },
      workLocation: {
        select: {
          name: true,
        },
      },
      employeeDocuments: {
        select: {
          id: true,
          aadhaarNumber: true,
          panNumber: true,
          experienceType: true,
          reviewStatus: true,
          reviewRemark: true,
          status: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      },
      transferPromotions: {
        select: {
          id: true,
          movementType: true,
          effectiveDate: true,
        },
        orderBy: {
          effectiveDate: "desc",
        },
        take: 3,
      },
    },
  });

  if (!employeeProfile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Employee Dashboard
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Your account is logged in, but no employee profile is linked yet.
            Please contact HR or admin to complete your profile setup.
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    employeeProfile.employeeName ||
    [
      session.user.firstName,
      session.user.lastName,
      session.user.name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Employee";
  const leaveSummary = await getLeaveDashboard();

  const quickStats = [
    {
      title: "Employee ID",
      value: employeeProfile.employeeCode,
      icon: BadgeCheck,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      title: "Department",
      value: employeeProfile.department?.name || "Not assigned",
      icon: BriefcaseBusiness,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Location",
      value: employeeProfile.workLocation?.name || "Not assigned",
      icon: MapPin,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      title: "Documents",
      value: String(employeeProfile.employeeDocuments.length),
      icon: FileText,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      title: "Pending Leave",
      value: String(leaveSummary.pending),
      icon: CalendarDays,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f8fafc_22%,#ffffff_100%)] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[28px] border bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 text-white shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100">
                Employee Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold">{displayName}</h1>
              <p className="mt-3 max-w-xl text-sm text-cyan-50">
                Your work profile, key details, and latest updates all in one
                place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-cyan-50">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                  {employeeProfile.jobRole?.name || "Role not assigned"}
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                  Joined {formatDate(employeeProfile.joiningDate)}
                </div>
                <Link
                  href="/leave-requests/my"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-blue-700 shadow-sm transition hover:bg-cyan-50"
                >
                  <Plus className="h-4 w-4" />
                  Apply Leave
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium text-cyan-50">Profile Snapshot</p>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <UserCircle2 className="h-4 w-4 text-cyan-100" />
                  <span>{displayName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-cyan-100" />
                  <span>{employeeProfile.phone || "Phone not added"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-cyan-100" />
                  <span>{formatDate(employeeProfile.joiningDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartHandshake className="h-4 w-4 text-cyan-100" />
                  <span>
                    {employeeProfile.emergencyContactName
                      ? `${employeeProfile.emergencyContactName} (${employeeProfile.emergencyContactPhone || "No number"})`
                      : "Emergency contact not added"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item) => (
            <div key={item.title} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Employment Details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-medium text-slate-900">
                  {session.user.email || "-"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Job Role</p>
                <p className="mt-1 font-medium text-slate-900">
                  {employeeProfile.jobRole?.name || "Not assigned"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Department</p>
                <p className="mt-1 font-medium text-slate-900">
                  {employeeProfile.department?.name || "Not assigned"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Manager</p>
                <p className="mt-1 font-medium text-slate-900">
                  {employeeProfile.manager?.employeeName || "Not assigned"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Work Location</p>
                <p className="mt-1 font-medium text-slate-900">
                  {employeeProfile.workLocation?.name || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Movement
                </h2>
                <p className="text-sm text-slate-500">
                  Latest transfer and promotion activity linked to your profile.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {employeeProfile.transferPromotions.length ? (
                employeeProfile.transferPromotions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {item.movementType.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Effective {formatDate(item.effectiveDate)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No movement history found yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  My Documents
                </h2>
                <p className="text-sm text-slate-500">
                  Add or update your identity, education, and experience
                  records.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/employee-documents/create?from=employee-dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-2xl bg-cyan-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4" />
                Add Document
              </Link>
              <Link
                href="/employee-documents"
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {employeeProfile.employeeDocuments.length ? (
              employeeProfile.employeeDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        {document.experienceType.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Updated {formatDate(document.updatedAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {document.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    <p>Aadhaar: {document.aadhaarNumber || "-"}</p>
                    <p>PAN: {document.panNumber || "-"}</p>
                    <p>Review: {document.reviewStatus}</p>
                    <p>Remark: {document.reviewRemark || "-"}</p>
                  </div>

                  <Link
                    href={`/employee-documents/edit/${document.id}`}
                    className="mt-4 inline-flex text-sm font-medium text-cyan-700 hover:text-cyan-800"
                  >
                    Update document
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                No documents added yet. Add your first document to complete
                your employee records.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

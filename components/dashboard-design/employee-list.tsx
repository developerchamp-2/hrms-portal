"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeProfile } from "@/types";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface EmployeeListProps {
  employees: EmployeeProfile[];
  isLoading?: boolean;
}

const getStatusBadge = (status?: string) => {
  const normalized = status?.toUpperCase();

  const statusMap: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-red-100 text-red-800",
    "ON LEAVE": "bg-yellow-100 text-yellow-800",
    RESIGNED: "bg-gray-100 text-gray-800",
  };

  return statusMap[normalized ?? ""] ?? "bg-blue-100 text-blue-800";
};

const columns: ColumnDef<EmployeeProfile, any>[] = [
  {
    accessorKey: "employeeCode",
    header: "Employee ID",
    cell: ({ getValue }) =>  <Link href={`/employee-profiles/${getValue()}`} className="hover:underline hover:decoration-blue-500">{getValue()}</Link>,
  },
  {
    accessorKey: "employeeName",
    header: "Name",
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    cell: ({ getValue }) => getValue() || "-",
  },
  {
    accessorKey: "jobRoleName",
    header: "Job Role",
    cell: ({ getValue }) => getValue() || "-",
  },
  {
    accessorKey: "workLocationName",
    header: "Location",
    cell: ({ getValue }) => getValue() || "-",
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ getValue }) => getValue() || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge className={getStatusBadge(getValue() as string)}>
        {getValue()}
      </Badge>
    ),
  },
];

export default function EmployeeList({
  employees,
  isLoading = false,
}: EmployeeListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading employees...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No employees found.</p>
      </div>
    );
  }

  return (
    <DataTable
      title="Employee"
      columns={columns}
      data={employees}
      rowClassName={() => "hover:bg-slate-50 p-10 "}
    />
  );
}

"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { deleteEmployeeDocument } from "@/lib/actions/employee-documents";
import { EmployeeDocument } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import { getEmployeeDocumentColumns } from "./column";

export default function EmployeeDocumentDataTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: {
  data: EmployeeDocument[];
  canEdit: boolean;
  canDelete: boolean;
  title: string;
  actions?: React.ReactNode;
}) {
  const [tableData, setTableData] = React.useState<EmployeeDocument[]>(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteEmployeeDocument(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });
    setTableData((prev) => prev.filter((record) => record.id !== id));
  };

  const columns = getEmployeeDocumentColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return (
    <DataTable
      data={tableData}
      columns={columns}
      title={title}
      actions={actions}
    />
  );
}

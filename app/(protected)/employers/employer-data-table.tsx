"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { deleteEmployer } from "@/lib/actions/employers";
import { Employer } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import { getEmployerColumns } from "./column";

export default function EmployerDataTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: {
  data: Employer[];
  canEdit: boolean;
  canDelete: boolean;
  title: string;
  actions?: React.ReactNode;
}) {
  const [tableData, setTableData] = React.useState<Employer[]>(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteEmployer(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });
    setTableData((prev) => prev.filter((record) => record.id !== id));
  };

  const columns = getEmployerColumns({
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

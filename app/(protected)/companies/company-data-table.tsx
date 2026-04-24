"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { deleteCompany } from "@/lib/actions/companies";
import { Company } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import { getCompanyColumns } from "./column";

export default function CompanyDataTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: {
  data: Company[];
  canEdit: boolean;
  canDelete: boolean;
  title: string;
  actions?: React.ReactNode;
}) {
  const [tableData, setTableData] = React.useState<Company[]>(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteCompany(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });
    setTableData((prev) => prev.filter((record) => record.id !== id));
  };

  const columns = getCompanyColumns({
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

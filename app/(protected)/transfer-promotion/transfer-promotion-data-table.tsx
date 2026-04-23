"use client";

import { DataTable } from "@/components/datatable/DataTable";
import { deleteTransferPromotion } from "@/lib/actions/transfer-promotion";
import { TransferPromotion } from "@/types";
import * as React from "react";
import { toast } from "sonner";
import { getTransferPromotionColumns } from "./column";

export default function TransferPromotionDataTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: {
  data: TransferPromotion[];
  canEdit: boolean;
  canDelete: boolean;
  title: string;
  actions?: React.ReactNode;
}) {
  const [deletedIds, setDeletedIds] = React.useState<string[]>([]);

  const tableData = React.useMemo(
    () => data.filter((record) => !deletedIds.includes(record.id ?? "")),
    [data, deletedIds],
  );

  const deleteHandler = async (id: string) => {
    const res = await deleteTransferPromotion(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });
    setDeletedIds((prev) => [...prev, id]);
  };

  const columns = getTransferPromotionColumns({
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

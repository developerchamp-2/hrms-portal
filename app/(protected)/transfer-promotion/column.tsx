import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransferPromotion } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";

export const getTransferPromotionColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
}): ColumnDef<TransferPromotion>[] => {
  const columns: ColumnDef<TransferPromotion>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee",
    },
    {
      accessorKey: "movementType",
      header: "Movement Type",
      cell: ({ row }) => row.original.movementType.replaceAll("_", " "),
    },
    {
      accessorKey: "fromLocationName",
      header: "From Location",
      cell: ({ row }) => row.original.fromLocationName || "-",
    },
    {
      accessorKey: "toLocationName",
      header: "To Location",
      cell: ({ row }) => row.original.toLocationName || "-",
    },
    {
      accessorKey: "effectiveDate",
      header: "Effective Date",
      cell: ({ row }) =>
        row.original.effectiveDate
          ? new Date(row.original.effectiveDate).toLocaleDateString("en-GB")
          : "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "ACTIVE" ? (
          <Badge className="bg-green-500">ACTIVE</Badge>
        ) : (
          <Badge variant="destructive">INACTIVE</Badge>
        ),
    },
  ];

  if (canEdit || canDelete) {
    columns.push({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const id = row.original.id as string;

        return (
          <div className="flex gap-2">
            {canEdit && (
              <Button
                asChild
                size="icon"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Link href={`/transfer-promotion/edit/${id}`}>
                  <EditIcon size={16} />
                </Link>
              </Button>
            )}

            {canDelete && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onDelete(id)}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};

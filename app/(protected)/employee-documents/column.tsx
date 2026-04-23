import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeDocument } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, ExternalLink, Trash } from "lucide-react";
import Link from "next/link";

export const getEmployeeDocumentColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
}): ColumnDef<EmployeeDocument>[] => {
  const columns: ColumnDef<EmployeeDocument>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee",
    },
    {
      accessorKey: "employeeCode",
      header: "Employee ID",
    },
    {
      accessorKey: "documentType",
      header: "Document Type",
    },
    {
      accessorKey: "documentNumber",
      header: "Document Number",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row.original.expiryDate
          ? new Date(row.original.expiryDate).toLocaleDateString("en-GB")
          : "-",
    },
    {
      accessorKey: "fileUrl",
      header: "File",
      cell: ({ row }) =>
        row.original.fileUrl ? (
          <Button asChild size="sm" variant="outline">
            <Link href={row.original.fileUrl} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </Link>
          </Button>
        ) : (
          "-"
        ),
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
                <Link href={`/employee-documents/edit/${id}`}>
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeDocument } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash } from "lucide-react";
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
      accessorKey: "experienceType",
      header: "Experience Type",
      cell: ({ row }) => row.original.experienceType.replaceAll("_", " "),
    },
    {
      accessorKey: "aadhaarNumber",
      header: "Aadhaar Number",
    },
    {
      accessorKey: "panNumber",
      header: "PAN Number",
    },
    {
      accessorKey: "graduationCollege",
      header: "Graduation College",
      cell: ({ row }) => row.original.graduationCollege || "-",
    },
    {
      accessorKey: "previousCompanyName",
      header: "Previous Company",
      cell: ({ row }) => row.original.previousCompanyName || "-",
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

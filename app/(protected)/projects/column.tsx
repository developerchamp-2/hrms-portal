import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";

type ProjectColumnOptions = {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

export const getProjectColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: ProjectColumnOptions): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description ?? "-",
    },
    {
      accessorKey: "createdById",
      header: "Created By",
      cell: ({ row }) => row.original.createdBy?.firstName && row.original.createdBy?.lastName
        ? `${row.original.createdBy.firstName} ${row.original.createdBy.lastName}`
        : "-",  
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "-",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "-",
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
                <Link href={`/projects/edit/${id}`}>
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

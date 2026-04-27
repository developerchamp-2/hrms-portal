import { Button } from "@/components/ui/button";
import { getEmployeeDocuments } from "@/lib/actions/employee-documents";
import { getRoutePermissions } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";
import EmployeeDocumentDataTable from "./employee-document-data-table";

const EmployeeDocumentPage = async () => {
  const route = "/employee-documents";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const records = await getEmployeeDocuments();

  return (
    <EmployeeDocumentDataTable
      data={records}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Employee ID & Docs"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/employee-documents/create">Add Employee Document</Link>
          </Button>
        )
      }
    />
  );
};

export default EmployeeDocumentPage;

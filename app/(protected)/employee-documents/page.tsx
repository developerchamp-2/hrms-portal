import { Button } from "@/components/ui/button";
import { getEmployeeDocuments } from "@/lib/actions/employee-documents";
import Link from "next/link";
import EmployeeDocumentDataTable from "./employee-document-data-table";

const EmployeeDocumentPage = async () => {
  const records = await getEmployeeDocuments();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <EmployeeDocumentDataTable
      data={records}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Employee ID & Docs"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/employee-documents/create">Add Employee Document</Link>
          </Button>
        )
      }
    />
  );
};

export default EmployeeDocumentPage;

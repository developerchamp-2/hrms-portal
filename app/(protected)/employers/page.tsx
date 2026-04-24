import { Button } from "@/components/ui/button";
import { getEmployers } from "@/lib/actions/employers";
import Link from "next/link";
import EmployerDataTable from "./employer-data-table";

const EmployerPage = async () => {
  const records = await getEmployers();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <EmployerDataTable
      data={records}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Employers"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/employers/create">Add Employer</Link>
          </Button>
        )
      }
    />
  );
};

export default EmployerPage;

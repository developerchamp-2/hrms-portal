import { Button } from "@/components/ui/button";
import { getEmployeeProfiles } from "@/lib/actions/employee-profiles";
import Link from "next/link";
import EmployeeProfileDataTable from "./employee-profile-data-table";

const EmployeeProfilePage = async () => {
  const records = await getEmployeeProfiles();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <EmployeeProfileDataTable
      data={records}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Employee Profiles"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/employee-profiles/create">Add Employee Profile</Link>
          </Button>
        )
      }
    />
  );
};

export default EmployeeProfilePage;

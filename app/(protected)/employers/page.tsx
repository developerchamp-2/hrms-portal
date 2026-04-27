import { Button } from "@/components/ui/button";
import { getEmployers } from "@/lib/actions/employers";
import { getRoutePermissions } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";
import EmployerDataTable from "./employer-data-table";

const EmployerPage = async () => {
  const route = "/employers";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const records = await getEmployers();

  return (
    <EmployerDataTable
      data={records}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Employers"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/employers/create">Add Employer</Link>
          </Button>
        )
      }
    />
  );
};

export default EmployerPage;

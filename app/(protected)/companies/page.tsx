import { Button } from "@/components/ui/button";
import { getCompanies } from "@/lib/actions/companies";
import { getRoutePermissions } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";
import CompanyDataTable from "./company-data-table";

const CompanyPage = async () => {
  const route = "/companies";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const records = await getCompanies();

  return (
    <CompanyDataTable
      data={records}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Companies"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/companies/create">Add Company</Link>
          </Button>
        )
      }
    />
  );
};

export default CompanyPage;

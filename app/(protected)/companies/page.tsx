import { Button } from "@/components/ui/button";
import { getCompanies } from "@/lib/actions/companies";
import Link from "next/link";
import CompanyDataTable from "./company-data-table";

const CompanyPage = async () => {
  const records = await getCompanies();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <CompanyDataTable
      data={records}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Companies"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/companies/create">Add Company</Link>
          </Button>
        )
      }
    />
  );
};

export default CompanyPage;

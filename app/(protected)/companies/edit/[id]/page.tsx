import CompanyForm from "@/components/company/company-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompanyById } from "@/lib/actions/companies";
import { canAccess } from "@/lib/rbac";
import { Company } from "@/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const CompanyEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const route = "/companies";
  const canEdit = await canAccess(route, "edit");

  if (!canEdit) {
    redirect("/404");
  }

  const { id } = await params;
  const record = await getCompanyById(id);

  if (!record.success || !record.data) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Company</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/companies">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CompanyForm data={record.data as Company} update={true} />
      </CardContent>
    </Card>
  );
};

export default CompanyEditPage;

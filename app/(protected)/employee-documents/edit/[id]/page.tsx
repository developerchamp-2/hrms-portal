import EmployeeDocumentForm from "@/components/employee-documents/employee-document-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployeeDocumentById } from "@/lib/actions/employee-documents";
import { canAccess } from "@/lib/rbac";
import { EmployeeDocument } from "@/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const EmployeeDocumentEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const route = "/employee-documents";
  const canEdit = await canAccess(route, "edit");

  if (!canEdit) {
    redirect("/404");
  }

  const { id } = await params;
  const record = await getEmployeeDocumentById(id);

  if (!record.success || !record.data) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Employee Document</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employee-documents">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeDocumentForm data={record.data as EmployeeDocument} update={true} />
      </CardContent>
    </Card>
  );
};

export default EmployeeDocumentEditPage;

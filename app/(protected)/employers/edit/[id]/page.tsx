import EmployerForm from "@/components/employer/employer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployerById } from "@/lib/actions/employers";
import { Employer } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const EmployerEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const record = await getEmployerById(id);

  if (!record.success || !record.data) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Employer</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employers">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployerForm data={record.data as Employer} update={true} />
      </CardContent>
    </Card>
  );
};

export default EmployerEditPage;

import EmployeeProfileForm from "@/components/employee-profiles/employee-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployeeProfileById } from "@/lib/actions/employee-profiles";
import { EmployeeProfile } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const EmployeeProfileEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const record = await getEmployeeProfileById(id);

  if (!record.success || !record.data) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Employee Profile</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employee-profiles">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeProfileForm data={record.data as EmployeeProfile} update={true} />
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileEditPage;

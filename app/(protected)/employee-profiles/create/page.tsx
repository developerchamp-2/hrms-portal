import EmployeeProfileForm from "@/components/employee-profiles/employee-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const EmployeeProfileCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Employee Profile</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employee-profiles">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeProfileForm update={false} />
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileCreatePage;

import EmployerForm from "@/components/employer/employer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const EmployerCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Employer</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employers">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployerForm update={false} />
      </CardContent>
    </Card>
  );
};

export default EmployerCreatePage;

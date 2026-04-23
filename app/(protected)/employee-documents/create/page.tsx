import EmployeeDocumentForm from "@/components/employee-documents/employee-document-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const EmployeeDocumentCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Employee Document</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/employee-documents">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeDocumentForm update={false} />
      </CardContent>
    </Card>
  );
};

export default EmployeeDocumentCreatePage;

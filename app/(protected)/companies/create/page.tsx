import CompanyForm from "@/components/company/company-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const CompanyCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Company</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/companies">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <CompanyForm update={false} />
      </CardContent>
    </Card>
  );
};

export default CompanyCreatePage;

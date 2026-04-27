import WorkLocationForm from "@/components/work-location/work-location-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccess } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";

const WorkLocationCreatePage = async () => {
  const route = "/work-location";
  const canCreate = await canAccess(route, "create");

  if (!canCreate) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Work Location</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/work-location">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <WorkLocationForm update={false} />
      </CardContent>
    </Card>
  );
};

export default WorkLocationCreatePage;

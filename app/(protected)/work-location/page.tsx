import { Button } from "@/components/ui/button";
import { getWorkLocations } from "@/lib/actions/work-location";
import { getRoutePermissions } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";
import WorkLocationDataTable from "./work-location-data-table";

const WorkLocationPage = async () => {
  const route = "/work-location";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const workLocations = await getWorkLocations();

  return (
    <WorkLocationDataTable
      data={workLocations}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Work Location"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/work-location/create">Add Work Location</Link>
          </Button>
        )
      }
    />
  );
};

export default WorkLocationPage;

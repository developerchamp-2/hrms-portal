import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getModules } from "@/lib/actions/module-action";
import { getRoutePermissions } from "@/lib/rbac";
import { redirect } from "next/navigation";
import ModuleDataTable from "./module-data-table";

const ModulePage = async () => {
  const route = "/module";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const modules = await getModules();

  return (
    <ModuleDataTable data={modules}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Module"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/module/create">Add Module</Link>
          </Button>
        )
      } />
  );
};

export default ModulePage;

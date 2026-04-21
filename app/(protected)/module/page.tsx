import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getModules } from "@/lib/actions/module-action";
import { redirect } from "next/navigation";
import ModuleDataTable from "./module-data-table";

const ModulePage = async () => {

  const modules = await getModules();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <ModuleDataTable data={modules}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Module"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/module/create">Add Module</Link>
          </Button>
        )
      } />
  );
};

export default ModulePage;

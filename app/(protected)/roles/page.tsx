import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRoles } from "@/lib/actions/role"
import { getRoutePermissions } from "@/lib/rbac"
import { redirect } from "next/navigation"
import RoleDataTable from "./role-datatable"
import { Role } from "@/types"

const RolesPage = async () => {
  const route = "/roles";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const roles: Role[] = await getRoles()

  return (
    <RoleDataTable data={roles}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Role"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/roles/create">Add Role</Link>
          </Button>
        )
      } />
  )
}

export default RolesPage

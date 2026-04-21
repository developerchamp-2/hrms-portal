import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRoles } from "@/lib/actions/role"
import { redirect } from "next/navigation"
import RoleDataTable from "./role-datatable"
import { Role } from "@/types"

const RolesPage = async () => {
  const roles: Role[] = await getRoles()

  const roleName =  "fsafasf";
  const isAdmin = true;

  const canCreate = isAdmin ;
  const canEdit = isAdmin ;
  const canDelete = isAdmin ;

  return (
    <RoleDataTable data={roles}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Role"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/roles/create">Add Role</Link>
          </Button>
        )
      } />
  )
}

export default RolesPage
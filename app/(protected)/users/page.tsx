import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUsers } from "@/lib/actions/users"
import UserDataTable from "./user-datatable"

export default async function UsersPage() {
  const users = await getUsers()

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <UserDataTable data={users}
      canEdit={canEdit}
      canDelete={canDelete}
      title="User"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/users/create">Add Create</Link>
          </Button>
        )
      } />
  )
}
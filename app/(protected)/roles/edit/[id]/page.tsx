import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoleForm from "@/components/role/role-form"
import Link from "next/link"
import { getRoleById } from "@/lib/actions/role"
import { notFound, redirect } from "next/navigation"
import { getModules } from "@/lib/actions/module-action"
import { canAccess } from "@/lib/rbac"

const RoleEditPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const route = "/roles";
    const canEdit = await canAccess(route, "edit");

    if (!canEdit) {
        redirect("/404");
    }

    const { id } = await params

    if (!id) return notFound()

    const role = await getRoleById(id)

    if (!role) return notFound()

    const modules = await getModules();

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Edit Role</CardTitle>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                        <Link href="/roles">Back</Link>
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <RoleForm update={true} data={role.data} modules={modules} />
            </CardContent>
        </Card>
    )
}

export default RoleEditPage

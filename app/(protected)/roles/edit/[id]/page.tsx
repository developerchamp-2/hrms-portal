import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RoleForm from "@/components/role/role-form";
import Link from "next/link";
import { getRoleById } from "@/lib/actions/role";
import { notFound, redirect } from "next/navigation";
import { getModules } from "@/lib/actions/module-action";
import { canAccess } from "@/lib/rbac";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const RoleEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const route = "/roles";
  const canEdit = await canAccess(route, "edit");

  if (!canEdit) {
    redirect("/404");
  }

  const { id } = await params;

  if (!id) return notFound();

  const role = await getRoleById(id);

  if (!role?.data) return notFound();

  const modules = await getModules();

  return (
    <Card className="rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-md">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md">
              <ShieldCheck size={20} />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Edit Role
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Update role details and permissions
              </p>
            </div>
          </div>

          <Button
            asChild
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <Link href="/roles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <RoleForm
          update={true}
          data={role.data}
          modules={modules}
        />
      </CardContent>
    </Card>
  );
};

export default RoleEditPage;
import CompanyForm from "@/components/company/company-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCompanyById } from "@/lib/actions/companies"
import { canAccess } from "@/lib/rbac"
import { Company } from "@/types"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Pencil, Building2 } from "lucide-react"

const CompanyEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const route = "/companies"
  const canEdit = await canAccess(route, "edit")

  if (!canEdit) {
    redirect("/404")
  }

  const { id } = await params
  const record = await getCompanyById(id)

  if (!record.success || !record.data) {
    notFound()
  }

  return (
    <Card className="rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur-md">
      {/* Header */}
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md">
              <Pencil size={20} />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Edit Company
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Update company information and settings
              </p>
            </div>
          </div>

          <Button
            asChild
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <Link href="/companies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-6">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
          <CompanyForm
            data={record.data as Company}
            update={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default CompanyEditPage
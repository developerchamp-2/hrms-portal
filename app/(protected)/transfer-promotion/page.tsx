import { Button } from "@/components/ui/button";
import { getTransferPromotions } from "@/lib/actions/transfer-promotion";
import { getRoutePermissions } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";
import TransferPromotionDataTable from "./transfer-promotion-data-table";

const TransferPromotionPage = async () => {
  const route = "/transfer-promotion";
  const permissions = await getRoutePermissions(route);

  if (!permissions.canView) {
    redirect("/404");
  }

  const records = await getTransferPromotions();

  return (
    <TransferPromotionDataTable
      data={records}
      canEdit={permissions.canEdit}
      canDelete={permissions.canDelete}
      title="Transfer & Promotion"
      actions={
        permissions.canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/transfer-promotion/create">Add Transfer & Promotion</Link>
          </Button>
        )
      }
    />
  );
};

export default TransferPromotionPage;

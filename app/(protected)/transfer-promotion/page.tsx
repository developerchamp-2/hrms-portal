import { Button } from "@/components/ui/button";
import { getTransferPromotions } from "@/lib/actions/transfer-promotion";
import Link from "next/link";
import TransferPromotionDataTable from "./transfer-promotion-data-table";

const TransferPromotionPage = async () => {
  const records = await getTransferPromotions();

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;

  return (
    <TransferPromotionDataTable
      data={records}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Transfer & Promotion"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/transfer-promotion/create">Add Transfer & Promotion</Link>
          </Button>
        )
      }
    />
  );
};

export default TransferPromotionPage;

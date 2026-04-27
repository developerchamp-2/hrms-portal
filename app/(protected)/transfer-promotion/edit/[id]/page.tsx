import TransferPromotionForm from "@/components/transfer-promotion/transfer-promotion-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransferPromotionById } from "@/lib/actions/transfer-promotion";
import { canAccess } from "@/lib/rbac";
import { TransferPromotion } from "@/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const TransferPromotionEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const route = "/transfer-promotion";
  const canEdit = await canAccess(route, "edit");

  if (!canEdit) {
    redirect("/404");
  }

  const { id } = await params;
  const record = await getTransferPromotionById(id);

  if (!record.success || !record.data) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Transfer & Promotion</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/transfer-promotion">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <TransferPromotionForm
          data={record.data as TransferPromotion}
          update={true}
        />
      </CardContent>
    </Card>
  );
};

export default TransferPromotionEditPage;

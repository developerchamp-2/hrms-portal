import TransferPromotionForm from "@/components/transfer-promotion/transfer-promotion-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const TransferPromotionCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Transfer & Promotion</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600" asChild>
            <Link href="/transfer-promotion">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <TransferPromotionForm update={false} />
      </CardContent>
    </Card>
  );
};

export default TransferPromotionCreatePage;

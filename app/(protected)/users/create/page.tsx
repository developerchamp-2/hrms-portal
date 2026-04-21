import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/components/user/user-form";
import Link from "next/link";

const UserCreatePage = async () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Add User</CardTitle>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/users">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <UserForm update={false} />
      </CardContent>
    </Card>
  );
};

export default UserCreatePage;
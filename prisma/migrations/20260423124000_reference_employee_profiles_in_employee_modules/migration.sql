-- Use EmployeeProfile records as the source for employee-related modules.
-- This lets manually created employee profiles appear in dropdowns.

ALTER TABLE "EmployeeDocument" DROP CONSTRAINT IF EXISTS "EmployeeDocument_employeeId_fkey";
ALTER TABLE "TransferPromotion" DROP CONSTRAINT IF EXISTS "TransferPromotion_employeeId_fkey";

UPDATE "EmployeeDocument"
SET "employeeId" = "EmployeeProfile"."id"
FROM "EmployeeProfile"
WHERE "EmployeeDocument"."employeeId" = "EmployeeProfile"."employeeId";

UPDATE "TransferPromotion"
SET "employeeId" = "EmployeeProfile"."id"
FROM "EmployeeProfile"
WHERE "TransferPromotion"."employeeId" = "EmployeeProfile"."employeeId";

ALTER TABLE "EmployeeDocument" ADD CONSTRAINT "EmployeeDocument_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransferPromotion" ADD CONSTRAINT "TransferPromotion_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

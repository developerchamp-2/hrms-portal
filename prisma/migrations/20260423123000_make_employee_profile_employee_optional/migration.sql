-- Allow employee profiles to store manually typed employee names without a User relation.
ALTER TABLE "EmployeeProfile" ADD COLUMN "employeeName" TEXT NOT NULL DEFAULT '';

UPDATE "EmployeeProfile"
SET "employeeName" = TRIM(CONCAT("User"."firstName", ' ', "User"."lastName"))
FROM "User"
WHERE "EmployeeProfile"."employeeId" = "User"."id"
  AND "EmployeeProfile"."employeeName" = '';

ALTER TABLE "EmployeeProfile" ALTER COLUMN "employeeName" DROP DEFAULT;

ALTER TABLE "EmployeeProfile" DROP CONSTRAINT "EmployeeProfile_employeeId_fkey";
ALTER TABLE "EmployeeProfile" ALTER COLUMN "employeeId" DROP NOT NULL;
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

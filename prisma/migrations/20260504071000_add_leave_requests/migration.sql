CREATE TYPE "LeaveType" AS ENUM ('CASUAL', 'SICK', 'EARNED', 'UNPAID', 'OTHER');

CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

CREATE TABLE "LeaveRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMP(3),
    "reviewRemark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");
CREATE INDEX "LeaveRequest_startDate_endDate_idx" ON "LeaveRequest"("startDate", "endDate");

ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

"use server";

import { MovementType, Status } from "@/app/generated/prisma/client";
import { TransferPromotion } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { transferPromotionSchema } from "../validators";

type ActionResponse = {
  success: boolean;
  message: string;
};

function mapTransferPromotion(record: {
  id: string;
  employeeId: string;
  movementType: MovementType;
  fromLocationId: string | null;
  toLocationId: string | null;
  currentDesignation: string | null;
  newDesignation: string | null;
  effectiveDate: Date;
  reason: string;
  remark: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    employeeName: string;
  };
  fromLocation?: {
    name: string;
  } | null;
  toLocation?: {
    name: string;
  } | null;
}): TransferPromotion {
  return {
    id: record.id,
    employeeId: record.employeeId,
    movementType: record.movementType,
    fromLocationId: record.fromLocationId ?? "",
    toLocationId: record.toLocationId ?? "",
    currentDesignation: record.currentDesignation ?? "",
    newDesignation: record.newDesignation ?? "",
    effectiveDate: record.effectiveDate.toISOString().split("T")[0],
    reason: record.reason,
    remark: record.remark ?? "",
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    employeeName: record.employee?.employeeName ?? "",
    fromLocationName: record.fromLocation?.name ?? "",
    toLocationName: record.toLocation?.name ?? "",
  };
}

export async function getTransferPromotions(): Promise<TransferPromotion[]> {
  try {
    const records = await prisma.transferPromotion.findMany({
  include: {
    employee: true,
    fromLocation: true,
    toLocation: true,
  },
});
    console.log(JSON.stringify(records, null, 2));
    return records.map(mapTransferPromotion);
  } catch {
    return [];
  }
}

export async function createTransferPromotion(
  data: TransferPromotion,
): Promise<ActionResponse> {
  try {
    const record = transferPromotionSchema.parse(data);

    await prisma.transferPromotion.create({
      data: {
        employeeId: record.employeeId,
        movementType: record.movementType,
        fromLocationId: record.fromLocationId || null,
        toLocationId: record.toLocationId || null,
        currentDesignation: record.currentDesignation || null,
        newDesignation: record.newDesignation || null,
        effectiveDate: new Date(record.effectiveDate),
        reason: record.reason,
        remark: record.remark || null,
        status: record.status,
      },
    });

    revalidatePath("/transfer-promotion");

    return {
      success: true,
      message: "Transfer & promotion record created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getTransferPromotionById(id: string) {
  try {
    const record = await prisma.transferPromotion.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            employeeName: true,
          },
        },
        fromLocation: {
          select: {
            name: true,
          },
        },
        toLocation: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!record) {
      return {
        success: false,
        message: "Transfer & promotion record not found",
      };
    }

    return {
      success: true,
      data: mapTransferPromotion(record),
      message: "Transfer & promotion record fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateTransferPromotion(
  data: TransferPromotion,
  id: string,
): Promise<ActionResponse> {
  try {
    const record = transferPromotionSchema.parse(data);

    const existingRecord = await prisma.transferPromotion.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingRecord) {
      return {
        success: false,
        message: "Transfer & promotion record not found",
      };
    }

    await prisma.transferPromotion.update({
      where: { id },
      data: {
        employeeId: record.employeeId,
        movementType: record.movementType,
        fromLocationId: record.fromLocationId || null,
        toLocationId: record.toLocationId || null,
        currentDesignation: record.currentDesignation || null,
        newDesignation: record.newDesignation || null,
        effectiveDate: new Date(record.effectiveDate),
        reason: record.reason,
        remark: record.remark || null,
        status: record.status,
      },
    });

    revalidatePath("/transfer-promotion");
    revalidatePath(`/transfer-promotion/edit/${id}`);

    return {
      success: true,
      message: "Transfer & promotion record updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteTransferPromotion(
  id: string,
): Promise<ActionResponse> {
  try {
    await prisma.transferPromotion.delete({
      where: { id },
    });

    revalidatePath("/transfer-promotion");

    return {
      success: true,
      message: "Transfer & promotion record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

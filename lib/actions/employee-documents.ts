"use server";

import { Status } from "@/app/generated/prisma/client";
import { EmployeeDocument } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { employeeDocumentSchema } from "../validators";

type ActionResponse = {
  success: boolean;
  message: string;
};

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function mapEmployeeDocument(record: {
  id: string;
  employeeId: string;
  employeeCode: string;
  documentType: string;
  documentNumber: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  issuingAuthority: string | null;
  fileUrl: string | null;
  remark: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    employeeName: string;
  };
}): EmployeeDocument {
  return {
    id: record.id,
    employeeId: record.employeeId,
    employeeCode: record.employeeCode,
    documentType: record.documentType,
    documentNumber: record.documentNumber,
    issueDate: record.issueDate?.toISOString().split("T")[0] ?? "",
    expiryDate: record.expiryDate?.toISOString().split("T")[0] ?? "",
    issuingAuthority: record.issuingAuthority ?? "",
    fileUrl: record.fileUrl ?? "",
    remark: record.remark ?? "",
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    employeeName: record.employee?.employeeName ?? "",
  };
}

export async function getEmployeeDocuments(): Promise<EmployeeDocument[]> {
  try {
    const records = await prisma.employeeDocument.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: {
          select: {
            employeeName: true,
          },
        },
      },
    });

    return records.map(mapEmployeeDocument);
  } catch {
    return [];
  }
}

export async function createEmployeeDocument(
  data: EmployeeDocument,
): Promise<ActionResponse> {
  try {
    const record = employeeDocumentSchema.parse(data);

    await prisma.employeeDocument.create({
      data: {
        employeeId: record.employeeId,
        employeeCode: record.employeeCode,
        documentType: record.documentType,
        documentNumber: record.documentNumber,
        issueDate: toDate(record.issueDate),
        expiryDate: toDate(record.expiryDate),
        issuingAuthority: record.issuingAuthority || null,
        fileUrl: record.fileUrl || null,
        remark: record.remark || null,
        status: record.status,
      },
    });

    revalidatePath("/employee-documents");

    return {
      success: true,
      message: "Employee document created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getEmployeeDocumentById(id: string) {
  try {
    const record = await prisma.employeeDocument.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            employeeName: true,
          },
        },
      },
    });

    if (!record) {
      return {
        success: false,
        message: "Employee document not found",
      };
    }

    return {
      success: true,
      data: mapEmployeeDocument(record),
      message: "Employee document fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateEmployeeDocument(
  data: EmployeeDocument,
  id: string,
): Promise<ActionResponse> {
  try {
    const record = employeeDocumentSchema.parse(data);

    const existingRecord = await prisma.employeeDocument.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingRecord) {
      return {
        success: false,
        message: "Employee document not found",
      };
    }

    await prisma.employeeDocument.update({
      where: { id },
      data: {
        employeeId: record.employeeId,
        employeeCode: record.employeeCode,
        documentType: record.documentType,
        documentNumber: record.documentNumber,
        issueDate: toDate(record.issueDate),
        expiryDate: toDate(record.expiryDate),
        issuingAuthority: record.issuingAuthority || null,
        fileUrl: record.fileUrl || null,
        remark: record.remark || null,
        status: record.status,
      },
    });

    revalidatePath("/employee-documents");
    revalidatePath(`/employee-documents/edit/${id}`);

    return {
      success: true,
      message: "Employee document updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteEmployeeDocument(
  id: string,
): Promise<ActionResponse> {
  try {
    await prisma.employeeDocument.delete({
      where: { id },
    });

    revalidatePath("/employee-documents");

    return {
      success: true,
      message: "Employee document deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

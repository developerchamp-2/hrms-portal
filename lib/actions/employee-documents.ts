"use server";

import {
  Prisma,
  ExperienceType,
  Status,
} from "@/app/generated/prisma/client";
import { EmployeeDocument } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { employeeDocumentSchema } from "../validators";

type ActionResponse = {
  success: boolean;
  message: string;
};

type EducationEntry = {
  degree?: string;
  college?: string;
  year?: string;
  marks?: number;
  marksheetFileUrl?: string;
};

type ExperienceEntry = {
  totalExperience?: string;
  previousCompanyName?: string;
  experienceLetterFileUrl?: string;
  salarySlip1FileUrl?: string;
  salarySlip2FileUrl?: string;
  salarySlip3FileUrl?: string;
};

function normalizeEducationEntries(
  value: Prisma.JsonValue | null | undefined,
): EducationEntry[] {
  if (!Array.isArray(value)) return [];

  return value.map((entry) => {
    const record = (entry ?? {}) as Record<string, unknown>;

    return {
      degree:
        typeof record.degree === "string"
          ? record.degree
          : "",

      college:
        typeof record.college === "string"
          ? record.college
          : "",

      year:
        typeof record.year === "string"
          ? record.year
          : "",

      marks:
        typeof record.marks === "number"
          ? record.marks
          : undefined,

      marksheetFileUrl:
        typeof record.marksheetFileUrl === "string"
          ? record.marksheetFileUrl
          : "",
    };
  });
}

function normalizeExperienceEntries(
  value: Prisma.JsonValue | null | undefined,
): ExperienceEntry[] {
  if (!Array.isArray(value)) return [];

  return value.map((entry) => {
    const record = (entry ?? {}) as Record<string, unknown>;

    return {
      totalExperience:
        typeof record.totalExperience === "string"
          ? record.totalExperience
          : "",

      previousCompanyName:
        typeof record.previousCompanyName === "string"
          ? record.previousCompanyName
          : "",

      experienceLetterFileUrl:
        typeof record.experienceLetterFileUrl === "string"
          ? record.experienceLetterFileUrl
          : "",

      salarySlip1FileUrl:
        typeof record.salarySlip1FileUrl === "string"
          ? record.salarySlip1FileUrl
          : "",

      salarySlip2FileUrl:
        typeof record.salarySlip2FileUrl === "string"
          ? record.salarySlip2FileUrl
          : "",

      salarySlip3FileUrl:
        typeof record.salarySlip3FileUrl === "string"
          ? record.salarySlip3FileUrl
          : "",
    };
  });
}

function mapEmployeeDocument(record: {
  id: string;
  employeeId: string;
  employeeCode: string;

  aadhaarNumber: string;
  aadhaarFileUrl: string | null;

  panNumber: string;
  panFileUrl: string | null;

  educationEntries: Prisma.JsonValue | null;

  experienceType: ExperienceType;
  experienceEntries: Prisma.JsonValue | null;

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

    aadhaarNumber: record.aadhaarNumber,
    aadhaarFileUrl: record.aadhaarFileUrl ?? "",

    panNumber: record.panNumber,
    panFileUrl: record.panFileUrl ?? "",

    educationEntries: normalizeEducationEntries(
      record.educationEntries,
    ),

    experienceType: record.experienceType,
    experienceEntries: normalizeExperienceEntries(
      record.experienceEntries,
    ),

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

        aadhaarNumber: record.aadhaarNumber,
        aadhaarFileUrl: record.aadhaarFileUrl || null,

        panNumber: record.panNumber,
        panFileUrl: record.panFileUrl || null,

        educationEntries:
          ((record.educationEntries ?? []) as Prisma.InputJsonValue),

        experienceType: record.experienceType,

        experienceEntries:
          record.experienceType === ExperienceType.EXPERIENCED
            ? ((record.experienceEntries ?? []) as Prisma.InputJsonValue)
            : Prisma.JsonNull,

        remark: record.remark || null,
        status: record.status,
      },
    });
    console.log(data);
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
    const record =
      await prisma.employeeDocument.findUnique({
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

    const existing =
      await prisma.employeeDocument.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!existing) {
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

        aadhaarNumber: record.aadhaarNumber,
        aadhaarFileUrl: record.aadhaarFileUrl || null,

        panNumber: record.panNumber,
        panFileUrl: record.panFileUrl || null,

        educationEntries:
          ((record.educationEntries ?? []) as Prisma.InputJsonValue),

        experienceType: record.experienceType,

        experienceEntries:
          record.experienceType === ExperienceType.EXPERIENCED
            ? ((record.experienceEntries ?? []) as Prisma.InputJsonValue)
            : Prisma.JsonNull,

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
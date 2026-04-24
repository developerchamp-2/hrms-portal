"use server";

import { Employer } from "@/types";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { createEmployerSchema, employerSchema } from "../validators";

type ActionResponse = {
  success: boolean;
  message: string;
};

function mapEmployer(record: {
  id: string;
  companyId: string;
  employerName: string;
  employerCode: string;
  email: string;
  phone: string;
  designation: string | null;
  address: string | null;
  remark: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  company?: {
    companyName: string;
  } | null;
}): Employer {
  return {
    id: record.id,
    companyId: record.companyId,
    employerName: record.employerName,
    employerCode: record.employerCode,
    email: record.email,
    phone: record.phone,
    password: "",
    designation: record.designation ?? "",
    address: record.address ?? "",
    remark: record.remark ?? "",
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    companyName: record.company?.companyName ?? "",
  };
}

const employerInclude = {
  company: {
    select: {
      companyName: true,
    },
  },
};

export async function getEmployers(): Promise<Employer[]> {
  try {
    const records = await prisma.employer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: employerInclude,
    });

    return records.map(mapEmployer);
  } catch {
    return [];
  }
}

export async function createEmployer(data: Employer): Promise<ActionResponse> {
  try {
    const employer = createEmployerSchema.parse(data);
    const hashedPassword = await bcrypt.hash(employer.password, 10);

    await prisma.employer.create({
      data: {
        companyId: employer.companyId,
        employerName: employer.employerName.trim(),
        employerCode: employer.employerCode.trim(),
        email: employer.email.trim(),
        phone: employer.phone,
        password: hashedPassword,
        designation: employer.designation || null,
        address: employer.address || null,
        remark: employer.remark || null,
        status: employer.status,
      },
    });

    revalidatePath("/employers");

    return {
      success: true,
      message: "Employer created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getEmployerById(id: string) {
  try {
    const record = await prisma.employer.findUnique({
      where: { id },
      include: employerInclude,
    });

    if (!record) {
      return {
        success: false,
        message: "Employer not found",
      };
    }

    return {
      success: true,
      data: mapEmployer(record),
      message: "Employer fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateEmployer(
  data: Employer,
  id: string,
): Promise<ActionResponse> {
  try {
    const employer = employerSchema.parse(data);

    await prisma.employer.update({
      where: { id },
      data: {
        companyId: employer.companyId,
        employerName: employer.employerName.trim(),
        employerCode: employer.employerCode.trim(),
        email: employer.email.trim(),
        phone: employer.phone,
        designation: employer.designation || null,
        address: employer.address || null,
        remark: employer.remark || null,
        status: employer.status,
        ...(employer.password
          ? {
              password: await bcrypt.hash(employer.password, 10),
            }
          : {}),
      },
    });

    revalidatePath("/employers");
    revalidatePath(`/employers/edit/${id}`);

    return {
      success: true,
      message: "Employer updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteEmployer(id: string): Promise<ActionResponse> {
  try {
    await prisma.employer.delete({
      where: { id },
    });

    revalidatePath("/employers");

    return {
      success: true,
      message: "Employer deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

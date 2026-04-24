"use server";

import { Company } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { companySchema } from "../validators";
import { log } from "console";

type ActionResponse = {
  success: boolean;
  message: string;
};

function mapCompany(record: {
  id: string;
  companyName: string;
  companyCode: string;
  email: string | null;
  phone: string;
  website: string | null;
  address: string | null;
  remark: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}): Company {
  return {
    id: record.id,
    companyName: record.companyName,
    companyCode: record.companyCode,
    email: record.email ?? "",
    phone: record.phone,
    website: record.website ?? "",
    address: record.address ?? "",
    remark: record.remark ?? "",
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const records = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map(mapCompany);
  } catch {
    return [];
  }
}

export async function getCompanyOptions() {
  try {
    return await prisma.company.findMany({
      orderBy: [{ companyName: "asc" }],
      select: {
        id: true,
        companyName: true,
      },
    });
  } catch {
    return [];
  }
}

export async function createCompany(data: Company): Promise<ActionResponse> {
  try {
    const company = companySchema.parse(data);

    await prisma.company.create({
      data: {
        companyName: company.companyName.trim(),
        companyCode: company.companyCode.trim(),
        email: company.email || null,
        phone: company.phone,
        website: company.website || null,
        address: company.address || null,
        remark: company.remark || null,
        status: company.status,
      },
    });
    console.log(data);

    revalidatePath("/companies");

    return {
      success: true,
      message: "Company created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getCompanyById(id: string) {
  try {
    const record = await prisma.company.findUnique({
      where: { id },
    });

    if (!record) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    return {
      success: true,
      data: mapCompany(record),
      message: "Company fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateCompany(
  data: Company,
  id: string,
): Promise<ActionResponse> {
  try {
    const company = companySchema.parse(data);

    await prisma.company.update({
      where: { id },
      data: {
        companyName: company.companyName.trim(),
        companyCode: company.companyCode.trim(),
        email: company.email || null,
        phone: company.phone,
        website: company.website || null,
        address: company.address || null,
        remark: company.remark || null,
        status: company.status,
      },
    });

    revalidatePath("/companies");
    revalidatePath(`/companies/edit/${id}`);

    return {
      success: true,
      message: "Company updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteCompany(id: string): Promise<ActionResponse> {
  try {
    await prisma.company.delete({
      where: { id },
    });

    revalidatePath("/companies");

    return {
      success: true,
      message: "Company deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

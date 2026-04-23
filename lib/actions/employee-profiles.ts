"use server";

import { Status } from "@/app/generated/prisma/client";
import { EmployeeProfile } from "@/types";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { employeeProfileSchema } from "../validators";

type ActionResponse = {
  success: boolean;
  message: string;
};

const EXISTING_PASSWORD_SENTINEL = "__KEEP__";

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function getOptionalRelation(id?: string) {
  return id ? { connect: { id } } : undefined;
}

function getNextEmployeeCode(codes: string[]) {
  const nextNumber =
    codes.reduce((max, code) => {
      const match = /^emp-(\d+)$/i.exec(code);
      const number = match ? Number(match[1]) : 0;

      return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0) + 1;

  return `emp-${String(nextNumber).padStart(3, "0")}`;
}

async function generateEmployeeCode() {
  const profiles = await prisma.employeeProfile.findMany({
    where: {
      employeeCode: {
        startsWith: "emp-",
        mode: "insensitive",
      },
    },
    select: {
      employeeCode: true,
    },
  });

  return getNextEmployeeCode(
    profiles.map((profile) => profile.employeeCode),
  );
}

export async function getNextEmployeeCodePreview() {
  return generateEmployeeCode();
}

function mapEmployeeProfile(record: {
  id: string;
  employeeId: string | null;
  employeeName: string;
  employeeCode: string;
  phone: string;
  alternatePhone: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  joiningDate: Date;
  departmentId: string | null;
  jobRoleId: string | null;
  workLocationId: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  remark: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  employee?: {
    firstName: string;
    lastName: string;
  } | null;
  department?: {
    name: string;
  } | null;
  jobRole?: {
    name: string;
  } | null;
  workLocation?: {
    name: string;
  } | null;
}): EmployeeProfile {
  return {
    id: record.id,
    employeeId: record.employeeId ?? "",
    employeeName:
      record.employeeName ||
      (record.employee
        ? `${record.employee.firstName} ${record.employee.lastName}`.trim()
        : ""),
    employeeCode: record.employeeCode,
    phone: record.phone,
    alternatePhone: record.alternatePhone ?? "",
    gender: record.gender ?? "",
    dateOfBirth: record.dateOfBirth?.toISOString().split("T")[0] ?? "",
    joiningDate: record.joiningDate.toISOString().split("T")[0],
    departmentId: record.departmentId ?? "",
    jobRoleId: record.jobRoleId ?? "",
    workLocationId: record.workLocationId ?? "",
    password: "",
    address: record.address ?? "",
    emergencyContactName: record.emergencyContactName ?? "",
    emergencyContactPhone: record.emergencyContactPhone ?? "",
    remark: record.remark ?? "",
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    departmentName: record.department?.name ?? "",
    jobRoleName: record.jobRole?.name ?? "",
    workLocationName: record.workLocation?.name ?? "",
  };
}

const employeeProfileInclude = {
  employee: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  department: {
    select: {
      name: true,
    },
  },
  jobRole: {
    select: {
      name: true,
    },
  },
  workLocation: {
    select: {
      name: true,
    },
  },
};

export async function getEmployeeProfileOptions() {
  try {
    const [employees, departments, jobRoles, workLocations] = await Promise.all([
      prisma.user.findMany({
        orderBy: { firstName: "asc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      }),
      prisma.department.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.jobRole.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.workLocation.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      employees,
      departments,
      jobRoles,
      workLocations,
    };
  } catch {
    return {
      employees: [],
      departments: [],
      jobRoles: [],
      workLocations: [],
    };
  }
}

export async function getEmployeeProfileSelectOptions() {
  try {
    return await prisma.employeeProfile.findMany({
      orderBy: [{ employeeName: "asc" }, { employeeCode: "asc" }],
      select: {
        id: true,
        employeeId: true,
        employeeName: true,
        employeeCode: true,
        status: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getEmployeeProfiles(): Promise<EmployeeProfile[]> {
  try {
    const records = await prisma.employeeProfile.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: employeeProfileInclude,
    });

    return records.map(mapEmployeeProfile);
  } catch {
    return [];
  }
}

export async function createEmployeeProfile(
  data: EmployeeProfile,
): Promise<ActionResponse> {
  try {
    const record = employeeProfileSchema.parse(data);
    const employeeCode = await generateEmployeeCode();
    const hashedPassword =
      record.employeeId &&
      record.password &&
      record.password !== EXISTING_PASSWORD_SENTINEL
        ? await bcrypt.hash(record.password, 10)
        : null;

    await prisma.$transaction(async (tx) => {
      await tx.employeeProfile.create({
        data: {
          employeeName: record.employeeName.trim(),
          employeeCode,
          phone: record.phone,
          alternatePhone: record.alternatePhone || null,
          gender: record.gender || null,
          dateOfBirth: toDate(record.dateOfBirth),
          joiningDate: new Date(record.joiningDate),
          employee: getOptionalRelation(record.employeeId),
          department: getOptionalRelation(record.departmentId),
          jobRole: getOptionalRelation(record.jobRoleId),
          workLocation: getOptionalRelation(record.workLocationId),
          address: record.address || null,
          emergencyContactName: record.emergencyContactName || null,
          emergencyContactPhone: record.emergencyContactPhone || null,
          remark: record.remark || null,
          status: record.status,
        },
      });

      if (record.employeeId && hashedPassword) {
        await tx.user.update({
          where: { id: record.employeeId },
          data: {
            password: hashedPassword,
          },
        });
      }
    });

    revalidatePath("/employee-profiles");

    return {
      success: true,
      message: "Employee profile created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getEmployeeProfileById(id: string) {
  try {
    const record = await prisma.employeeProfile.findUnique({
      where: { id },
      include: employeeProfileInclude,
    });

    if (!record) {
      return {
        success: false,
        message: "Employee profile not found",
      };
    }

    return {
      success: true,
      data: mapEmployeeProfile(record),
      message: "Employee profile fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateEmployeeProfile(
  data: EmployeeProfile,
  id: string,
): Promise<ActionResponse> {
  try {
    const record = employeeProfileSchema.parse(data);
    const hashedPassword =
      record.employeeId &&
      record.password &&
      record.password !== EXISTING_PASSWORD_SENTINEL
        ? await bcrypt.hash(record.password, 10)
        : null;

    const existingRecord = await prisma.employeeProfile.findUnique({
      where: { id },
      select: { id: true, employeeCode: true },
    });

    if (!existingRecord) {
      return {
        success: false,
        message: "Employee profile not found",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.employeeProfile.update({
        where: { id },
        data: {
          employeeName: record.employeeName.trim(),
          employeeCode: record.employeeCode || existingRecord.employeeCode,
          phone: record.phone,
          alternatePhone: record.alternatePhone || null,
          gender: record.gender || null,
          dateOfBirth: toDate(record.dateOfBirth),
          joiningDate: new Date(record.joiningDate),
          employee: record.employeeId
            ? { connect: { id: record.employeeId } }
            : { disconnect: true },
          department: record.departmentId
            ? { connect: { id: record.departmentId } }
            : { disconnect: true },
          jobRole: record.jobRoleId
            ? { connect: { id: record.jobRoleId } }
            : { disconnect: true },
          workLocation: record.workLocationId
            ? { connect: { id: record.workLocationId } }
            : { disconnect: true },
          address: record.address || null,
          emergencyContactName: record.emergencyContactName || null,
          emergencyContactPhone: record.emergencyContactPhone || null,
          remark: record.remark || null,
          status: record.status,
        },
      });

      if (record.employeeId && hashedPassword) {
        await tx.user.update({
          where: { id: record.employeeId },
          data: {
            password: hashedPassword,
          },
        });
      }
    });

    revalidatePath("/employee-profiles");
    revalidatePath(`/employee-profiles/edit/${id}`);

    return {
      success: true,
      message: "Employee profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteEmployeeProfile(
  id: string,
): Promise<ActionResponse> {
  try {
    await prisma.employeeProfile.delete({
      where: { id },
    });

    revalidatePath("/employee-profiles");

    return {
      success: true,
      message: "Employee profile deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

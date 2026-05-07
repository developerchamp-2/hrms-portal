"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { projectMemberSchema } from "../validators";
import z from "zod";

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function getProjectMembers() {
  try {
    const records = await prisma.projectMember.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
        employee: true,
      }
    });

    return records;
  } catch {
    return [];
  }
}

type ProjectMemberInput = z.infer<typeof projectMemberSchema>;

export async function createProjectMember(data: ProjectMemberInput): Promise<ActionResponse> {
  try {
    const projectMember = projectMemberSchema.parse(data);
    const employeeIds = Array.from(
      new Set(projectMember.employeeIds?.length
        ? projectMember.employeeIds
        : projectMember.employeeId
          ? [projectMember.employeeId]
          : []),
    );

    await prisma.projectMember.createMany({
      data: employeeIds.map((employeeId) => ({
        projectId: projectMember.projectId,
        employeeId,
        assignedAt: projectMember.assignedAt || new Date().toISOString(),
      })),
      skipDuplicates: true,
    });

    revalidatePath("/project-members");
    revalidatePath("/projects");
    revalidatePath("/employee-dashboard");

    return {
      success: true,
      message:
        employeeIds.length === 1
          ? "Project member created successfully"
          : "Project members created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getProjectMemberById(id: string) {
  try {
    const record = await prisma.projectMember.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        employeeId: true,
        assignedAt: true
      },
    });

    if (!record) {
      return {
        success: false,
        message: "Project member not found",
      };
    }

    return {
      success: true,
      data: record,
      message: "Project member fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProjectMember(
  data: ProjectMemberInput,
  id: string,
): Promise<ActionResponse> {
  try {
    const projectMember = projectMemberSchema.parse(data);
    const employeeId = projectMember.employeeId || projectMember.employeeIds?.[0];

    if (!employeeId) {
      return {
        success: false,
        message: "Employee is required",
      };
    }

    await prisma.projectMember.update({
      where: { id },
      data: {
        projectId: projectMember.projectId,
        employeeId,
        assignedAt: projectMember.assignedAt || new Date().toISOString(),
      }
    });

    revalidatePath("/project-members");
    revalidatePath(`/project-members/edit/${id}`);
    revalidatePath("/projects");
    revalidatePath("/employee-dashboard");

    return {
      success: true,
      message: "Project member updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteProjectMember(id: string): Promise<ActionResponse> {
  try {
    await prisma.projectMember.delete({
      where: { id },
    });

    revalidatePath("/project-members");

    return {
      success: true,
      message: "Project member deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

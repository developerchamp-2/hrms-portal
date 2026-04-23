import z from "zod"
import {
  departmentSchema,
  employeeDocumentSchema,
  employeeProfileSchema,
  jobRoleSchema,
  moduleSchema,
  roleSchema, 
  transferPromotionSchema,
  userSchema,
  workLocationSchema,
} from "@/lib/validators"

export type Role = z.infer<typeof roleSchema>
export type Module = z.infer<typeof moduleSchema>
export type JobRole = z.infer<typeof jobRoleSchema>
export type Department = z.infer<typeof departmentSchema>
export type User = z.infer<typeof userSchema>
export type WorkLocation = z.infer<typeof workLocationSchema>
export type TransferPromotion = z.infer<typeof transferPromotionSchema> & {
  employeeName?: string
  fromLocationName?: string
  toLocationName?: string
}
export type EmployeeDocument = z.infer<typeof employeeDocumentSchema> & {
  employeeName?: string
}
export type EmployeeProfile = z.infer<typeof employeeProfileSchema> & {
  departmentName?: string
  jobRoleName?: string
  workLocationName?: string
}

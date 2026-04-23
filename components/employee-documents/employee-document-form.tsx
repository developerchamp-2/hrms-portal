"use client";

import { Status } from "@/app/generated/prisma/client";
import {
  createEmployeeDocument,
  updateEmployeeDocument,
} from "@/lib/actions/employee-documents";
import { getEmployeeProfileSelectOptions } from "@/lib/actions/employee-profiles";
import { employeeDocumentDefaultValues } from "@/lib/constants";
import { employeeDocumentSchema } from "@/lib/validators";
import { EmployeeDocument } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type Props = {
  data?: EmployeeDocument;
  update: boolean;
};

type EmployeeOption = {
  id: string;
  employeeName: string;
  employeeCode: string;
};

const EmployeeDocumentForm = ({ data, update }: Props) => {
  const router = useRouter();
  const id = data?.id;
  const [employees, setEmployees] = React.useState<EmployeeOption[]>([]);

  const form = useForm<z.infer<typeof employeeDocumentSchema>>({
    resolver: zodResolver(employeeDocumentSchema),
    defaultValues: data ?? employeeDocumentDefaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  useEffect(() => {
    getEmployeeProfileSelectOptions().then((records) => {
      setEmployees(records);
    });
  }, []);

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof employeeDocumentSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const res =
        update && id
          ? await updateEmployeeDocument(values, id)
          : await createEmployeeDocument(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });
      router.push("/employee-documents");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={(value) => {
                    const selectedEmployee = employees.find(
                      (employee) => employee.id === value,
                    );

                    field.onChange(value);
                    form.setValue(
                      "employeeCode",
                      selectedEmployee?.employeeCode ?? "",
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Employee name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.employeeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="Auto filled (emp-001)" readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <FormControl>
                  <Input placeholder="Aadhaar, PAN, passport, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter document number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuingAuthority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing Authority</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issuing authority" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter document file URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as Status)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                    <SelectItem value={Status.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remark</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            {update ? "Update Employee Document" : "Save Employee Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeDocumentForm;

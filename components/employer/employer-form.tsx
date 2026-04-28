"use client";

import { Status } from "@prisma/client";
import { getCompanyOptions } from "@/lib/actions/companies";
import { createEmployer, updateEmployer } from "@/lib/actions/employers";
import { employerDefaultValues } from "@/lib/constants";
import {
  createEmployerSchema,
  employerSchema,
} from "@/lib/validators";
import { Employer } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  Building2,
  Hash,
  Mail,
  Phone,
  Lock,
  Briefcase,
  MapPin,
  FileText,
} from "lucide-react";
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
  data?: Employer;
  update: boolean;
};

type CompanyOption = {
  id: string;
  companyName: string;
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 outline-none";

const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 outline-none";

const EmployerForm = ({ data, update }: Props) => {
  const router = useRouter();
  const id = data?.id;

  const [isPending, startTransition] = React.useTransition();
  const [companies, setCompanies] = React.useState<
    CompanyOption[]
  >([]);

  const currentSchema = update
    ? employerSchema
    : createEmployerSchema;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: data || employerDefaultValues,
  });

  useEffect(() => {
    getCompanyOptions().then((options) => {
      setCompanies(options);
    });
  }, []);

  const onSubmit: SubmitHandler<
    z.infer<typeof currentSchema>
  > = async (values) => {
    startTransition(async () => {
      const res =
        update && id
          ? await updateEmployer(values, id)
          : await createEmployer(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });

      router.push("/employers");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Grid Fields */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Company */}
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    {companies.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id}
                      >
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employer Name */}
          <FormField
            control={form.control}
            name="employerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employer Name
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Enter employer name"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employer Code */}
          <FormField
            control={form.control}
            name="employerCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employer Code
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Enter employer code"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Enter employer email"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Enter employer phone"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      type="password"
                      placeholder={
                        update
                          ? "Leave blank to keep current password"
                          : "Enter password"
                      }
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Designation
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Enter designation"
                      className={`${fieldClass} pl-11`}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(
                      value as Status
                    )
                  }
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    <SelectItem
                      value={Status.ACTIVE}
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value={Status.INACTIVE}
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>

              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                  <Textarea
                    placeholder="Enter address"
                    className={`${textAreaClass} pl-11`}
                    {...field}
                    value={field.value ?? ""}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remark */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remark</FormLabel>

              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                  <Textarea
                    placeholder="Additional notes"
                    className={`${textAreaClass} pl-11`}
                    {...field}
                    value={field.value ?? ""}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div>
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}

            {update
              ? "Update Employer"
              : "Save Employer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployerForm;
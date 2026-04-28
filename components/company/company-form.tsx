"use client";

import { Status } from "@prisma/client";
import { createCompany, updateCompany } from "@/lib/actions/companies";
import { companyDefaultValues } from "@/lib/constants";
import { companySchema } from "@/lib/validators";
import { Company } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Building2,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
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
  data?: Company;
  update: boolean;
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-cyan-300";

const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-cyan-300";

const CompanyForm = ({ data, update }: Props) => {
  const router = useRouter();
  const id = data?.id;
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: data || companyDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof companySchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res =
        update && id
          ? await updateCompany(values, id)
          : await createCompany(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });

      router.push("/companies");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Company Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter company name"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Company Code
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter company code"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter company email"
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Phone
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter company phone"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Website
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Globe className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter website"
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Status
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as Status)
                  }
                >
                  <FormControl>
                    <SelectTrigger className={`${fieldClass} w-full`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="w-full rounded-2xl border border-indigo-100 shadow-xl">
                    <SelectItem value={Status.ACTIVE}>
                      Active
                    </SelectItem>
                    <SelectItem value={Status.INACTIVE}>
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Textarea
                      placeholder="Enter company address"
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

          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Remark
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
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
        </div>

        <div className="pt-2">
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

            {update ? "Update Company" : "Save Company"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Building2,
  Hash,
  FileText,
  StickyNote,
} from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { Status } from "@prisma/client";

import {
  createDepartment,
  updateDepartment,
} from "@/lib/actions/department";
import { departmentDefaultValues } from "@/lib/constants";
import { departmentSchema } from "@/lib/validators";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof departmentSchema>;

type Props = {
  data?: FormValues;
  update: boolean;
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus:ring-2 focus:ring-indigo-300 focus:border-cyan-300";

const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus:ring-2 focus:ring-indigo-300 focus:border-cyan-300";

const DepartmentForm = ({ data, update }: Props) => {
  const router = useRouter();
  const id = data?.id;
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: data ?? departmentDefaultValues,
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    startTransition(async () => {
      const res = update && id
        ? await updateDepartment(values, id)
        : await createDepartment(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });

      router.push("/department");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Top Fields */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Department Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter department name"
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Department Code
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Input
                      placeholder="Enter department code"
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

                  <SelectContent className="rounded-2xl border border-indigo-100 shadow-xl">
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

        {/* Textareas */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Description
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Textarea
                      placeholder="Enter description"
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
                    <StickyNote className="absolute left-4 top-4 h-4 w-4 text-indigo-400" />
                    <Textarea
                      placeholder="Enter remark"
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

        {/* Submit */}
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
            {update ? "Update Department" : "Save Department"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
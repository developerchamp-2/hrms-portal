"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  CalendarIcon,
} from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { ProjectStatus } from "@prisma/client";

import { projectSchema } from "@/lib/validators";

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
import { createProject, updateProject } from "@/lib/actions/projects";
import { User } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

type FormValues = z.infer<typeof projectSchema>;

type Props = {
  data?: FormValues;
  update: boolean;
  users: User[];
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus:ring-2 focus:ring-indigo-300 focus:border-cyan-300";

const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-indigo-100 bg-white/95 shadow-sm transition-all duration-200 hover:border-cyan-200 focus:ring-2 focus:ring-indigo-300 focus:border-cyan-300";

const ProjectForm = ({ data, update, users }: Props) => {
  const router = useRouter();
  const id = data?.id;
  const [isPending, startTransition] = React.useTransition();

  const payload = {
    name: data?.name ?? "",
    startDate: data?.startDate ?? null,
    endDate: data?.endDate ?? null,
    status: data?.status ?? ProjectStatus.ACTIVE,
    createdById: data?.createdById ?? "",
    description: data?.description ?? undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: payload,
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    startTransition(async () => {
      const res = update && id
        ? await updateProject(values, id)
        : await createProject(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });

      router.push("/projects");
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
                  Project Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter project name"
                      className={`${fieldClass}`}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Start Date
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  End Date
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createdById"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Created By
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className={`${fieldClass} w-full`}>
                      <SelectValue placeholder="Select created by" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-indigo-100 shadow-xl">
                    {users.length > 0 && users.map((user) => (
                      <SelectItem key={user.id} value={user.id as string}>
                        {user.firstName} {user.lastName}
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
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Status
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as ProjectStatus)
                  }
                >
                  <FormControl>
                    <SelectTrigger className={`${fieldClass} w-full`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-indigo-100 shadow-xl">
                    {Object.values(ProjectStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Textareas */}
        <div className="grid gap-5 grid-cols-1">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className={`${textAreaClass}`}
                    {...field}
                    value={field.value ?? ""}
                  />
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
            {update ? "Update Project" : "Save Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;

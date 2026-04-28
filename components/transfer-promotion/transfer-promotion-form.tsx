"use client";

import { MovementType, Status } from "@prisma/client";
import {
  createTransferPromotion,
  updateTransferPromotion,
} from "@/lib/actions/transfer-promotion";
import { getEmployeeProfileSelectOptions } from "@/lib/actions/employee-profiles";
import { getWorkLocations } from "@/lib/actions/work-location";
import { transferPromotionDefaultValues } from "@/lib/constants";
import { transferPromotionSchema } from "@/lib/validators";
import { TransferPromotion } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  User,
  MoveRight,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  StickyNote,
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
  data?: TransferPromotion;
  update: boolean;
};

type EmployeeOption = {
  id: string;
  employeeName: string;
  employeeCode: string;
};

type LocationOption = {
  id?: string;
  name: string;
};

const fieldClass =
  "h-12 w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 outline-none";

const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 outline-none";

const TransferPromotionForm = ({
  data,
  update,
}: Props) => {
  const router = useRouter();
  const id = data?.id;

  const [employees, setEmployees] = React.useState<
    EmployeeOption[]
  >([]);
  const [locations, setLocations] = React.useState<
    LocationOption[]
  >([]);

  const form = useForm<
    z.infer<typeof transferPromotionSchema>
  >({
    resolver: zodResolver(transferPromotionSchema),
    defaultValues: data ?? transferPromotionDefaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  useEffect(() => {
    getEmployeeProfileSelectOptions().then(
      (records) => setEmployees(records as EmployeeOption[])
    );

    getWorkLocations().then((records) =>
      setLocations(records)
    );
  }, []);

  const [isPending, startTransition] =
    React.useTransition();

  const onSubmit: SubmitHandler<
    z.infer<typeof transferPromotionSchema>
  > = async (values) => {
    startTransition(async () => {
      const res =
        update && id
          ? await updateTransferPromotion(values, id)
          : await createTransferPromotion(values);

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
        return;
      }

      toast.success("Success", {
        description: res.message,
      });

      router.push("/transfer-promotion");
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Employee */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name</FormLabel>

                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.employeeName} (
                        {employee.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Movement Type */}
          <FormField
            control={form.control}
            name="movementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Movement Type
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(
                      value as MovementType
                    )
                  }
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="Select movement type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    <SelectItem
                      value={MovementType.TRANSFER}
                    >
                      Transfer
                    </SelectItem>
                    <SelectItem
                      value={MovementType.PROMOTION}
                    >
                      Promotion
                    </SelectItem>
                    <SelectItem
                      value={
                        MovementType.TRANSFER_PROMOTION
                      }
                    >
                      Transfer & Promotion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Locations */}
          <FormField
            control={form.control}
            name="fromLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  From Location
                </FormLabel>

                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="Current location" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    {locations.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id!}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  To Location
                </FormLabel>

                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger
                      className={fieldClass}
                    >
                      <SelectValue placeholder="New location" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="rounded-2xl border border-slate-200 shadow-xl">
                    {locations.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id!}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="currentDesignation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Current Designation
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="Current designation"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newDesignation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  New Designation
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <MoveRight className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="New designation"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Effective Date
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                    <Input
                      type="date"
                      className={`${fieldClass} pl-11`}
                      {...field}
                    />
                  </div>
                </FormControl>
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
              </FormItem>
            )}
          />
        </div>

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                  <Textarea
                    placeholder="Reason for transfer or promotion"
                    className={`${textAreaClass} pl-11`}
                    {...field}
                  />
                </div>
              </FormControl>
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
                  <StickyNote className="absolute left-4 top-4 h-4 w-4 text-cyan-500" />
                  <Textarea
                    placeholder="Additional notes"
                    className={`${textAreaClass} pl-11`}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}

          {update
            ? "Update Transfer & Promotion"
            : "Save Transfer & Promotion"}
        </Button>
      </form>
    </Form>
  );
};

export default TransferPromotionForm;
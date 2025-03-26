import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface EventDateTimeProps {
  form: UseFormReturn<any>;
}

export function EventDateTime({ form }: EventDateTimeProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    form.getValues("startDate") ? new Date(form.getValues("startDate")) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    form.getValues("endDate") ? new Date(form.getValues("endDate")) : undefined
  );

  useEffect(() => {
    // Validate start date is in the future
    if (startDate) {
      const now = new Date();
      
      if (startDate < now) {
        form.setError("startDate", {
          type: "manual",
          message: "Start date must be in the future"
        });
      } else {
        form.clearErrors("startDate");
      }
    }
  }, [startDate, form]);

  useEffect(() => {
    // Validate end date is after start date
    if (startDate && endDate) {
      if (endDate < startDate) {
        form.setError("endDate", {
          type: "manual",
          message: "End date must be after start date"
        });
      } else {
        form.clearErrors("endDate");
      }
    }
  }, [startDate, endDate, form]);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      form.setValue("startDate", date.toISOString(), { shouldValidate: true });
    } else {
      form.setValue("startDate", "", { shouldValidate: true });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      form.setValue("endDate", date.toISOString(), { shouldValidate: true });
    } else {
      form.setValue("endDate", "", { shouldValidate: true });
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date & Time <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <DateTimePicker 
                date={startDate}
                setDate={handleStartDateChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date & Time <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <DateTimePicker 
                date={endDate}
                setDate={handleEndDateChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

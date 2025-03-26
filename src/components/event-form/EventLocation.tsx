
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface EventLocationProps {
  form: UseFormReturn<any>;
}

export function EventLocation({ form }: EventLocationProps) {
  const watchIsVirtual = form.watch("isVirtual");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="isVirtual"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Virtual Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                This event will be hosted online
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {watchIsVirtual && (
        <FormField
          control={form.control}
          name="virtualMeetingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Link <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter virtual meeting link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{watchIsVirtual ? "Host Location" : "Event Location"} <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

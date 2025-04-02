
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface EventTicketingProps {
  form: UseFormReturn<any>;
}

export function EventTicketing({ form }: EventTicketingProps) {
  const watchIsTicketFree = form.watch("isTicketFree");
  const watchUnlimitedTickets = form.watch("unlimitedTickets");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="isTicketFree"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Free Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                This event will be free to attend
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {!watchIsTicketFree && (
        <FormField
          control={form.control}
          name="ticketPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Price (ETB) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter ticket price in ETB"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="unlimitedTickets"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    // If unlimited tickets, set a very high number
                    form.setValue("ticketQuantity", 99999);
                  } else {
                    // Reset to a reasonable default if unchecked
                    form.setValue("ticketQuantity", 100);
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Unlimited Tickets
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Allow unlimited registrations for this event
              </p>
            </div>
          </FormItem>
        )}
      />

      {!watchUnlimitedTickets && (
        <FormField
          control={form.control}
          name="ticketQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Tickets Available <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  min={1}
                />
              </FormControl>
              {watchIsTicketFree && (
                <p className="text-xs text-muted-foreground">Free events are limited to 1 ticket per user.</p>
              )}
              {!watchIsTicketFree && (
                <p className="text-xs text-muted-foreground">Paid events can have up to 15 tickets per user.</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="maxTicketsPerOrder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Tickets Per Order</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={watchIsTicketFree ? "1" : "15"}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                min={1}
                max={100}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              {watchIsTicketFree
                ? "For free events, it's recommended to limit to 1 ticket per order."
                : "For paid events, you can allow multiple tickets per order."}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="publishImmediately"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Publish Immediately
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Make this event visible to the public after creation
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EventBasicInfo } from "@/components/event-form/EventBasicInfo";
import { EventDateTime } from "@/components/event-form/EventDateTime";
import { EventLocation } from "@/components/event-form/EventLocation";
import { EventTicketing } from "@/components/event-form/EventTicketing";
import { eventSchema, EventFormValues } from "@/schemas/eventSchema";
import { CategoryType } from "@/types";
import { useCreateEvent } from "@/hooks/useCreateEvent";

interface EventFormProps {
  categories: CategoryType[];
}

export function EventForm({ categories }: EventFormProps) {
  const { createEvent, isSubmitting } = useCreateEvent();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      isVirtual: false,
      isTicketFree: false,
      unlimitedTickets: false,
      ticketQuantity: 100,
      publishImmediately: true,
    },
  });

  const onSubmit = (values: EventFormValues) => {
    createEvent(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <EventBasicInfo form={form} categories={categories} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Date and Time</h2>
            <EventDateTime form={form} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <EventLocation form={form} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Ticketing</h2>
            <EventTicketing form={form} />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}

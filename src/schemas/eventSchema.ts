
import * as z from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  startDate: z.string().refine((date) => {
    const startDate = new Date(date);
    const now = new Date();
    return startDate > now;
  }, {
    message: "Start date must be in the future",
  }),
  endDate: z.string().refine((date) => {
    const endDate = new Date(date);
    const now = new Date();
    return endDate > now;
  }, {
    message: "End date must be in the future",
  }),
  isVirtual: z.boolean().default(false),
  virtualMeetingLink: z.string().optional(),
  isTicketFree: z.boolean().default(false),
  unlimitedTickets: z.boolean().default(false),
  ticketPrice: z.number().optional(),
  ticketQuantity: z.number().min(1, "Must have at least 1 ticket available"),
  categoryId: z.string().min(1, "Please select a category"),
  bannerImage: z.instanceof(File).optional(),
  publishImmediately: z.boolean().default(true),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type EventFormValues = z.infer<typeof eventSchema>;

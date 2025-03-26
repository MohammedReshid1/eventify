
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { EventFormValues } from "@/schemas/eventSchema";

export function useCreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEvent = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate dates again before submission
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      const now = new Date();
      
      if (startDate <= now) {
        toast({
          title: "Invalid Start Date",
          description: "Start date must be in the future",
          variant: "destructive",
        });
        return;
      }
      
      if (endDate <= startDate) {
        toast({
          title: "Invalid End Date",
          description: "End date must be after start date",
          variant: "destructive",
        });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create an event",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      let bannerImageUrl = null;
      if (values.bannerImage) {
        const fileExt = values.bannerImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, values.bannerImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        bannerImageUrl = publicUrl;
      }

      // Generate a unique event ID and a slug based on the title
      const eventId = uuidv4();
      const eventSlug = `${values.title.toLowerCase().replace(/\s+/g, "-")}-${eventId.substring(0, 8)}`;

      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          id: eventId,
          title: values.title,
          description: values.description,
          location: values.location,
          start_date: values.startDate,
          end_date: values.endDate,
          organizer_id: user.id,
          status: values.publishImmediately ? "published" : "draft",
          slug: eventSlug,
          is_virtual: values.isVirtual,
          virtual_meeting_link: values.virtualMeetingLink,
          category_id: values.categoryId,
          banner_image: bannerImageUrl,
        })
        .select()
        .single();

      if (eventError) {
        console.error("Event creation error:", eventError);
        throw eventError;
      }

      // Generate a unique ticket ID
      const ticketId = uuidv4();

      const { error: ticketError } = await supabase.from("tickets").insert({
        id: ticketId,
        event_id: event.id,
        name: values.isTicketFree ? "Free Admission" : "General Admission",
        price: values.isTicketFree ? 0 : values.ticketPrice || 0,
        quantity: values.unlimitedTickets ? 99999 : values.ticketQuantity,
        remaining: values.unlimitedTickets ? 99999 : values.ticketQuantity,
        type: values.isTicketFree ? "free" : "paid",
      });

      if (ticketError) {
        console.error("Ticket creation error:", ticketError);
        throw ticketError;
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Create event error:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createEvent, isSubmitting };
}

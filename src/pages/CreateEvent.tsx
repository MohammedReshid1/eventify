import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepEventForm } from "@/components/event-form/MultiStepEventForm";
import { Loader2 } from "lucide-react";

export default function CreateEvent() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-2 text-3xl font-bold">Create New Event</h1>
      <p className="text-muted-foreground mb-8">Fill out the form below to create your event.</p>
      
      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <MultiStepEventForm categories={categories || []} />
      </div>
    </div>
  );
}

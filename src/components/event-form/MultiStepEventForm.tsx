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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MultiStepEventFormProps {
  categories: CategoryType[];
}

const steps = [
  { id: "step-1", name: "Basic Info", fields: ["title", "description", "category"] },
  { id: "step-2", name: "Date & Time", fields: ["startDate", "endDate"] },
  { id: "step-3", name: "Location", fields: ["location", "isVirtual"] },
  { id: "step-4", name: "Tickets", fields: ["ticketPrice", "ticketQuantity", "isTicketFree", "unlimitedTickets"] },
];

export function MultiStepEventForm({ categories }: MultiStepEventFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formComplete, setFormComplete] = useState(false);
  const [previousFields, setPreviousFields] = useState<Record<string, any>>({});
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

  const { trigger, getValues, formState: { errors } } = form;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });
    
    if (!output) return;
    
    // Store the current fields for the summary
    const values = getValues();
    const currentFields = fields.reduce((acc, field) => {
      acc[field] = values[field as keyof EventFormValues];
      return acc;
    }, {} as Record<string, any>);
    
    setPreviousFields({ ...previousFields, ...currentFields });
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFormComplete(true);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (values: EventFormValues) => {
    createEvent(values);
  };

  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-4">
        <Progress value={progressPercentage} className="h-2 bg-gray-200" />
        
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
            >
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep >= index 
                    ? 'border-[#F97316] bg-[#F97316] text-white' 
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {currentStep > index ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className={`mt-2 text-xs font-medium ${
                currentStep >= index ? 'text-[#F97316]' : 'text-gray-500'
              }`}>
                {step.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            {!formComplete ? (
              <motion.div
                key={steps[currentStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Step 1: Basic Information */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Event Details</h2>
                    <EventBasicInfo form={form} categories={categories} />
                  </div>
                )}

                {/* Step 2: Date and Time */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Date and Time</h2>
                    <EventDateTime form={form} />
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Event Location</h2>
                    <EventLocation form={form} />
                  </div>
                )}

                {/* Step 4: Ticketing */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Ticket Information</h2>
                    <EventTicketing form={form} />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                    <h2 className="text-xl font-semibold text-green-800">Ready to Create Your Event</h2>
                  </div>
                  <p className="mt-2 text-green-700">
                    Please review your event details before submitting.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Title:</span> {form.getValues("title")}</p>
                      <p><span className="font-medium">Description:</span> {form.getValues("description")?.substring(0, 100)}...</p>
                      <p><span className="font-medium">Category:</span> {categories.find(c => c.id === form.getValues("category"))?.name || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Date & Time</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Start:</span> {new Date(form.getValues("startDate")).toLocaleString()}</p>
                      <p><span className="font-medium">End:</span> {new Date(form.getValues("endDate")).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">{form.getValues("isVirtual") ? "Virtual Event" : "Physical Location"}:</span> {form.getValues("location")}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Tickets</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Price:</span> {form.getValues("isTicketFree") ? "Free" : `${form.getValues("ticketPrice")} ETB`}</p>
                      <p><span className="font-medium">Quantity:</span> {form.getValues("unlimitedTickets") ? "Unlimited" : form.getValues("ticketQuantity")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              disabled={currentStep === 0 || formComplete || isSubmitting}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            {!formComplete ? (
              <Button
                type="button"
                onClick={next}
                className="bg-[#F97316] hover:bg-[#F97316]/90 flex items-center"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-[#F97316] hover:bg-[#F97316]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            )}
          </div>
          
          {/* Error summary if there are any errors on the current step */}
          {Object.keys(errors).length > 0 && currentStep !== null && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 mt-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm font-medium text-red-800">
                  Please fix the errors above before proceeding
                </p>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
} 
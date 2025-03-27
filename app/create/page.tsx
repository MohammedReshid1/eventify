"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";

// Steps in the event creation process
const steps = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Details & Description" },
  { id: 3, name: "Time & Location" },
  { id: 4, name: "Tickets & Pricing" },
  { id: 5, name: "Review & Publish" }
];

export default function CreateEventPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    summary: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    ticketTypes: [{ name: "General Admission", price: 0, quantity: 100 }],
    featuredImage: "",
    isPublic: true
  });
  
  // Check if user is authenticated, redirect to sign in if not
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin?redirect=/create");
    }
  }, [isAuthenticated, router]);
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle ticket type changes
  const handleTicketChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      ticketTypes: updatedTickets,
    }));
  };
  
  // Add new ticket type
  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        { name: "", price: 0, quantity: 0 },
      ],
    }));
  };
  
  // Remove ticket type
  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length > 1) {
      const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        ticketTypes: updatedTickets,
      }));
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would typically call an API to save the event
    console.log("Submitting event:", formData);
    
    // Mock successful submission
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };
  
  // If not authenticated, don't render the form
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Create an Event</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Fill out the information below to create your event
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="flex flex-1 flex-col items-center"
                >
                  <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id < currentStep 
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                      ? "bg-orange-500 text-white" 
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}>
                    {step.id < currentStep ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className={`mt-2 hidden text-xs font-medium sm:block ${
                    step.id === currentStep 
                      ? "text-orange-500" 
                      : "text-slate-600 dark:text-slate-400"
                  }`}>
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-700"></div>
              <div 
                className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-orange-500 transition-all duration-300"
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          
          {/* Step content */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Event Title*
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Give your event a clear, descriptive title"
                      required
                      className="max-w-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium">
                      Category*
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      required
                      className="w-full max-w-xl rounded-md border border-slate-300 bg-white p-2 text-sm shadow-sm dark:border-slate-600 dark:bg-slate-700"
                    >
                      <option value="">Select a category</option>
                      <option value="music">Music & Concerts</option>
                      <option value="business">Business & Tech</option>
                      <option value="food">Food & Drinks</option>
                      <option value="arts">Arts & Culture</option>
                      <option value="sports">Sports & Fitness</option>
                      <option value="education">Education & Learning</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="summary" className="block text-sm font-medium">
                      Short Summary*
                    </label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleChange("summary", e.target.value)}
                      placeholder="Brief description (150 characters max)"
                      required
                      maxLength={150}
                      className="max-w-xl"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formData.summary.length}/150 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="featuredImage" className="block text-sm font-medium">
                      Featured Image URL
                    </label>
                    <Input
                      id="featuredImage"
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => handleChange("featuredImage", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="max-w-xl"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter a URL for your event's main image
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 2: Details & Description */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      Event Description*
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Provide a detailed description of your event"
                      required
                      rows={8}
                      className="w-full rounded-md border border-slate-300 bg-transparent p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-slate-600"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Describe what attendees can expect (HTML formatting supported)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Visibility</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="public"
                        name="visibility"
                        checked={formData.isPublic}
                        onChange={() => handleChange("isPublic", true)}
                        className="h-4 w-4 accent-orange-500"
                      />
                      <label htmlFor="public" className="text-sm">
                        Public (visible to everyone)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="private"
                        name="visibility"
                        checked={!formData.isPublic}
                        onChange={() => handleChange("isPublic", false)}
                        className="h-4 w-4 accent-orange-500"
                      />
                      <label htmlFor="private" className="text-sm">
                        Private (by invitation only)
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Time & Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="dateStart" className="block text-sm font-medium">
                        Start Date*
                      </label>
                      <Input
                        id="dateStart"
                        type="date"
                        value={formData.dateStart}
                        onChange={(e) => handleChange("dateStart", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="timeStart" className="block text-sm font-medium">
                        Start Time*
                      </label>
                      <Input
                        id="timeStart"
                        type="time"
                        value={formData.timeStart}
                        onChange={(e) => handleChange("timeStart", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dateEnd" className="block text-sm font-medium">
                        End Date*
                      </label>
                      <Input
                        id="dateEnd"
                        type="date"
                        value={formData.dateEnd}
                        onChange={(e) => handleChange("dateEnd", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="timeEnd" className="block text-sm font-medium">
                        End Time*
                      </label>
                      <Input
                        id="timeEnd"
                        type="time"
                        value={formData.timeEnd}
                        onChange={(e) => handleChange("timeEnd", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-medium mb-4">Venue Information</h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="venue" className="block text-sm font-medium">
                          Venue Name*
                        </label>
                        <Input
                          id="venue"
                          value={formData.venue}
                          onChange={(e) => handleChange("venue", e.target.value)}
                          placeholder="Name of venue"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium">
                          Street Address*
                        </label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          placeholder="123 Main St."
                          required
                        />
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="city" className="block text-sm font-medium">
                            City*
                          </label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="state" className="block text-sm font-medium">
                            State/Province*
                          </label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="zipCode" className="block text-sm font-medium">
                            Zip/Postal Code*
                          </label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="country" className="block text-sm font-medium">
                            Country*
                          </label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Tickets & Pricing */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Ticket Information</h3>
                  
                  {formData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="rounded-lg border p-4 dark:border-slate-700">
                      <div className="flex justify-between mb-4">
                        <h4 className="font-medium">Ticket Type #{index + 1}</h4>
                        {formData.ticketTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Ticket Name*
                          </label>
                          <Input
                            value={ticket.name}
                            onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                            placeholder="e.g. General Admission"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Price*
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={ticket.price}
                              onChange={(e) => handleTicketChange(index, "price", parseFloat(e.target.value))}
                              className="pl-7"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Quantity Available*
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketChange(index, "quantity", parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={addTicketType}
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700"
                    >
                      + Add Another Ticket Type
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 5: Review & Publish */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Review Your Event</h3>
                  
                  <div className="rounded-lg border dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700">
                      <h4 className="font-medium text-lg">{formData.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formData.category && `${formData.category} • `}
                        {formData.dateStart && new Date(formData.dateStart).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="p-4 border-t dark:border-slate-700">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h5 className="font-medium mb-2">Event Details</h5>
                          <ul className="space-y-2 text-sm">
                            <li><span className="font-medium">Date:</span> {formData.dateStart && new Date(formData.dateStart).toLocaleDateString()}</li>
                            <li><span className="font-medium">Time:</span> {formData.timeStart} - {formData.timeEnd}</li>
                            <li><span className="font-medium">Venue:</span> {formData.venue}</li>
                            <li><span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Ticket Information</h5>
                          <ul className="space-y-2 text-sm">
                            {formData.ticketTypes.map((ticket, index) => (
                              <li key={index}>
                                <span className="font-medium">{ticket.name}:</span> ${ticket.price} ({ticket.quantity} available)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t dark:border-slate-700">
                      <h5 className="font-medium mb-2">Description</h5>
                      <p className="text-sm whitespace-pre-line">{formData.description}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="bg-orange-50 p-4 rounded-lg dark:bg-orange-900/20">
                      <p className="text-orange-800 dark:text-orange-300">
                        By publishing this event, you confirm that all information provided is accurate and complies with our terms of service.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    onClick={prevStep}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < steps.length ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Publish Event
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export default function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Eventify has transformed how we discover and attend events. The platform is intuitive and the ticket purchasing process is seamless.",
      author: "Sarah Johnson",
      role: "Regular Attendee",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      quote: "As an event organizer, Eventify has helped us reach a wider audience and streamline our ticket sales. The analytics tools are game-changing.",
      author: "Mark Thompson",
      role: "Event Organizer",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      id: 3,
      quote: "I've discovered so many incredible events through Eventify that I would have otherwise missed. It's become an essential part of my social life.",
      author: "Jessica Chen",
      role: "Community Member",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Auto-advance the carousel every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">What People Are Saying</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            Don't just take our word for it. Here's what our users have to say about Eventify.
          </p>
          
          {/* Testimonial carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4 md:px-12">
                    <div className="relative rounded-xl bg-orange-50 p-8 dark:bg-slate-700">
                      <div className="mb-6 text-orange-500">
                        <svg width="45" height="36" className="mx-auto" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.515 0C6.0448 0 0 6.0448 0 13.515C0 20.9852 6.0448 27.03 13.515 27.03C20.9852 27.03 27.03 20.9852 27.03 13.515C27.03 6.0448 20.9852 0 13.515 0ZM18.2452 11.2625H15.1677C15.1677 10.9575 15.1677 10.6525 15.1677 10.1951C15.1677 7.8772 17.0252 7.8772 17.4827 7.8772C17.7877 7.8772 18.2452 7.8772 18.2452 7.8772V3.6075C18.2452 3.6075 17.9402 3.6075 17.33 3.6075C12.4478 3.6075 10.8977 6.99 10.8977 10.0426V11.2625H8.58 V15.8399H10.8977V27.03H15.1677V15.8399H17.9402L18.2452 11.2625Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <blockquote className="mb-6 text-lg italic leading-relaxed">"{testimonial.quote}"</blockquote>
                      <div className="flex items-center justify-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="mr-4 h-14 w-14 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="mt-8 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-3 w-3 rounded-full ${
                    index === activeIndex ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
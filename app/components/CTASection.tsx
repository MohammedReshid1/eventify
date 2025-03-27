"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0 lg:w-1/2 lg:pr-12">
            <h2 className="text-3xl font-bold mb-4">Host Your Own Event</h2>
            <p className="mb-6 text-lg opacity-90">
              Ready to share your passion or expertise? Create and manage your own events 
              on our platform. We provide all the tools you need to organize successful events.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                <Link href="/create">
                  Start Hosting
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/host-guidelines">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm lg:p-8">
              <h3 className="mb-4 text-xl font-medium">Why host with Eventify?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 text-white">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>Reach thousands of potential attendees</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 text-white">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>Powerful event management tools</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 text-white">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>Seamless ticket sales and payment processing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 text-white">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>Detailed analytics and attendee insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
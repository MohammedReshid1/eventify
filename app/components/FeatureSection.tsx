"use client";

export default function FeatureSection() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 1-7.743 5.743L10 14l-1 1v3h2v2H5v-6l2.793-2.793A4 4 0 0 1 8.535 4.535L9 4m0 2a2 2 0 0 1 2 2m8 2v8a2 2 0 0 1-2 2h-7"></path>
        </svg>
      ),
      title: "Easy Event Discovery",
      description: "Find events that match your interests through our intuitive search and filtering system."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
          <line x1="2" x2="22" y1="10" y2="10"></line>
        </svg>
      ),
      title: "Secure Payments",
      description: "Book tickets with confidence using our secure payment processing system."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
          <path d="M12 7v10"></path>
          <path d="M7 7h0.01"></path>
          <path d="M17 7h0.01"></path>
          <path d="M7 12h.01"></path>
          <path d="M17 12h.01"></path>
        </svg>
      ),
      title: "Digital Tickets",
      description: "Access your tickets instantly with our mobile-friendly digital ticket system."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" x2="12" y1="20" y2="10"></line>
          <line x1="18" x2="18" y1="20" y2="4"></line>
          <line x1="6" x2="6" y1="20" y2="16"></line>
        </svg>
      ),
      title: "Event Analytics",
      description: "Organizers get powerful analytics tools to track attendance and engagement."
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Eventify</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Our platform makes event discovery and booking seamless for both attendees and organizers.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="relative rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-slate-700">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
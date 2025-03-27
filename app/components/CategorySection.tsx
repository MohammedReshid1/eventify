"use client";

import CategoryCard from "./CategoryCard";

export default function CategorySection() {
  const categories = [
    {
      title: "Music & Concerts",
      count: 125,
      slug: "music",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      )
    },
    {
      title: "Business & Tech",
      count: 98,
      slug: "business-tech",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      )
    },
    {
      title: "Food & Drinks",
      count: 67,
      slug: "food-drinks",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.21 13.89 7 23l-5-2 1.97-11.9 1.34.27"></path>
          <path d="M8.24 4.27 8 3.5 9.5 2l1.14.27a50.17 50.17 0 0 1 7.7 2.75l1.46.73-7.87 3.97a50.98 50.98 0 0 1-4.51-4.16l.83-1.29"></path>
          <path d="M17.73 8.98a50.3 50.3 0 0 0-4.06-2.98l-1.14-.73L9 11l2.5 2 5.33-2.5"></path>
          <path d="M13.32 15.27c.73-.74 1.46-1.5 2.21-2.23"></path>
          <path d="m22 8-5 3-3.35 4.45"></path>
          <path d="M16 22c1-1 2-2 2-3.5 0-1-2-1.5-2-1.5s-2 .5-2 1.5c0 1.5 1 2.5 2 3.5Z"></path>
        </svg>
      )
    },
    {
      title: "Arts & Culture",
      count: 73,
      slug: "arts-culture",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="3.5"></circle>
          <circle cx="7" cy="14" r="3"></circle>
          <circle cx="17" cy="17" r="3"></circle>
        </svg>
      )
    },
    {
      title: "Sports & Fitness",
      count: 87,
      slug: "sports-fitness",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m4.93 4.93 4.24 4.24"></path>
          <path d="m14.83 9.17 4.24-4.24"></path>
          <path d="m14.83 14.83 4.24 4.24"></path>
          <path d="m9.17 14.83-4.24 4.24"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      )
    },
    {
      title: "Education & Learning",
      count: 56,
      slug: "education",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse Events By Category</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Discover events in categories that match your interests and passion.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              count={category.count}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 
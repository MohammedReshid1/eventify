"use client";

import Link from "next/link";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  slug: string;
}

export default function CategoryCard({ icon, title, count, slug }: CategoryCardProps) {
  return (
    <Link 
      href={`/events/category/${slug}`}
      className="group block rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-slate-700">
        {icon}
      </div>
      <h3 className="mb-1 font-medium">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{count} events</p>
    </Link>
  );
} 
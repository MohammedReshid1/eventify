"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Eventify</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
              The premium platform connecting event organizers with attendees worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-500">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-500">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-500">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">About Us</Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Careers</Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guides" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Event Guides</Link>
              </li>
              <li>
                <Link href="/organizers" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">For Organizers</Link>
              </li>
              <li>
                <Link href="/attendees" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">For Attendees</Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies" className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-500">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
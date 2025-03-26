import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send, ArrowUp, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    // Simulate subscription API call
    setTimeout(() => {
      toast({
        title: "Thanks for subscribing!",
        description: "You've been added to our newsletter list.",
      });
      setEmail("");
    }, 500);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <footer className="border-t bg-orange-50/30 dark:bg-gray-950 dark:border-gray-800">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 rounded-full bg-[#F97316] flex items-center justify-center mr-2">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <span className="text-2xl font-bold text-[#F97316]">Eventify</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your one-stop platform for discovering, creating, and attending amazing events. 
              Join thousands of people making connections and memories through Eventify.
            </p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-[#F97316] hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-medium">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-[#F97316] transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-lg font-medium">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest events and offers.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex space-x-2 mb-6">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white dark:bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-[#F97316] hover:bg-[#FB923C] text-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#F97316] mr-3" />
                <span className="text-muted-foreground">support@eventify.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#F97316] mr-3" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#F97316] mr-3 mt-1" />
                <span className="text-muted-foreground">123 Event Street, San Francisco, CA 94158</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-[#F97316]">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-[#F97316]">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-[#F97316]">
              Cookies
            </Link>
            <Button 
              onClick={scrollToTop}
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-[#F97316] hover:text-white"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

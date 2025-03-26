import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Trophy, Clock, HeartHandshake } from "lucide-react";

const HomeContent = () => {
  return (
    <div className="mt-12 mb-20">
      {/* How It Works Section */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
              How FindEvent Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover how easy it is to find, create, and attend events with our platform
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-4 mb-4">
                <Calendar className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse through thousands of events happening in your area and find the perfect one for you.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-4 mb-4">
                <Users className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Host your own events easily, set your tickets, and reach a wider audience.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-4 mb-4">
                <MapPin className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Attend Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Book tickets, manage your schedule, and enjoy a seamless event experience.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Choose FindEvent</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide the best event discovery and management platform
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-lg">
            <Clock className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Get instant notifications about event changes and updates.</p>
          </div>
          
          <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-lg">
            <Trophy className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Quality Events</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Curated selection of high-quality events for every interest.</p>
          </div>
          
          <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-lg">
            <HeartHandshake className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Community Focused</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Building connections through shared experiences and interests.</p>
          </div>
          
          <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-lg">
            <Users className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">User-Friendly</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Intuitive platform that makes event management simple.</p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl my-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Event?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of event organizers who are successfully hosting events on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              <Link to="/create-event">Create an Event</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20 font-medium">
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials section could be added here */}
      
    </div>
  );
};

export default HomeContent; 
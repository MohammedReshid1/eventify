import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Music, Coffee, Dumbbell, GraduationCap, Heart, Film, Lightbulb, Smartphone, SquareAsterisk, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, React.ReactNode> = {
    'food': <Coffee className="h-4 w-4 mr-2" />,
    'sport': <Dumbbell className="h-4 w-4 mr-2" />,
    'education': <GraduationCap className="h-4 w-4 mr-2" />,
    'charity': <Heart className="h-4 w-4 mr-2" />,
    'entertainment': <Film className="h-4 w-4 mr-2" />,
    'workshop': <Lightbulb className="h-4 w-4 mr-2" />,
    'technology': <Smartphone className="h-4 w-4 mr-2" />,
    'music': <Music className="h-4 w-4 mr-2" />,
    'other': <SquareAsterisk className="h-4 w-4 mr-2" />,
    'special': <SquareAsterisk className="h-4 w-4 mr-2" />
  };

  return icons[categoryId] || <Globe className="h-4 w-4 mr-2" />;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  // Fetch all categories from the database
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        // If there's an error loading from database, use our fallback categories
        return [
          { id: 'food', name: 'Food & Dining', slug: 'food' },
          { id: 'sport', name: 'Sports', slug: 'sport' },
          { id: 'education', name: 'Education', slug: 'education' },
          { id: 'special', name: 'Special Events', slug: 'special' },
          { id: 'charity', name: 'Charity', slug: 'charity' },
          { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
          { id: 'workshop', name: 'Workshops', slug: 'workshop' },
          { id: 'technology', name: 'Technology', slug: 'technology' },
          { id: 'music', name: 'Music & Concerts', slug: 'music' },
          { id: 'other', name: 'Other', slug: 'other' }
        ];
      }
      return data.length > 0 ? data : [
        { id: 'food', name: 'Food & Dining', slug: 'food' },
        { id: 'sport', name: 'Sports', slug: 'sport' },
        { id: 'education', name: 'Education', slug: 'education' },
        { id: 'special', name: 'Special Events', slug: 'special' },
        { id: 'charity', name: 'Charity', slug: 'charity' },
        { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
        { id: 'workshop', name: 'Workshops', slug: 'workshop' },
        { id: 'technology', name: 'Technology', slug: 'technology' },
        { id: 'music', name: 'Music & Concerts', slug: 'music' },
        { id: 'other', name: 'Other', slug: 'other' }
      ];
    },
  });
  
  // Split categories into main (first 5) and more (rest)
  const mainCategories = categories.slice(0, 7);
  const moreCategories = categories.slice(7);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Explore Categories</h2>
        <div className="flex space-x-2 pb-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <ScrollArea className="pb-4 -mx-4 px-4">
        <div className="flex space-x-2 pb-4">
          <Button
            onClick={() => onCategorySelect(null)}
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap",
              selectedCategory === null ? "bg-[#F97316] hover:bg-[#FB923C] text-white" : ""
            )}
          >
            <Globe className="h-4 w-4 mr-2" />
            All Events
          </Button>
          
          {mainCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap",
                selectedCategory === category.id ? "bg-[#F97316] hover:bg-[#FB923C] text-white" : ""
              )}
            >
              {getCategoryIcon(category.id)}
              {category.name}
            </Button>
          ))}
          
          {moreCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  More Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreCategories.map((category) => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {getCategoryIcon(category.id)}
                      {category.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;

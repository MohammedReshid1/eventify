
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CategoryType } from "@/types";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
  categories: CategoryType[];
}

export function EventBasicInfo({ form, categories }: EventBasicInfoProps) {
  // Define the consistent categories across the application
  const mainCategories: CategoryType[] = [
    { id: 'food', name: 'Food Event', slug: 'food' },
    { id: 'sport', name: 'Sporting Events', slug: 'sport' },
    { id: 'education', name: 'Educational Event', slug: 'education' },
    { id: 'special', name: 'Special Events', slug: 'special' },
    { id: 'charity', name: 'Charity Events', slug: 'charity' },
    { id: 'entertainment', name: 'Entertainment', slug: 'entertainment' },
    { id: 'workshop', name: 'Workshops', slug: 'workshop' },
    { id: 'technology', name: 'Technology', slug: 'technology' },
    { id: 'other', name: 'Other', slug: 'other' }
  ];
  
  // Use categories from the database if available
  const categoriesList = categories && categories.length > 0 ? categories : mainCategories;

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Title <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter event title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoriesList.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bannerImage"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Banner Image <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
                {value && (
                  <div className="h-16 w-16 rounded-lg border bg-gray-50 p-2">
                    <img
                      src={URL.createObjectURL(value)}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!value && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-gray-50">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea placeholder="Enter event description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

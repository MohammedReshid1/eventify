import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  className,
  disabled = false,
}: DateTimePickerProps) {
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const currentDate = date || new Date();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      
      selectedDate.setHours(hours);
      selectedDate.setMinutes(minutes);
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    const newDate = date ? new Date(date) : new Date();
    
    if (type === "hours") {
      newDate.setHours(parseInt(value));
    } else {
      newDate.setMinutes(parseInt(value));
    }
    
    setDate(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="lg"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
          <div className="border-t border-border p-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 items-center">
              <Select
                value={date ? date.getHours().toString() : undefined}
                onValueChange={(value) => handleTimeChange("hours", value)}
                disabled={!date}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent position="popper" className="h-60">
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">:</span>
              <Select
                value={date ? date.getMinutes().toString() : undefined}
                onValueChange={(value) => handleTimeChange("minutes", value)}
                disabled={!date}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent position="popper" className="h-60">
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 
"use client";

import { format } from "date-fns";
import { LucideCalendar, LucideChevronDown } from "lucide-react";
import { useImperativeHandle, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ImperativeHandlerFromDatePicker = {
  reset: () => void;
};
type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
  imperativeHandleRef?: React.RefObject<ImperativeHandlerFromDatePicker>;
};

const DatePicker = ({
  id,
  name,
  defaultValue,
  imperativeHandleRef,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date(),
  );

  useImperativeHandle(imperativeHandleRef, () => ({
    reset: () => {
      setDate(new Date());
    },
  }));

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" id={id} asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start text-left font-normal"
          >
            <LucideCalendar className="mr-2 h-4 w-4" />
            {formattedDate}
            <input type="hidden" name={name} value={formattedDate} />
            <LucideChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            //@ts-ignore
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePicker };

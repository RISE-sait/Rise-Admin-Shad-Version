import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Clients() {
  return (
  <div className="p-5" >
    <h1 className="font-semibold pb-2 text-lg" >Admin Panel Settings </h1>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Account Settings</AccordionTrigger>
          <AccordionContent>
            Account Settings
          </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Theme & General Settings</AccordionTrigger>
          <AccordionContent>
            <div className="p-3" >
              <h1 className="pb-3" > Client Theme </h1>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Misc Settings</AccordionTrigger>
          <AccordionContent>
            Misc Settings
          </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
  );
}

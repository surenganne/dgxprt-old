import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LocationFormData } from "./types";
import * as z from "zod";

// Validation schema for contact information
export const locationContactSchema = z.object({
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  contact_email: z
    .string()
    .email("Invalid email format")
    .min(1, "Contact email is required"),
  contact_phone: z
    .string()
    .regex(
      /^\+?[\d\s-()]{10,}$/,
      "Invalid phone number format. Must contain at least 10 digits."
    )
    .min(1, "Contact phone is required"),
});

interface LocationContactFieldsProps {
  form: UseFormReturn<LocationFormData>;
}

export function LocationContactFields({ form }: LocationContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Enter location description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter contact email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter contact phone" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
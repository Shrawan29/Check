/* Request schemas. The same rules are mirrored (more gently) in the forms, but the server is the authority. */

import { z } from "zod";

const email = z.string().trim().toLowerCase().max(254).pipe(z.email("Enter an email address like you@example.com."));

export const cartItemsInput = z
  .array(
    z.object({
      id: z.string().min(1).max(80),
      size: z.string().min(1).max(20),
      qty: z.number().int().min(1).max(9),
    })
  )
  .min(1, "Your bag is empty.")
  .max(30, "That's more lines than one order can hold.");

export const cartPriceInput = z.object({ items: cartItemsInput });

export const orderInput = z.object({
  items: cartItemsInput,
  customer: z.object({
    name: z.string().trim().min(2, "Enter your full name.").max(80),
    phone: z
      .string()
      .trim()
      .regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number."),
    email,
    address: z.string().trim().min(8, "Enter your full address, including house or flat number.").max(240),
    city: z.string().trim().min(2, "Enter your city.").max(60),
    state: z.string().trim().min(2, "Choose your state.").max(60),
    pincode: z
      .string()
      .trim()
      .regex(/^[1-9]\d{5}$/, "Enter a 6-digit PIN code."),
  }),
  payment: z.string().refine((v) => v === "cod", "Only cash on delivery is available right now."),
  note: z.string().trim().max(300, "Keep the note under 300 characters.").optional(),
});

export const subscriberInput = z.object({ email });

export const messageInput = z.object({
  name: z.string().trim().min(2, "Tell us your name so we know who to reply to.").max(80),
  email,
  order: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Give us a little more to go on, at least a sentence.").max(2000, "Keep it under 2,000 characters."),
});

export type OrderInput = z.infer<typeof orderInput>;
export type CartItemsInput = z.infer<typeof cartItemsInput>;

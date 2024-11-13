"use server";

import { sql } from "@vercel/postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const invoicesPath = "/dashboard/invoices";

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  date: z.string(),
  status: z.enum(["pending", "paid"]),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  // handling validation, using zod. see https://zod.dev/?id=basic-usage
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountToCents = amount * 100; // converting to cents
  const date = new Date().toISOString().split("T")[0];

  await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customer_id}, ${amountToCents}, ${status}, ${date})
`;

  revalidatePath(invoicesPath);
  redirect(invoicesPath);
};

export const updateInvoice = async (id: string, formData: FormData) => {
  // handling validation, using zod. see https://zod.dev/?id=basic-usage
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountToCents = amount * 100; // converting to cents

  await sql`
  UPDATE invoices
    SET customer_id = ${customer_id}, amount = ${amountToCents}, status = ${status}
    WHERE id = ${id}
`;

  revalidatePath(invoicesPath);
  redirect(invoicesPath);
};

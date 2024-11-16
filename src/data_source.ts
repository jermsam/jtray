import { v4 as uuid } from "uuid";
// Define the Item schema
import { z } from "zod";

export const TrayItemSchema = z.object({
  // Define the properties of Item when they are known
  // For now, an empty object is valid for Item.
  name: z.string().optional(),
});

export type TrayItemType = z.infer<typeof TrayItemSchema>;

export const TraySchema: z.ZodType = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    trays: z.array(TraySchema).optional(), // Recursive reference
    items: z.array(TrayItemSchema).optional(),
  })
);

export type TrayType = z.infer<typeof TraySchema>;

export const initialTray: TrayType = {
  label: '',
  description: '',
}



export const trays: TrayType[] = [
  {
    id: uuid(),
    label: 'Customer Support',
    description: 'service ops'
  },
  {
    id: uuid(),
    label: 'Sales And Marketting',
    description: ''
  },
  {
    id: uuid(),
    label: 'Finance And Accounting',
    description: ''
  },
  {
    id: uuid(),
    label: 'Human Resource',
    description: ''
  },
  {
    id: uuid(),
    label: 'Project management',
    description: 'Operations'
  },
  {
    id: uuid(),
    label: 'Procurement',
    description: 'Supply Chain'
  },
  {
    id: uuid(),
    label: 'Legal And Compliance',
    description: ''
  },
  {
    id: uuid(),
    label: 'IT And Development',
    description: ''
  },
  {
    id: uuid(),
    label: 'Product Management',
    description: ''
  },
  {
    id: uuid(),
    label: 'Document Management',
    description: ''
  },
];



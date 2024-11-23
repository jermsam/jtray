import { v4 as uuid } from "uuid";
// Define the Item schema
import { z } from "zod";



const baseTraySchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  order: z.number().optional(),
  description: z.string().optional(),
})

export type Tray = z.input<typeof baseTraySchema> & {
  trays?: Tray[] ;
};
// @ts-ignore
export const traySchema: z.ZodType<Tray> = baseTraySchema.extend({
  trays: z.lazy(() => traySchema.array().optional()),
})

export const trays: Tray[] = [
  {
    id: uuid(),
    order: 1,
    label: 'Customer Support',
    description: 'service ops',
  },
  {
    id: uuid(),
    order: 2,
    label: 'Sales And Marketting',
    description: '',
  },
  {
    id: uuid(),
    order: 3,
    label: 'Finance And Accounting',
    description: '',
  },
  {
    id: uuid(),
    order: 4,
    label: 'Human Resource',
    description: '',
  },
  {
    id: uuid(),
    order: 5,
    label: 'Project management',
    description: 'Operations',
  },
  {
    id: uuid(),
    order:6,
    label: 'Procurement',
    description: 'Supply Chain',
  },
  {
    id: uuid(),
    order: 7,
    label: 'Legal And Compliance',
    description: '',
  },
  {
    id: uuid(),
    order: 8,
    label: 'IT And Development',
    description: '',
  },
  {
    id: uuid(),
    order: 9,
    label: 'Product Management',
    description: '',
  },
  {
    id: uuid(),
    order: 10,
    label: 'Document Management',
    description: '',
  },
];

export const initialTray = traySchema.parse({
  id: '',
  label: '',
  description: '',
})


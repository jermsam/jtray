import { v4 as uuid } from "uuid";
// Define the Item schema
import { z } from "zod";



const baseTraySchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
 
})

export type Tray = z.input<typeof baseTraySchema> & {
  trays?: Tray[] ;
};
// @ts-ignore
export const traySchema: z.ZodType<Tray> = baseTraySchema.extend({
  trays: z.lazy(() => traySchema.array().optional()),
})

export const initialTray = traySchema.parse({
  id: uuid(),
  label: '',
  description: '',
})

export const trays: Tray[] = [
  {
    id: uuid(),
    label: 'Customer Support',
    description: 'service ops',
  },
  {
    id: uuid(),
    label: 'Sales And Marketting',
    description: '',
  },
  {
    id: uuid(),
    label: 'Finance And Accounting',
    description: '',
  },
  {
    id: uuid(),
    label: 'Human Resource',
    description: '',
  },
  {
    id: uuid(),
    label: 'Project management',
    description: 'Operations',
  },
  {
    id: uuid(),
    label: 'Procurement',
    description: 'Supply Chain',
  },
  {
    id: uuid(),
    label: 'Legal And Compliance',
    description: '',
  },
  {
    id: uuid(),
    label: 'IT And Development',
    description: '',
  },
  {
    id: uuid(),
    label: 'Product Management',
    description: '',
  },
  {
    id: uuid(),
    label: 'Document Management',
    description: '',
    
  },
];


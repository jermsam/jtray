import { v4 as uuid } from "uuid";
export interface Item {

}

export interface TrayProps {
  id: string;
  label: string;
  description?: string;
  trays?: TrayProps[];
  items?: Item[]
}

export const trays: TrayProps[] = [
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



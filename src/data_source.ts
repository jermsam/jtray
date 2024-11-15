import { v4 as uuid } from "uuid";
export interface Item {

}

export interface TrayProps {
  id: string;
  label: string;
  description?: string;
  items?: Item[]
}

export const trays: TrayProps[] = [
  {
    id: uuid(),
    label: 'A',
    description: 'a'
  },
  {
    id: uuid(),
    label: 'B',
    description: 'b'
  },
  {
    id: uuid(),
    label: 'C',
    description: 'c'
  },
];




export interface Item {

}

export interface TrayProps {
  label: string;
  description?: string;
  items?: Item[]
}

export const trays: TrayProps[] = [
  {
    label: 'A',
    description: 'a'
  },
  {
    label: 'B',
    description: 'b'
  },
  {
    label: 'C',
    description: 'c'
  },
];

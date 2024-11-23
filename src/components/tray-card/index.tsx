
import { component$, type QRL} from "@builder.io/qwik";
import KebabMenu from "~/components/kebab-menu";
import { type Tray } from "~/lib/data";

export interface TrayCardProps {
  tray: Tray;
  onEdit$?: QRL<() => void>;
  onDelete$?: QRL<() => void>;
}

// TODO add clx dependency to allow cass as props
export default  component$<TrayCardProps>((props) => {
  return (
    <div class={'relative base-tray text-gray-200 cursor-grab'}>
      <div class={'absolute top-0 right-1'}>
        <KebabMenu>
          <a
            onClick$={props.onEdit$}
            href="#"
            class="menu-item"
          >
            Edit
          </a>
          <a
            onClick$={props.onDelete$}
            href="#"
            class="menu-item"
          >
            Delete
          </a>
        </KebabMenu>
      </div>
      
      <p class={'text-sm'}> {props.tray.label} </p>
    </div>
  );
});

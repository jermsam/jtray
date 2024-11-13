import { $, component$, Slot, useSignal, useTask$ } from "@builder.io/qwik";
import clsx from "clsx";
import { LucideEllipsisVertical } from "~/components/icons";
import { useClickOutside } from "@ditadi/qwik-hooks";

type KebabMenuProps = {
  dropdownClass?: string;
  class?: string;
};

export default component$<KebabMenuProps>((props) => {
  const isOpen = useSignal(false);
  const dropdownPosition = useSignal({ top: 0, left: 0 });
  const button = useSignal<HTMLButtonElement>();
  const dropdown = useSignal<HTMLDivElement>();

  const handleDropDown = $(() => {
    if (!dropdown.value || !button.value) return;
    const buttonRect = button.value.getBoundingClientRect();
    const dropdownHeight = dropdown.value.offsetHeight;
    const dropdownWidth = dropdown.value.offsetWidth;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = buttonRect.bottom;
    let left = buttonRect.left;
    // Prevent dropdown from overflowing the viewport vertically
    const closeToViewPortBottom =
      buttonRect.bottom + dropdownHeight > viewportHeight;
    if (closeToViewPortBottom) {
      top = -dropdownHeight;
    } else {
      top = buttonRect.height;
    }

    // Prevent dropdown from overflowing the viewport horizontally
    const closeToViewRightBottom =
      buttonRect.left + dropdownWidth > viewportWidth;
    if (closeToViewRightBottom) {
      left = -(buttonRect.width + buttonRect.left);
    } else {
      left = -(buttonRect.width + buttonRect.left);
    }
    dropdownPosition.value = { top, left };
  });

  useTask$(async ({ track }) => {
    track(() => isOpen.value);
    await handleDropDown();
  });

  const toggleMenu = $(async () => {
    isOpen.value = !isOpen.value;
  });

  // Close the menu when clicking outside
  useClickOutside(
    dropdown,
    $(() => {
      isOpen.value = false;
    }),
  );

  return (
    <div class={clsx("relative", props.class)}>
      {/* Kebab Button */}
      <button
        ref={button}
        class="kebab-button p-2 "
        onClick$={toggleMenu}
        aria-expanded={isOpen.value}
        aria-controls="dropdown-menu"
      >
        <LucideEllipsisVertical />
      </button>
      {/* Dropdown Menu */}
      {isOpen.value && (
        <div
          ref={dropdown}
          class={clsx(
            "dropdown absolute z-10 rounded border border-gray-200 shadow-lg",
            props.dropdownClass,
          )}
          style={{
            top: `${dropdownPosition.value.top}px`,
            left: `-${31}px`,
          }}
        >
          <Slot />
        </div>
      )}
    </div>
  );
});

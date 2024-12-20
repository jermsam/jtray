import {component$} from '@builder.io/qwik';
import {type DocumentHead} from '@builder.io/qwik-city';
import { NavLink } from '~/components/nav-link';
import { Button } from '~/components/ui/button/button';
import TraysImage from '~/media/trays.webp?jsx';

export default component$(() => {
  
  return (
    <div class={'w-full h-full flex flex-col gap-10  items-center justify-center'}>
      <div class={'text-center'}>
        <p class={"text-4xl"}>JTrays</p>
        <p class={'text-sm max-w-md'}>Your temporary containers for items awaiting processing, review, or further handling.
        Ideal for clutter-free business operations and efficient task management.</p>
      </div>
      <div class={"w-60 h-60"}>
        <TraysImage/>
      </div>
     <div class={"text-h2 py-10"}>
       <NavLink href="/trays" activeClass="text-green-600">
         <Button look={'outline'} class={'bg-[#75617C] text-gray-200 text-sm'}>
           <span>Let's Explore</span>
         </Button>
       </NavLink>
     </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'JTray | Home',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};

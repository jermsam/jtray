import {component$} from '@builder.io/qwik';
import {type DocumentHead, Link} from '@builder.io/qwik-city';


export default component$(() => {
  
  return (
    <div class={'w-full h-full flex flex-col items-center justify-center'}>
      <Link href={'/dashboard'}>
        <span>Dashboard</span>
      </Link>
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

import {component$} from '@builder.io/qwik';
import {type DocumentHead, Link} from '@builder.io/qwik-city';
import SimpleLayout from "~/components/layouts/simple-layout";


export default component$(() => {
  
  return (
    <SimpleLayout>
      <Link href={'/dashboard'}>
        <span>Dashboard</span>
      </Link>
    </SimpleLayout>
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

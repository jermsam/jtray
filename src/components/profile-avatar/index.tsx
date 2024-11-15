import {$, component$,  useOnDocument, useSignal, useTask$ } from "@builder.io/qwik";
import { generateLetterAvatar } from 'letter-avatar-generator';
import { isServer } from '@builder.io/qwik/build';
import { generateRandomColor } from "~/utils";

export interface ProfileAvatarProps {
  username: string
  color?: string
}

export default component$<ProfileAvatarProps>((props) => {
  const profileImage  = useSignal<string>('')
  // const avatarColor = useSignal<string>('')
  // const darkMode = useContext(DarkModeContext);
  
  const initProfileAvatar = $(async () => {
    let backgroundColor = props.color;
    if(!backgroundColor){
      backgroundColor = generateRandomColor();
    }
    // const root = document.documentElement;
    // avatarColor.value = getComputedStyle(root).getPropertyValue(darkMode.value ? '--primary-4': '--primary-8').trim();
    profileImage.value =   generateLetterAvatar({
      content: props.username,
      backgroundColor,
      size: 100,
      font: { ratio: 0.6, weight: 600, }
    });
  })
  
  useTask$(({track}) => {
    track(()=>props.username)
    if(isServer) return
    initProfileAvatar()
  })
  
  useOnDocument('DOMContentLoaded', initProfileAvatar)
  
  return (<button
    class={"overflow-hidden w-6 h-6 flex items-center justify-center rounded-full"}
    style={{
      backgroundImage: `url("${profileImage.value}")`,
      backgroundSize: "contain",
      backgroundPosition: "center center"
    }}
  />)
});



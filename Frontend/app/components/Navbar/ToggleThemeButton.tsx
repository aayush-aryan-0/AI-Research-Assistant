"use client"

import { useTheme } from "next-themes";
import Image from "next/image";
export default function ToggleThemeButton(){
   const {theme, setTheme,resolvedTheme} = useTheme();
 
  return(

      <button onClick={()=>setTheme(theme==="dark"?"light":"dark")}
       className="w-fit h-fit p-0.5 font-bold bg-gray-900 text-white
        dark:text-black dark:bg-white rounded-full 
        hover:opacity-75 shadow-lg cursor-pointer
        ">
         <Image
         className="block"
          src={resolvedTheme==="dark"?"/sun.png":"/moon.png"}
          alt={resolvedTheme==="dark"?"light mode":"dark mode"}
          width={30}
          height={30}
          />
      </button>
 
  )
}
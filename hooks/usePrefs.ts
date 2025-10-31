import { PrefsContext } from "@/providers/PrefsProvider";
import { useContext } from "react";

export function usePrefs(){
    const content = useContext(PrefsContext)

    if (!content){
        throw Error("not in context range!")
    }
    return content 
}
import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";

export function useUser(){

    const content = useContext(UserContext)
    if (!content){
        throw Error("not in context range!")
    }

    return content
}
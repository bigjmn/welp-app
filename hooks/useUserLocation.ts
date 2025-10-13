import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";

export function useUserLocation(){
    const { location, errorMsg, user } = useContext(UserContext)

    return { location, errorMsg, user}
}
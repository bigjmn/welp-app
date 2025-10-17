import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";

export function useUser(){
    const { location, errorMsg, user, searchLocation, handleSearchLocation } = useContext(UserContext)

    return { location, errorMsg, user, searchLocation, handleSearchLocation}
}
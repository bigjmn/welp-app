import AsyncStorage from '@react-native-async-storage/async-storage';
import Location from "expo-location";
import { customAlphabet } from "nanoid/non-secure";
import React, { createContext, useEffect, useState } from "react";
interface UserProps {
    location: Location.LocationObject | null;
    errorMsg: string | null;
    user: User | null;
    logHistory: (resultName:string,review?:Review)=>void,
    searchLocation: string | null,
    handleSearchLocation:(sl:string)=>void 
}
const alphaNumber = "abcdefghijklmnopqrstuvwxyz123456789"

const generateId = customAlphabet(alphaNumber, 6)
export const UserContext = createContext<UserProps>({location:null, errorMsg:null, user: null, logHistory:()=>{}, searchLocation:null,handleSearchLocation:()=>{} })

export function UserLocationProvider({ children } : {children : React.ReactNode}){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [searchLocation, setSearchLocation] = useState<string | null>(null);

    const handleSearchLocation = (sl:string)=> {
      setSearchLocation(sl)
    }

    const logHistory = async (resultName:string, review?: Review) => {
      const timestamp = Date.now()
      const historyItem:HistoryItem = {
        timestamp,
        name: resultName, 
        review
      }
      try {
        if (user){
        const updatedUser:User = {...user, orderHistory: [...user.orderHistory, historyItem]}
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
      } else {
        throw Error("no user!")
      }

      } catch (e){
        console.log(e)
        
      }
      

    }

     useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }

          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        })();
      }, []);
      useEffect(() => {
        (async () => {
            try {
                const userJson = await AsyncStorage.getItem('user')
                if (userJson){
                    const userInfo = JSON.parse(userJson)
                    setUser(userInfo)

                } else {
                    const newId = generateId()
                    const newUser:User = {id: newId, preferUnseen:true, orderHistory:[]}
                    await AsyncStorage.setItem('user', JSON.stringify(newUser))
                    setUser(newUser)
                }
            } catch (e) {
                console.log(e)
            }
        })
      })

      return (
        <UserContext.Provider value={{ location, errorMsg, user, logHistory, searchLocation,handleSearchLocation }}>
            { children }
        </UserContext.Provider>
      )
}
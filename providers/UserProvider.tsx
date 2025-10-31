import { generateId } from '@/utils/randomizers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import React, { createContext, useEffect, useState } from "react";
import { PlaceDetailsFields } from 'react-native-google-places-textinput';
interface UserProps {
    location: Location.LocationObject | null;
    errorMsg: string | null;
    user: User | null;
    logHistory: (resultId:string, resultName:string,review?:Review)=>void,
    searchLocation: PlaceDetailsFields | null,
    handleSearchLocation:(sl:PlaceDetailsFields)=>void,
    usingCurrLocation:boolean,
    handleUsingCurrLocation:()=>void, 
    usingNow:boolean,
    handleUsingNow:()=>void,
    searchTime:Date|null,
    handleSearchTime:(newdate:Date)=>void

}

export const UserContext = createContext<UserProps>({location:null, errorMsg:null, user: null, logHistory:()=>{}, searchLocation:null,handleSearchLocation:()=>{},usingCurrLocation:true,handleUsingCurrLocation:()=>{},usingNow:true,handleUsingNow:()=>{},searchTime:null,handleSearchTime:()=>[] })

export function UserProvider({ children } : {children : React.ReactNode}){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [searchLocation, setSearchLocation] = useState<PlaceDetailsFields | null>(null);
    const [usingCurrLocation, setUsingCurrLocation] = useState(true)
    const [usingNow, setUsingNow] = useState(true)
    const [searchTime, setSearchTime] = useState<Date|null>(null)

    const handleSearchLocation = (sl:PlaceDetailsFields)=> {
      setSearchLocation(sl)
    }
    const handleUsingNow = () => {
      setUsingNow(x => !x)
    }
    const handleUsingCurrLocation = () => {
      console.log(usingCurrLocation)
      setUsingCurrLocation(x => !x)

    }
    const handleSearchTime = (newdate:Date) => {
      setSearchTime(newdate)
    }

    const logHistory = async (resultId:string,resultName:string, review?: Review) => {
      const timestamp = Date.now()
      const historyItem:HistoryItem = {
        id: resultId,
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
        })()
      }, [])

      return (
        <UserContext.Provider value={{ location, errorMsg, user, logHistory, searchLocation,handleSearchLocation, usingCurrLocation,handleUsingCurrLocation,usingNow,handleUsingNow, searchTime, handleSearchTime }}>
            { children }
        </UserContext.Provider>
      )
}
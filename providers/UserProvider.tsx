import { generateId } from '@/utils/randomizers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import * as Location from "expo-location";
import React, { createContext, useEffect, useState } from "react";
import { PlaceDetailsFields } from 'react-native-google-places-textinput';
interface UserProps {
    location: Location.LocationObject | null;
    errorMsg: string | null;
    user: User | null;
    logHistory: (resultId:string, resultName:string,timestamp:number,review?:Review)=>Promise<ConfirmMessage>,
    modifyHistory: (orderId:string, newReview?:Review)=>Promise<ConfirmMessage>,
    searchLocation: PlaceDetailsFields | null,
    handleSearchLocation:(sl?:PlaceDetailsFields)=>void,
    usingCurrLocation:boolean,
    locationPermissionPending:boolean,
    handleUsingCurrLocation:()=>void,
    usingNow:boolean,
    handleUsingNow:()=>void,
    searchTime:Date|null,
    handleSearchTime:(newdate:Date)=>void

}

export const UserContext = createContext<UserProps>({location:null, errorMsg:null, user: null, logHistory:async()=>({errMessage:null}),modifyHistory:async()=>({errMessage:null}), searchLocation:null,handleSearchLocation:()=>{},usingCurrLocation:true,locationPermissionPending:false,handleUsingCurrLocation:()=>{},usingNow:true,handleUsingNow:()=>{},searchTime:null,handleSearchTime:()=>[] })

export function UserProvider({ children } : {children : React.ReactNode}){
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null)
    const [searchLocation, setSearchLocation] = useState<PlaceDetailsFields | null>(null);
    const [usingCurrLocation, setUsingCurrLocation] = useState(true)
    const [locationPermissionPending, setLocationPermissionPending] = useState(false)
    const [usingNow, setUsingNow] = useState(true)
    const [searchTime, setSearchTime] = useState<Date|null>(null)

    const handleSearchLocation = (sl?:PlaceDetailsFields)=> {
      if (sl){
        setSearchLocation(sl)
      } else {
        setSearchLocation(null)
      }
      
    }
    const handleUsingNow = () => {
      setUsingNow(x => !x)
    }
    const handleUsingCurrLocation = () => {
      console.log('handleUsingCurrLocation called, current state:', usingCurrLocation)

      // The Switch passes the NEW desired value, but we're reading the OLD state
      // So if switch is currently OFF (false) and user taps it, they want it ON
      // If switch is currently ON (true) and user taps it, they want it OFF

      // If currently using location, user wants to toggle it OFF (synchronous)
      if (usingCurrLocation) {
        console.log('Disabling current location')
        setUsingCurrLocation(false)
        return
      }

      // If NOT currently using location, user wants to toggle it ON
      // Start async permission flow - don't wait for it
      console.log('Enabling current location - requesting permissions')
      ;(async () => {
        // Set pending state to disable switch during permission request
        setLocationPermissionPending(true)

        try {
          // Check/request permissions
          console.log('Checking location permissions...')
          let { status } = await Location.getForegroundPermissionsAsync()
          console.log('Current permission status:', status)

          // If not granted, request permission
          if (status !== 'granted') {
            console.log('Requesting location permission...')
            const permissionResult = await Location.requestForegroundPermissionsAsync()
            status = permissionResult.status
            console.log('Permission request result:', status)
          }

          // Only enable if permission granted
          if (status === 'granted') {
            console.log('Permission granted, enabling current location')
            setUsingCurrLocation(true)
            setErrorMsg(null)

            // Get current location
            try {
              const currentLocation = await Location.getCurrentPositionAsync({})
              setLocation(currentLocation)
              console.log('Got current location')
            } catch (err) {
              console.log('Error getting location:', err)
            }
          } else {
            console.log('Permission denied')
            setErrorMsg('Permission to access location was denied')
            setUsingCurrLocation(false)
          }
        } finally {
          // Clear pending state when done
          setLocationPermissionPending(false)
        }
      })()
    }
    const handleSearchTime = (newdate:Date) => {
      setSearchTime(newdate)
    }

    const modifyHistory = async (orderId:string, newReview?:Review) => {
      try {
        if (user){
          const updatedUser:User = {...user, orderHistory: user.orderHistory.map((oh) => oh.oid === orderId ? ({...oh, review:newReview}) : oh)}
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
          setUser(updatedUser)

          return { errMessage: null } as ConfirmMessage
        } else {
          throw Error("no user!")
        }
      } catch (e){
        let errMess = "error modifying review"
        if (e instanceof Error){
          errMess = e.message 
        }
        return {errMessage:errMess} as ConfirmMessage
      }

    }

    const logHistory = async (resultId:string,resultName:string, timestamp:number, review?: Review) => {
      const gid = generateId()
      
      const historyItem:HistoryItem = {
        oid:gid,
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

        return { errMessage: null } as ConfirmMessage 
        
      } else {
        throw Error("no user!")
      }

      } catch (e){
        let errMess = "error occurred!"
        if (e instanceof Error){
          errMess = e.message 
        }
        return {errMessage:errMess} as ConfirmMessage
        
      }
      

    }

     useEffect(() => {
        (async () => {
          // Don't request permission on startup - just check if we already have it
          let { status } = await Location.getForegroundPermissionsAsync();
          if (status !== 'granted') {
            // Don't have permission yet - user can enable it via the switch
            setUsingCurrLocation(false);
            return;
          }

          // We have permission - get current location
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          setUsingCurrLocation(true);
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
                    const newUser:User = {id: newId, orderHistory:[]}
                    await AsyncStorage.setItem('user', JSON.stringify(newUser))
                    await analytics().logEvent('newuser', {userid: newId})
                    setUser(newUser)
                }
            } catch (e) {
                console.log(e)
            }
        })()
      }, [])

      return (
        <UserContext.Provider value={{ location, errorMsg, user, logHistory, modifyHistory, searchLocation,handleSearchLocation, usingCurrLocation,locationPermissionPending,handleUsingCurrLocation,usingNow,handleUsingNow, searchTime, handleSearchTime }}>
            { children }
        </UserContext.Provider>
      )
}
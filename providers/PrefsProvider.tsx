import { createPrefDict } from '@/utils/preferencemaker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from "react";
interface PrefProps {
    foodPrefs:Record<string,boolean>;
    updateFoodPrefs:(fp:string)=>void;
    savePrefs: ()=>void;
}

export const PrefsContext = createContext<PrefProps>({foodPrefs:{},updateFoodPrefs:()=>{},savePrefs:()=>{}})

export function PrefsProvider({children}: {children:React.ReactNode}){

    const [foodPrefs, setFoodPrefs] = useState(createPrefDict())

    const updateFoodPrefs = (pf:string)=>{
        const newPfs = { ...foodPrefs }
        newPfs[pf] = !newPfs[pf]
        setFoodPrefs(newPfs)
    }

    const savePrefs = async () => {
        await AsyncStorage.setItem('prefs',JSON.stringify(foodPrefs))
    }

    useEffect(() => {
        (async () => {
            try {
                const prefsJson = await AsyncStorage.getItem('prefs')
                if (prefsJson){
                    const prefsInfo = JSON.parse(prefsJson)
                    setFoodPrefs(prefsInfo)
                } else {
                    const newPrefs = createPrefDict()
                    await AsyncStorage.setItem('prefs', JSON.stringify(newPrefs))
                }
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <PrefsContext.Provider value={{foodPrefs,updateFoodPrefs, savePrefs}}>
            { children }
        </PrefsContext.Provider>
    )

}
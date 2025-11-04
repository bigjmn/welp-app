import { createCatString, createPrefDict } from '@/utils/preferencemaker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from "react";
interface PrefProps {
    foodPrefs:Record<string,boolean>;
    updateFoodPrefs:(fp:string)=>void;
    savePrefs: ()=>void;
    catString: ()=>string;
    preferUnseen: number;
    updatePreferUnseen:(pu:number)=>void;
    preferCheap: number; 
    updatePreferCheap:(pc:number)=>void;
}

const CLEAR_STORAGE = false 

export const PrefsContext = createContext<PrefProps>({foodPrefs:{},updateFoodPrefs:()=>{},savePrefs:()=>{},catString:()=>(""),preferUnseen:2,updatePreferUnseen:()=>{},preferCheap:2,updatePreferCheap:()=>{}})

export function PrefsProvider({children}: {children:React.ReactNode}){

    const [foodPrefs, setFoodPrefs] = useState(createPrefDict())
    const [preferUnseen, setPreferUnseen] = useState(2)
    const [preferCheap, setPreferCheap] = useState(2)

    const catString = () => {
        return createCatString(foodPrefs)
    }
    const updatePreferUnseen = (pu:number) => {
        console.log(preferUnseen)
        setPreferUnseen(pu)

    }
    const updatePreferCheap = (pc:number) => {
        setPreferCheap(pc)
    }
    

    const updateFoodPrefs = (pf:string)=>{
        console.log(pf)
        const newPfs = { ...foodPrefs }
        newPfs[pf] = !newPfs[pf]
        setFoodPrefs(newPfs)
    }

    const savePrefs = async () => {
        await AsyncStorage.setItem('prefs',JSON.stringify({prefDict:foodPrefs, unseenPref:preferUnseen, cheapPref:preferCheap}))
        console.log("preferences saved!")
    }

    useEffect(() => {
        (async () => {
            try {
                if (CLEAR_STORAGE){
                    await AsyncStorage.clear()
                }
                const prefsJson = await AsyncStorage.getItem('prefs')
                if (prefsJson){
                    const { prefDict, unseenPref, cheapPref } = JSON.parse(prefsJson)
                    
                    console.log("loaded", prefDict, unseenPref)
                    
                    setFoodPrefs(prefDict)
                    setPreferUnseen(unseenPref)
                    setPreferCheap(cheapPref)
                } else {
                    const newPrefs = createPrefDict()
                    await AsyncStorage.setItem('prefs', JSON.stringify({prefDict:newPrefs, unseenPref:2, cheapPref:2}))
                }
            } catch (e) {
                console.log(e)
            }

            
        })()
        
    }, [])

    return (
        <PrefsContext.Provider value={{foodPrefs,updateFoodPrefs, savePrefs, catString, preferUnseen, updatePreferUnseen, preferCheap, updatePreferCheap}}>
            { children }
        </PrefsContext.Provider>
    )

}
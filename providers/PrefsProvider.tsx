import { createCatString, createPrefDict } from '@/utils/preferencemaker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from "react";
interface PrefProps {
    foodPrefs:Record<string,boolean>;
    updateFoodPrefs:(fp:string)=>void;
    savePrefs: ()=>void;
    catString: ()=>string;
    preferUnseen: boolean;
    updatePreferUnseen:()=>void
}

export const PrefsContext = createContext<PrefProps>({foodPrefs:{},updateFoodPrefs:()=>{},savePrefs:()=>{},catString:()=>(""),preferUnseen:true,updatePreferUnseen:()=>{}})

export function PrefsProvider({children}: {children:React.ReactNode}){

    const [foodPrefs, setFoodPrefs] = useState(createPrefDict())
    const [preferUnseen, setPreferUnseen] = useState(true)

    const catString = () => {
        return createCatString(foodPrefs)
    }
    const updatePreferUnseen = () => {
        console.log(preferUnseen)
        setPreferUnseen(x => !x)

    }
    

    const updateFoodPrefs = (pf:string)=>{
        console.log(pf)
        const newPfs = { ...foodPrefs }
        newPfs[pf] = !newPfs[pf]
        setFoodPrefs(newPfs)
    }

    const savePrefs = async () => {
        await AsyncStorage.setItem('prefs',JSON.stringify({prefDict:foodPrefs, unseenPref:preferUnseen, tester:"hi"}))
        console.log("preferences saved!")
    }

    useEffect(() => {
        (async () => {
            try {
                const prefsJson = await AsyncStorage.getItem('prefs')
                if (prefsJson){
                    const { prefDict, unseenPref, tester } = JSON.parse(prefsJson)
                    console.log(tester)
                    console.log("loaded", prefDict, unseenPref)
                    
                    setFoodPrefs(prefDict)
                    setPreferUnseen(unseenPref)
                } else {
                    const newPrefs = createPrefDict()
                    await AsyncStorage.setItem('prefs', JSON.stringify({prefDict:newPrefs, unseenPref:true, tester:"hi"}))
                }
            } catch (e) {
                console.log(e)
            }

            
        })()
        
    }, [])

    return (
        <PrefsContext.Provider value={{foodPrefs,updateFoodPrefs, savePrefs, catString, preferUnseen, updatePreferUnseen}}>
            { children }
        </PrefsContext.Provider>
    )

}
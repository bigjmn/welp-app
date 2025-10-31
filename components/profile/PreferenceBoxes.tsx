import { Checkbox } from "expo-checkbox"
import { StyleSheet } from "react-native"

import { usePrefs } from "@/hooks/usePrefs"
import { CATEGORIES_DICT } from "@/utils/preferencemaker"
import { ThemedText, ThemedView } from "../ui"

export default function PreferenceBoxes(){
    const { foodPrefs, updateFoodPrefs } = usePrefs() 

    return (
        <ThemedView style={styles.container}>
            {Object.entries(foodPrefs).map(([k,va],v) => (
                <ThemedView key={v}>
                    <Checkbox 
                        style={styles.checkbox}
                        value={va}
                        onChange={()=>updateFoodPrefs(k)}
                        />
                    <ThemedText>{CATEGORIES_DICT[k].label}</ThemedText>

                </ThemedView>
            ))
        }
        </ThemedView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    boxholder:{
        padding:3
    },
    checkbox:{

    }
})
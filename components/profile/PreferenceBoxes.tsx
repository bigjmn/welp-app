import { usePrefs } from "@/hooks/usePrefs"
import { useTheme } from "@/hooks/useTheme"
import { CATEGORIES_DICT } from "@/utils/preferencemaker"
import { Checkbox } from "expo-checkbox"
import { StyleSheet } from "react-native"
import { Spacer, ThemedText, ThemedView } from "../ui"

export default function PreferenceBoxes(){
    const { colors } = useTheme()
    const { foodPrefs, updateFoodPrefs } = usePrefs() 

    return (
        <ThemedView style={styles.container}>
            
            <ThemedText variant="medium">Category Filters</ThemedText>
            
            <Spacer height={5} />
            <ThemedView style={styles.boxholder}>
            {Object.entries(foodPrefs).map(([k,va],v) => (
                <ThemedView style={{width:"45%",display:'flex',flexDirection:'row',alignItems:'center',marginLeft:15}} key={v}>
                    <Checkbox 
                        color={colors.secondary}

                        style={styles.checkbox}
                        value={va}
                        onValueChange={()=>updateFoodPrefs(k)}
                        />
                    <ThemedText>{CATEGORIES_DICT[k].label}</ThemedText>
                
                </ThemedView>
                
            ))
            
        }
        </ThemedView>
        </ThemedView>
    )


}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        alignItems:'center'
        
    },

    boxholder:{
        padding:5,
        
        flexDirection:'row',
        flexWrap:'wrap',
        gap:4,
        rowGap:12,
        // borderColor:'white',
        // borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        
        
    },
    checkbox:{
        margin:5,
        marginLeft:20,
        marginRight:10,
        maxWidth:"40%"

    }
})
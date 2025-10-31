import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import moment from 'moment';
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import SearchModal from "../nav/SearchModal";
import { ThemedText, ThemedView } from "../ui";
export default function FinderOptions(){
    const { colors } = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const { searchLocation, searchTime, usingCurrLocation, usingNow } = useUser()


    const handlePress = () => {
        router.replace('/')
    }
    const handleModalOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <ThemedView style={styles.container}>
            
            <Pressable onPress={handleModalOpen} style={{flex:1,height:60}}>
                    <ThemedView style={{display:'flex',flex:1,flexDirection:'row', alignItems:"center", justifyContent:"center",padding:1,height:180}}>
                        <ThemedView style={{display:'flex',flexDirection:'row',alignItems:'center', padding:6}}>
                            <Ionicons size={16} style={{padding:3}} name="location-sharp" color={colors.iconColor}/>
                            <ThemedText style={{}} numberOfLines={1} variant="tabText">{usingCurrLocation ? "Your Location" : searchLocation?.formattedAddress}</ThemedText>

                        </ThemedView>
                        
                        {/* <Spacer width={22} /> */}
                        {/* <ThemedText > | </ThemedText> */}
                        <ThemedView style={{display:'flex',flexDirection:'row',alignItems:'center', padding:6}}>
                            <Ionicons size={16} style={{padding:3}} name="time-sharp" color={colors.iconColor} />
                            <ThemedText variant="tabText">{usingNow ? "Now" : moment(searchTime).format("h:mm a")}</ThemedText>

                        </ThemedView>
                        
                        

                    </ThemedView>
                </Pressable>

            
            <SearchModal isOpen={isOpen} handleClose={handleClose} />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        
        flexDirection: "row",
        position:'relative',
        width: "100%",
        overflow:'visible',
        alignItems: "center",
        justifyContent:"center",
        padding: 16
    },
    activeIcon: {backgroundColor:"#000", borderRadius:"50%", padding:4, margin:4},
    inactiveIcon: { borderRadius:"50%", padding:4, margin:4}
})
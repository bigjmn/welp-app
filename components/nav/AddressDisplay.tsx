import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet } from "react-native";
import AddressSearch from "../home/AddressSearch";
import { ThemedButton, ThemedText, ThemedView } from "../ui";
const {width:screenWidth, height:screenHeight} = Dimensions.get('window')
export const AddressDisplay = () => {
    const { searchLocation, handleSearchLocation } = useUser()
    const { colors } = useTheme()
    const [pickerOpen, setPickerOpen] = useState(false)

    const handlePickMade = () => {
        setPickerOpen(false)
    }
    const handleSetCurrent = () => {
        handleSearchLocation("")
        setPickerOpen(false)

    }

    return (
        <ThemedView style={{backgroundColor:'none',position:'relative'}}>
            <Pressable style={styles.container} onPress={() => setPickerOpen(true)}>

            <Ionicons name="location" color={colors.iconColor} />
            <ThemedText>{searchLocation ?? "Current Location"}</ThemedText>
            </Pressable>

            <Modal visible={pickerOpen} transparent={true}>
                <ThemedView style={styles.modalContainer}>
                    <ThemedView style={styles.pickerCard}>
                        
                        <AddressSearch handlePickMade={handlePickMade} />
                        <ThemedButton style={{display:'flex',flexDirection:'row',width:'60%', justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}} onPress={handleSetCurrent}>
                            
                            <ThemedText style={{textDecorationLine:'underline'}}>Use current location</ThemedText>
                        </ThemedButton>
                    </ThemedView>
                </ThemedView>
            </Modal>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:"row",
        
    },
    modalContainer: {
        top:0,
        left:0,
        justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        backgroundColor:"transparent"

    },
    pickerCard: {
        padding: 5,
    }
})
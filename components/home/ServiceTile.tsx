import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "../ui";
// type ServiceType = "search"|"restaurant"|"wine"|"bicycle"
interface WelpService {
    name: ServiceType;
    isSelected: boolean;
    clickHandle: VoidFunction
}
export function ServiceTile({name, isSelected, clickHandle}:WelpService){

    const { colors } = useTheme()
    const iconName = 
    name === "Bar" ? "wine" : 
    name === "Delivery" ? "bicycle" : 
    name === "Restaurant" ? "restaurant" :
    name === "Search" ? "search"
    : "home"

    return (
        <Pressable style={{width: "40%"}} onPress={clickHandle}>
            <ThemedView style={[styles.container, {backgroundColor: isSelected ? colors.primary : "gray"}]}>
                <Ionicons name={iconName} size={48} />
                <ThemedText>{name}</ThemedText>

            </ThemedView>
        </Pressable>
    )


}

const styles = StyleSheet.create({
    container: {
        aspectRatio: "1/1",
        justifyContent: "center",
        alignItems: "center",
        
        borderRadius: 15

    }
})
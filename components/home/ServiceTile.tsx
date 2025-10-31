import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "../ui";
// type ServiceType = "search"|"restaurant"|"wine"|"bicycle"
interface WelpService {
    name: ServiceType;
    isSelected: boolean;
    clickHandle: VoidFunction
}
const bar=require("../../assets/service_icons/bar.png")
const bargray=require("../../assets/service_icons/bargray.png")

const dish=require("@/assets/service_icons/dish.png")
const dishgray=require("@/assets/service_icons/dishgray.png")

const search=require("@/assets/service_icons/search.png")
const searchgray=require("@/assets/service_icons/searchgray.png")

const delivery=require("@/assets/service_icons/delivery.png")
const deliverygray=require("@/assets/service_icons/deliverygray.png")
export function ServiceTile({name, isSelected, clickHandle}:WelpService){

    const { colors } = useTheme()
    const iconName = 
    name === "Bar" ? "wine" : 
    name === "Delivery" ? "bicycle" : 
    name === "Restaurant" ? "restaurant" :
    name === "Search" ? "search"
    : "home"

    const imsrc = 
    (name === "Bar" && isSelected) ? bar : 
    (name === "Delivery" && isSelected) ? delivery : 
    (name === "Restaurant" && isSelected) ? dish :
    (name === "Search" && isSelected) ? search :
    (name === "Bar" && !isSelected) ? bargray : 
    (name === "Delivery" && !isSelected) ? deliverygray : 
    (name === "Restaurant" && !isSelected) ? dishgray :
    (name === "Search" && !isSelected) ? searchgray 
    : "home"

    return (
        <Pressable style={{width: "40%"}} onPress={clickHandle}>
            <ThemedView style={[styles.container, {backgroundColor: isSelected ? colors.primary : "#888"}]}>
                <Image source={imsrc} contentFit="cover" style={{height:200,width:200}} />
                

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
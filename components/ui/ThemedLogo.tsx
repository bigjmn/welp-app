import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import ThemedView from "./ThemedView";
const lightLogo = require("@/assets/welplogos/welp_black_cutout.png")
const darkLogo = require("@/assets/welplogos/welp_white_cutout.png")
export default function ThemedLogo(){
    const { theme } = useTheme()

    return (
        <ThemedView style={{width:"100%", minHeight:150}}>
        <Image 
            source={theme === "light" ? lightLogo : darkLogo}
            contentFit="contain"
            style={{flex:1}}
            />
        </ThemedView>
    )
}
import { useTheme } from "@/hooks/useTheme";
import ThemedView from "./ThemedView";
export default function DividingLine(){
    const { colors } = useTheme()
    return (
        <ThemedView style={{height:2, width:"80%", backgroundColor:colors.text, alignSelf:"center"}} />
    )
}
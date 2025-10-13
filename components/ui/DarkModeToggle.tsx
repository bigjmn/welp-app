import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
export default function DarkModeToggle(){
    const { theme, toggleTheme, colors } = useTheme()

    return (
        <Pressable style={{padding:4}} onPress={toggleTheme}>
            {theme === "light" ? (
                <Ionicons color={colors.iconColor} name="moon" size={32} />
            ) : (
                <Ionicons color={colors.iconColor} name="sunny" size={32} />
            )}
        </Pressable>
    )

}
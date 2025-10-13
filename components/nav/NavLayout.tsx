import { usePathname, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ui";

import { useTheme } from "@/hooks/useTheme";
import { PrimaryButton } from "../ui";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function NavLayout(){
    const { colors } = useTheme()
    const router = useRouter()
    const pathname = usePathname()

    const handlePress = () => {
        router.replace('/')
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={{flexDirection:'row'}}>
                <PrimaryButton name="Welp" onPress={handlePress} />
            </ThemedView>
            <DarkModeToggle />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent:"space-between",
        padding: 16
    },
    activeIcon: {backgroundColor:"#000", borderRadius:"50%", padding:4, margin:4},
    inactiveIcon: { borderRadius:"50%", padding:4, margin:4}
})
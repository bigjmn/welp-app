import { useTheme } from "@/hooks/useTheme";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import AddressSearch from "../home/AddressSearch";
import { PrimaryButton, ThemedView } from "../ui";
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
            <ThemedView style={{flexDirection:'row',overflow:'visible',zIndex:4}}>
                <PrimaryButton name="Welp" onPress={handlePress} />
                <AddressSearch handlePickMade={()=>{}} />
            </ThemedView>
            <DarkModeToggle />
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
        justifyContent:"space-between",
        padding: 16
    },
    activeIcon: {backgroundColor:"#000", borderRadius:"50%", padding:4, margin:4},
    inactiveIcon: { borderRadius:"50%", padding:4, margin:4}
})
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ui";
export default function Navbar(){
    const router = useRouter()
    const pathname = usePathname()

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.routebuttonsholder}>
                <Ionicons.Button name="home" onPress={() => router.replace('/')} />
                <Ionicons.Button name="person" onPress={() => router.replace('/profile')} />
                <Ionicons.Button name="information" onPress={() => router.replace("/about")} />
            </ThemedView>

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    routebuttonsholder: {
        display: 'flex',
        flexDirection: 'row'
    }
})
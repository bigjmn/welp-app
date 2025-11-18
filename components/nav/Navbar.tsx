import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ui";
import DarkModeToggle from "../ui/DarkModeToggle";
export default function Navbar(){
    const router = useRouter()
    const pathname = usePathname()
    const { colors } = useTheme()
    const ICONSIZE:number = 26

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems:'center',
            width:'100%',
            padding:10
        },
        routebuttonsholder: {
            display: 'flex',
            flexDirection: 'row',
            alignItems:"center"
        },
        iconstyle: {
            
            padding:4,
            backgroundColor:colors.background
        }
    })

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.routebuttonsholder}>
                <Ionicons.Button color={pathname === '/' ? colors.iconColorFocused : colors.iconColor} name="home-sharp" onPress={() => router.replace('/')} size={ICONSIZE} style={styles.iconstyle} />
                <Ionicons.Button color={pathname === '/profile' ? colors.iconColorFocused : colors.iconColor} name="person-sharp" onPress={() => router.replace('/profile')} size={ICONSIZE} style={styles.iconstyle} />
                <Ionicons.Button color={pathname === '/about' ? colors.iconColorFocused : colors.iconColor} name="information-circle-sharp" onPress={() => router.replace("/about")} size={ICONSIZE} style={styles.iconstyle} />
            </ThemedView>
            <ThemedView style={styles.routebuttonsholder}>
                <DarkModeToggle />

            </ThemedView>

        </ThemedView>
    )
    
}

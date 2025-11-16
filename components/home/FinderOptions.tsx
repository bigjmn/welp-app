import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import moment from 'moment';
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import SearchModal from "../nav/SearchModal";
import { ThemedText, ThemedView } from "../ui";
export default function FinderOptions(){
    const { colors } = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const { searchLocation, searchTime, usingCurrLocation, usingNow } = useUser()


    const handlePress = () => {
        router.replace('/')
    }
    const handleModalOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <ThemedView style={styles.container}>

            <Pressable onPress={handleModalOpen} style={styles.pressable}>
                <ThemedView style={styles.contentRow}>
                    <ThemedView style={styles.locationSection}>
                        <Ionicons size={16} style={styles.icon} name="location-sharp" color={colors.iconColor}/>
                        <ThemedText
                            style={styles.locationText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            variant="medium"
                        >
                            {usingCurrLocation ? "Your Location" : (searchLocation?.formattedAddress || "Set Location")}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.timeSection}>
                        <Ionicons size={16} style={styles.icon} name="time-sharp" color={colors.iconColor} />
                        <ThemedText variant="medium">{usingNow ? "Now" : moment(searchTime).format("h:mm a")}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </Pressable>


            <SearchModal isOpen={isOpen} handleClose={handleClose} />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        position: 'relative',
        width: "100%",
        overflow: 'visible',
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    pressable: {
        flex: 1,
        height: 56,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    contentRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
        height: 56,
        gap: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(15,76,117,0.15)',
    },
    locationSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        flex: 1,
        maxWidth: '60%',
        minWidth: 120
    },
    locationText: {
        flex: 1,
        maxWidth: '100%'
    },
    timeSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        minWidth: 80
    },
    icon: {
        padding: 3
    },
    activeIcon: {
        backgroundColor: "#000",
        borderRadius: 50,
        padding: 4,
        margin: 4
    },
    inactiveIcon: {
        borderRadius: 50,
        padding: 4,
        margin: 4
    }
})
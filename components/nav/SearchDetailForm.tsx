import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { StyleSheet, Switch } from "react-native";
import AddressSearch from "../home/AddressSearch";
import { Spacer, ThemedText, ThemedView } from "../ui";

export default function SearchDetailForm() {
    const { usingCurrLocation, handleUsingCurrLocation, usingNow, handleUsingNow, searchTime, handleSearchTime } = useUser()
    const { theme, colors } = useTheme()

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        console.log(date)
        if (!date) {
            console.log("no date")
            return
        }
        handleSearchTime(date)
    }

    return (
        <ThemedView style={styles.container}>
            {/* Location Section */}
            <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Location</ThemedText>
                <Spacer height={12} />

                <ThemedView style={styles.fieldTile}>
                    <ThemedView style={styles.fieldContent}>
                        <ThemedText style={[
                            styles.fieldLabel,
                            usingCurrLocation && { color: colors.iconColor, opacity: 0.6 }
                        ]}>
                            {usingCurrLocation ? "Location Search (disabled)" : "Search Location"}
                        </ThemedText>
                        <Spacer height={8} />
                        <AddressSearch />
                    </ThemedView>

                    <ThemedView style={styles.toggleWrapper}>
                        <ThemedView style={styles.toggleContainer}>
                            <ThemedText style={[
                                styles.toggleLabel,
                                usingCurrLocation && { color: colors.primary, fontWeight: '600' }
                            ]}>
                                Use Current
                            </ThemedText>
                            <Switch
                                onValueChange={handleUsingCurrLocation}
                                value={usingCurrLocation}
                                trackColor={{ false: colors.iconColor, true: colors.primary }}
                                thumbColor={usingCurrLocation ? '#FFFFFF' : '#F3F4F6'}
                            />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ThemedView>

            <Spacer height={32} />

            {/* Time Section */}
            <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Time</ThemedText>
                <Spacer height={12} />

                <ThemedView style={styles.fieldTile}>
                    <ThemedView style={styles.fieldContent}>
                        <ThemedText style={[
                            styles.fieldLabel,
                            usingNow && { color: colors.iconColor, opacity: 0.6 }
                        ]}>
                            {usingNow ? "Time Picker (disabled)" : "Choose Time"}
                        </ThemedText>
                        <Spacer height={8} />
                        <ThemedView style={[
                            styles.timePickerWrapper,
                            usingNow && styles.timePickerDisabled
                        ]}>
                            <RNDateTimePicker
                                disabled={usingNow}
                                mode="time"
                                value={searchTime ?? new Date()}
                                themeVariant={theme}
                                onChange={handleDateChange}
                            />
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.toggleWrapper}>
                        <ThemedView style={styles.toggleContainer}>
                            <ThemedText style={[
                                styles.toggleLabel,
                                usingNow && { color: colors.primary, fontWeight: '600' }
                            ]}>
                                Use Now
                            </ThemedText>
                            <Switch
                                style={{ alignSelf: "flex-end" }}
                                value={usingNow}
                                onChange={handleUsingNow}
                                trackColor={{ false: colors.iconColor, true: colors.primary }}
                                thumbColor={usingNow ? '#FFFFFF' : '#F3F4F6'}
                            />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    section: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    fieldTile: {
        flexDirection: 'column',
        width: "100%",
        gap: 16,
    },
    fieldContent: {
        width: '100%',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    toggleWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        paddingTop: 8,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toggleLabel: {
        fontSize: 14,
    },
    timePickerWrapper: {
        opacity: 1,
    },
    timePickerDisabled: {
        opacity: 0.4,
    }
})
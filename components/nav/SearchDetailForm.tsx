import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { StyleSheet, Switch } from "react-native";
import AddressSearch from "../home/AddressSearch";
import { Spacer, ThemedText, ThemedView } from "../ui";
export default function SearchDetailForm(){
    const { usingCurrLocation, handleUsingCurrLocation, usingNow, handleUsingNow, searchTime, handleSearchTime} = useUser()
    const { theme } = useTheme()

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        console.log(date)
        if (!date){
            console.log("no date")
            return
        }
        handleSearchTime(date)
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Location</ThemedText>
            <ThemedView style={styles.fieldTile}>
                <ThemedView>
                    <ThemedText>Search</ThemedText>
                    <AddressSearch />
                </ThemedView>
                <ThemedView style={{display:'flex',flexDirection:'row'}}>
                
                <Switch onValueChange={handleUsingCurrLocation} value={usingCurrLocation} />
                <ThemedText>Use Current</ThemedText>
                </ThemedView>
            </ThemedView>
            <Spacer height={30} />
            <ThemedView style={styles.fieldTile}>
                <ThemedView>
                    <ThemedText>Choose Time</ThemedText>
                    <RNDateTimePicker disabled={usingNow} mode="time" value={searchTime ?? new Date()} themeVariant={theme} onChange={handleDateChange} />

                </ThemedView>
                <ThemedView>
                    <ThemedText>
                        Now
                    </ThemedText>
                    <Switch style={{alignSelf:"flex-end"}} value={usingNow} onChange={handleUsingNow} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    fieldTile: {
        display:'flex',
        flexDirection:'row',
        width:"80%",
        justifyContent:"space-between",
        alignItems:"center"

    }
})
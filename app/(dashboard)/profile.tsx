import OrderHistory from "@/components/profile/OrderHistory";
import PreferenceBoxes from "@/components/profile/PreferenceBoxes";
import SliderZone from "@/components/profile/SliderZone";
import { PrimaryButton, Spacer, ThemedView, UnderlinedButton } from "@/components/ui";
import { usePrefs } from "@/hooks/usePrefs";
import { useState } from 'react';
import { StyleSheet } from "react-native";
type ProfileTab = "preferences"|"history"

export default function Profile(){
    const [activeTab, setActiveTab] = useState<ProfileTab>("preferences")

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.tabsHolder}>
                <UnderlinedButton name="Preferences" isActive={activeTab === "preferences"} onPress={() => setActiveTab("preferences")} />
                <UnderlinedButton name="Order History" isActive={activeTab === "history"} onPress={() => setActiveTab("history")} />

            </ThemedView>
            <ThemedView style={styles.section}>
                {activeTab === "preferences" ? (
                    <PreferenceSecion />
                ) : <HistorySection />}

            </ThemedView>
            
        </ThemedView>
    )

}

function PreferenceSecion(){
    const { preferUnseen, updatePreferUnseen, savePrefs } = usePrefs()
    return (
        <ThemedView>
            <PreferenceBoxes />
            <Spacer height={30} />
            {/* <ThemedView style={styles.unseenSwitch}>
                <Switch 
                    value={preferUnseen}
                    onValueChange={updatePreferUnseen}
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    />
                    <Spacer width={10} />
                    <ThemedText>Prefer Unseen</ThemedText>
            </ThemedView> */}
            <SliderZone />
            <PrimaryButton name="save preferences" onPress={savePrefs} />
        </ThemedView>
    )
}
function HistorySection(){
    return (
        <ThemedView>
            <OrderHistory />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center'
    },
    tabsHolder: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    section: {
        padding:3,
        flex:1
    },
    unseenSwitch: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:"100%",
        justifyContent:"center"
    }
})
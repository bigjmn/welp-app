import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { PrimaryButton, Spacer, ThemedTextInput, ThemedView } from "../ui";
import { ServiceTile } from "./ServiceTile";
const SERVICES:ServiceType[] = ["Delivery", "Restaurant", "Bar", "Search"]
export function TileGrid(){
    const [serviceType, setServiceType] = useState<ServiceType>("Delivery")
    const [searchInput, setSearchInput] = useState<string>("")
    
    const router = useRouter()

    const goToResults = () => {
        router.replace({pathname: '/result', params:{serviceType, searchInput}})
    }

    return (
        <ThemedView style={styles.container}>
        <ThemedView style={styles.tilegrid}>
            {SERVICES.map((service, idx) => (
                <ServiceTile 
                key={idx}
                name={service} 
                isSelected={service === serviceType} 
                clickHandle={() => setServiceType(service)} />
            ))}
        </ThemedView>
        {serviceType === "Search" ? (
            <ThemedView style={{height:60, width:"100%", flexDirection:"row",justifyContent:"center"}}>
                <ThemedTextInput value={searchInput} onChangeText={setSearchInput} />
            </ThemedView>

        ): (
            <Spacer height={60}/>
        )}
        <PrimaryButton style={{width:"80%"}} name="Let's Go!" onPress={goToResults} />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        width:"100%"


    },
    tilegrid: {
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center",
        flexWrap: "wrap",
        width: "100%",
        gap: 10
    }
})
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ui";

import { ServiceTile } from "./ServiceTile";
const SERVICES:ServiceType[] = ["Delivery", "Restaurant", "Bar", "Search"]
export function TileGrid(){
    const [serviceType, setServiceType] = useState<ServiceType>("Delivery")

    return (
        <ThemedView style={styles.container}>
            {SERVICES.map((service, idx) => (
                <ServiceTile 
                key={idx}
                name={service} 
                isSelected={service === serviceType} 
                clickHandle={() => setServiceType(service)} />
            ))}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center",
        flexWrap: "wrap",
        width: "100%",
        gap: 10
    }
})
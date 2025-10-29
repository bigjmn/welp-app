import { ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";

export default function Profile(){

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Hello Profile</ThemedText>
        </ThemedView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center'
    }
})
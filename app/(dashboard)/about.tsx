import { ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";

export default function About(){

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Hello About</ThemedText>
        </ThemedView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center'
    }
})
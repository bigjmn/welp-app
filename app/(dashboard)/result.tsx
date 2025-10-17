import { StyleSheet } from "react-native";

import { ResultCard } from "@/components/results/ResultCard";
import { PrimaryButton, Spacer, ThemedText, ThemedView } from "@/components/ui";
interface ResultProps {
    result: ResultData
}
export default function Result({result} : ResultProps){
    const handleReject = () => {
        console.log('rejection handler')
    }
    const handleAccept = () => {
        console.log('accept handler')
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Welp, you're getting...</ThemedText>
            <ResultCard result={result} />
            <Spacer />
            <PrimaryButton style={styles.button} name="Welp, I tried it..." onPress={handleAccept} />
            <PrimaryButton style={styles.button} name="No welping way" onPress={handleReject} />
        </ThemedView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    button: {
        width: "60%"
    }
})
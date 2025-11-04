import { Spacer, ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";
export default function About(){

    return (
        <ThemedView style={styles.container}>
            <Spacer height={60} />
            <ThemedText variant="header">About</ThemedText>
            <Spacer height={30} />
            <ThemedText style={styles.infoText}>
                Aristotle once said “Five choices is a blessing, a thousand is a cruse.” Nobody wants to scroll through a million options when deciding what bar to go to or what restaurant to order from. That’s precious time that could be spent making up more Aristotle quotes. 
            </ThemedText>
            <Spacer height={30} />
            <ThemedText style={styles.infoText}>
                With Welp, you can cut right to the chase. You don’t have to choose where to go. We’ll tell you. You get one option, and welp - that’s what you’re doing. 
            </ThemedText>
            <Spacer height={30} />
            <ThemedText style={styles.infoText}>
            Welp is brought to you by Noah Madoff and J Nicks Productions. 

            </ThemedText>
        </ThemedView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        padding:22,
        
    },
    infoText: {
        fontSize:18
    }
})
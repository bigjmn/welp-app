import { Spacer, ThemedText, ThemedView } from "@/components/ui";
import { StyleSheet } from "react-native";
export default function About(){

    return (
        <ThemedView style={styles.container}>
            <Spacer height={20} />
            <ThemedText variant="header">About</ThemedText>
            {/* <Spacer height={30} /> */}
            <ThemedView>
            <ThemedText variant="header2" style={styles.subheadText}>Why welp?</ThemedText>
            <ThemedText style={styles.infoText}>
                Aristotle once said “Five choices is a blessing, a thousand is a curse.” Nobody wants to scroll through a million options when deciding what bar to go to or what restaurant to order from. That’s precious time that could be spent coming up with fake Aristotle quotes. 
            </ThemedText>
            <Spacer height={16}/>
            {/* <Spacer height={30} /> */}
            <ThemedText style={styles.infoText}>
                With Welp, you can cut right to the chase. You don’t have to choose where to go. We’ll tell you. You get one option, and welp - that’s what you’re doing. 
            </ThemedText>
            </ThemedView>

            <ThemedView>
            <ThemedText variant="header2" style={styles.subheadText}>How is the result chosen?</ThemedText>
            <ThemedText style={styles.infoText}>
                The result is random but weighted more heavily towards something we think you'll like. You can update your preferenes as well; unselecting a category will filter out certian results. The preference sliders won't filter out results but will affect the relative likelihoods.
            </ThemedText>
            </ThemedView>

            <ThemedView>
            <ThemedText variant="header2" style={styles.subheadText}>Where do reviews go?</ThemedText>
            <ThemedText style={styles.infoText}>
                Your reviews aren't sent or posted anywhere, they're just used determine the likelihood of getting that place again. Additional comments should be short and to the point, like "way too loud" or "great food but long line", etc.  
            </ThemedText>
            </ThemedView>
            
            
            {/* <Spacer height={30} /> */}
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
        gap:16
        
    },
    infoText: {
        fontSize:14
    },
    subheadText: {
        textAlign:"center",
        
        
        fontSize:16,
        marginBottom:10,
        fontWeight:"bold"
    }
})
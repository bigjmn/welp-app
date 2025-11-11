import { PrimaryButton, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
export default function ReviewScreen({result}:{result:ResultData}){
    const [reviewState, setReviewState] = useState<Review|null>(null) 
    const [addedComment, setAddedComment] = useState("")
    const [orderTime, setOrderTime] = useState<number|null>(null)
    const [logPending, setLogPending] = useState(false)

    const router = useRouter()

    const { colors } = useTheme()

    const { logHistory } = useUser()

    const handleReview = async () => {
        if (!orderTime || !result || logPending || !reviewState){
            return
        }
        setLogPending(true)
        try {
            const {errMessage} = await logHistory(result.id, result.name, orderTime, reviewState)
            if (errMessage !== null){
                throw Error(errMessage)
            }
            setLogPending(false)
            router.navigate('/')
        } catch (e){
            console.log(e)
            setLogPending(false)
        }
    }
    const handleSkip = async () => {
        if (!orderTime || !result || logPending){
            return
        }

    }
    useEffect(() => {
        if (result){
            setOrderTime(Date.now())
            console.log("recorded from result screen")

        }
    }, [result])

    return (
        <ThemedView style={styles.container}>
            <ThemedText variant="header2">How was {result.name}?</ThemedText>
            <ThemedView style={styles.reviewButtonsHolder}>
                {/* good review */}
                <Pressable onPress={() => setReviewState("Pretty dece!")} style={[styles.reviewButton, {backgroundColor: colors.background}]}>
                    <ThemedText variant="medium" style={{opacity: reviewState === "Pretty dece!" ? 1 : .5}}>Pretty dece!</ThemedText>
                    <Ionicons size={20} color={reviewState === "Pretty dece!" ? "green" : colors.text} name="thumbs-up-sharp" style={{opacity: reviewState === "Pretty dece!" ? 1 : .5}} />
                </Pressable>
                {/* bad review */}
                <Pressable onPress={() => setReviewState("Eh.")} style={[styles.reviewButton, {backgroundColor: colors.background}]}>
                    <ThemedText variant="medium" style={{opacity: reviewState === "Eh." ? 1 : .5}}>Eh.</ThemedText>
                    <Ionicons size={20} color={reviewState === "Eh." ? "red" : colors.text} name="thumbs-down-sharp" style={{opacity: reviewState === "Eh." ? 1 : .5}} />
                </Pressable>

            </ThemedView>
            <View style={styles.inputHolder}>
                <ThemedText variant="medium">Add a comment</ThemedText>
            <TextInput
                style={{backgroundColor:colors.background, color: colors.text, padding:10, textAlignVertical:'top', height:120}}
                multiline={true}
                numberOfLines={4}
                onChangeText={setAddedComment}
                value={addedComment}
                placeholder="Optional, but helps the AI learn your preferences"
             />
             </View>
             <PrimaryButton disabled={(!reviewState || logPending)} name="Submit" onPress={handleReview} />
             <ThemedButton disabled={logPending} onPress={handleSkip}>
                <ThemedText>Skip</ThemedText>
             </ThemedButton>

        </ThemedView>
    )



    // const {result}:{ result:ResultData } = useLocalSearchParams()


}
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        padding:5
    },
    reviewButton: {
        width: "40%",
        flexDirection:'row'
    },
    reviewButtonsHolder: {
        width:"90%",
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    inputHolder: {}
    
})
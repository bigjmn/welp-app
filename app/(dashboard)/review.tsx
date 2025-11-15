import { PrimaryButton, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
export default function ReviewScreen(){
    const [reviewState, setReviewState] = useState<Review|null>(null) 
    const [addedComment, setAddedComment] = useState("")
    const [orderTime, setOrderTime] = useState<number|null>(null)
    const [logPending, setLogPending] = useState(false)

    const router = useRouter()

    const { id, name }:{id:string, name:string} = useLocalSearchParams()

    const { colors } = useTheme()

    const { logHistory } = useUser()

    const handleReview = async () => {
        if (!orderTime || !id || logPending || !reviewState){
            return
        }
        setLogPending(true)
        try {
            const {errMessage} = await logHistory(id, name, orderTime, reviewState)
            if (errMessage !== null){
                throw Error(errMessage)
            }
            setLogPending(false)
            router.replace('/')
        } catch (e){
            console.log(e)
            setLogPending(false)
        }
    }
    const handleSkip = async () => {
        if (!orderTime || !id || logPending){
            return
        }
        router.replace('/')

    }
    useEffect(() => {
        if (id){
            setOrderTime(Date.now())
            setReviewState(null)
            console.log("recorded from result screen")

        }
    }, [id])

    return (
        <ThemedView style={styles.container}>
        <ThemedView style={[styles.content]}>
            <View style={{width:"90%"}}>
            <ThemedText variant="header2">How was {name}?</ThemedText>
            </View>
            <View style={{width:"90%"}}>
                <ThemedText variant="italic">
                    Reviews and comments are private and will not affect the search algorithm for any other user.
                </ThemedText>
            </View>
            <ThemedView style={styles.reviewButtonsHolder}>
                {/* good review */}
                <Pressable onPress={() => setReviewState("Pretty dece!")} style={[styles.reviewButton, {backgroundColor:colors.uiBackground}]}>
                    <ThemedText variant="medium" style={{opacity: reviewState === "Pretty dece!" ? 1 : .5}}>Pretty dece!</ThemedText>
                    <Ionicons size={20} color={reviewState === "Pretty dece!" ? "green" : colors.text} name="thumbs-up-sharp" style={{opacity: reviewState === "Pretty dece!" ? 1 : .5}} />
                </Pressable>
                {/* bad review */}
                <Pressable onPress={() => setReviewState("Eh.")} style={[styles.reviewButton, {backgroundColor:colors.uiBackground}]}>
                    <ThemedText variant="medium" style={{opacity: reviewState === "Eh." ? 1 : .5}}>Eh.</ThemedText>
                    <Ionicons size={20} color={reviewState === "Eh." ? "red" : colors.text} name="thumbs-down-sharp" style={{opacity: reviewState === "Eh." ? 1 : .5}} />
                </Pressable>

            </ThemedView>
            <View style={styles.inputHolder}>
                <ThemedText style={styles.label} variant="medium">Add a comment</ThemedText>
            <TextInput
                style={{backgroundColor:colors.uiBackground, color: colors.text, padding:10, textAlignVertical:'top', height:120, borderRadius:8}}
                multiline={true}
                numberOfLines={4}
                onChangeText={setAddedComment}
                value={addedComment}
                placeholder="Optional, but helps the AI learn your preferences"
                placeholderTextColor={colors.iconColor}
             />
             </View>
             <View style={{width:"90%"}}>
             <PrimaryButton style={{width:"100%", opacity: (!reviewState || logPending) ? .5 : 1}} disabled={(!reviewState || logPending)} name="Submit" onPress={handleReview} />
             <ThemedButton style={{width:"100%",backgroundColor:"white",borderWidth:1,borderColor:colors.primary}} disabled={logPending} onPress={handleSkip}>
                <ThemedText style={{color:colors.primary}}>Skip</ThemedText>
             </ThemedButton>
             </View>

        </ThemedView>
        </ThemedView>
    )



    // const {result}:{ result:ResultData } = useLocalSearchParams()


}
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'

    },
    content: {
        
        alignItems:'center',
        padding:5,
        gap:20,
        width:320
    },
    reviewButton: {
        width: "45%",
        flexDirection:'row',
        height:60,
        padding:20,
        justifyContent:'center',
        alignItems:'center',
        gap:5,
        borderRadius:8
    },
    reviewButtonsHolder: {
        width:"90%",
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:"transparent"
    },
    inputHolder: {
        width:"90%"
    },
    label: {
        marginBottom:5
    }
    
})
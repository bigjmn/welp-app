import { PrimaryButton, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function EditReviewModal({oid, closeModal}:{oid:string, closeModal:()=>void}){
    const [name, setName] = useState("")
    const [reviewState, setReviewState] = useState<Rating|null>(null)
    const [addedComment, setAddedComment] = useState("")
    const [logPending, setLogPending] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)


    const { colors } = useTheme()
    

    const { modifyHistory, user } = useUser()

    useEffect(() => {
        if (!oid || !user) return;
        const historyItem = user.orderHistory.find(oh => oh.oid === oid)
        if (!historyItem){
            return
        }
        setName(historyItem.name)
        if (historyItem.review){
            setReviewState(historyItem.review.rating)
            if (historyItem.review.addedComment){
                setAddedComment(historyItem.review.addedComment)
            }
        }
    }, [])

    const handleSave = async () => {
        if (!oid || logPending || !reviewState){
            return
        }
        const orderReview:Review = {rating:reviewState, addedComment:addedComment}
        setLogPending(true)
        setSaveSuccess(false)
        try {
            const {errMessage} = await modifyHistory(oid, orderReview)
            if (errMessage !== null){
                throw Error(errMessage)
            }
            console.log("save successful")
            setSaveSuccess(true)
            setLogPending(false)

            // Close modal after brief delay to show success
            setTimeout(() => {
                closeModal()
            }, 1000)

        } catch (err){
            console.log(err)
            setLogPending(false)
            setSaveSuccess(false)
        }
    }



    return (
        <Modal transparent={true} visible={oid !== null} animationType="slide">
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
             <PrimaryButton
                style={{
                    width:"100%",
                    opacity: (!reviewState || logPending) ? .5 : 1,
                    backgroundColor: saveSuccess ? '#10B981' : "black"
                }}
                disabled={(!reviewState || logPending)}
                name={logPending ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
                onPress={handleSave}
             />
             <ThemedButton style={{width:"100%",backgroundColor:"white",borderWidth:1,borderColor:colors.primary}} disabled={logPending} onPress={closeModal}>
                <ThemedText style={{color:colors.primary}}>Close</ThemedText>
             </ThemedButton>
             </View>

        </ThemedView>
        </ThemedView>
        </Modal>
    )



    // const {result}:{ result:ResultData } = useLocalSearchParams()


}
const styles = StyleSheet.create({
    overlay: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
    },
    modalView: {
        width: '100%',
        maxWidth: 500,
        maxHeight: screenHeight * 0.8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
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
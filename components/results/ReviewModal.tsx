import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet } from "react-native";
import { Spacer, ThemedText, ThemedView } from "../ui";
interface ReviewModalProps {
    result:ResultData|null; 
    closeModal:()=>void;
}
const {width:screenWidth, height:screenHeight} = Dimensions.get("window")

export default function ReviewModal({result,closeModal}:ReviewModalProps){
    const [orderTime, setOrderTime] = useState<number|null>(null)
    const [logPending, setLogPending] = useState(false)

    const { logHistory } = useUser()

    const { colors } = useTheme()

    useEffect(() => {
        if (result){
            setOrderTime(Date.now())
            console.log("date recorded")
        }
    }, [result])

    // const reviewHandler = (rev?:Review) => {
    //     if (!result || !orderTime){
    //         return
    //     }
    //     logHistory(result.id, result.name, orderTime, rev)
    // }

    // const deceHandler = () => {
    //     if (!result || !orderTime){
    //         return
    //     }
    //     logHistory(result.id, result.name, orderTime, "Pretty dece!")
    // }
    // const ehHandler = () => {
    //     if (!result || !orderTime){
    //         return
    //     }
    //     logHistory(result.id, result.name, orderTime, "Eh.")
    // }
    // const skipHandler = async () => {
    //     if (!result || !orderTime){
    //         return
    //     }
    //     const {errMessage} = await logHistory(result.id, result.name, orderTime)

        
    // }
    const reviewHandler = async (rev?:Review) =>{
        if (!result || !orderTime || logPending){
            return
        }
        setLogPending(true)
        try {
            const {errMessage} = await logHistory(result.id, result.name, orderTime, rev)
            if (errMessage !== null){
                throw Error(errMessage)
            }
            closeModal()
        } catch (e){
            console.log(e)
        } finally {
            setLogPending(false)
        }

    }

    return (
        <Modal 
            transparent={true}
            visible={result !== null}
            >
                {result && <ThemedView style={styles.container}>
                    <ThemedView style={[styles.modalView, {backgroundColor: 'rgba(13,13,13,1)', borderColor:colors.text, borderWidth:2}]}>
                        <ThemedText variant="medium">How was {result.name}?</ThemedText>
                        <Spacer height={20} />
                        <ThemedView style={{width: "100%", justifyContent:"center", gap: 8, alignItems: "center"}}>
                            {/* <PrimaryButton style={{width: "40%", borderRadius:10, backgroundColor:'rgba(255,255,255,.2)'}} onPress={() => reviewHandler("Pretty dece!")} name="Pretty dece!" /> */}
                            <Pressable style={styles.presserStyle} onPress={() => reviewHandler("Pretty dece!")}>
                                <Spacer width={16} height={1} />
                                <ThemedText>Pretty dece!</ThemedText>
                                
                                <Ionicons size={20} color="green" name="thumbs-up-sharp" />
                            </Pressable>
                            <Pressable style={styles.presserStyle} onPress={() => reviewHandler("Eh.")}>
                                <Spacer width={16} height={1} />
                                
                                <ThemedText>Eh.</ThemedText>
                                
                                
                                <Ionicons size={20} color="#fc0325" name="thumbs-down-sharp" />
                            </Pressable>
                        </ThemedView>
                        <Spacer height={20} />
                        <ThemedView>
                            <Pressable onPress={() => reviewHandler()}>
                                <ThemedText style={{textDecorationLine: "underline"}}>skip</ThemedText>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>}

            

        </Modal>
            
    )

}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      presserStyle: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'rgba(255,255,255,.2)',
        width:"60%",
        alignItems:"center",
        
        borderRadius:10,
        padding:10
      }
})
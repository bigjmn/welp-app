import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Dimensions, Modal, StyleSheet } from "react-native";
import { PrimaryButton, ThemedButton, ThemedText, ThemedView } from "../ui";
interface ReviewModalProps {
    result:ResultData|null; 
    closeModal:()=>void;
}
const {width:screenWidth, height:screenHeight} = Dimensions.get("window")

export default function ReviewModal({result,closeModal}:ReviewModalProps){
    const [orderTime, setOrderTime] = useState<number|null>(null)
    const [logPending, setLogPending] = useState(false)

    const { logHistory } = useUser()

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
                    <ThemedView style={styles.modalView}>
                        <ThemedText>How was {result.name}?</ThemedText>
                        <ThemedView style={{flexDirection: "row", width: "80%", justifyContent:"center", gap: 5, alignItems: "center"}}>
                            <PrimaryButton style={{width: "40%"}} onPress={() => reviewHandler("Pretty dece!")} name="Pretty dece!" />
                            <PrimaryButton style={{width: "40%"}} onPress={() => reviewHandler("Eh.")} name="Eh..." />
                        </ThemedView>
                        <ThemedView>
                            <ThemedButton onPress={() => reviewHandler()}>
                                <ThemedText style={{textDecorationLine: "underline"}}>skip</ThemedText>
                            </ThemedButton>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
})
import { useState } from "react";
import { Dimensions, Modal, StyleSheet } from "react-native";
import { PrimaryButton, ThemedButton, ThemedText, ThemedView } from "../ui";

const {width:screenWidth, height:screenHeight} = Dimensions.get("window")

export default function ReviewModal(){
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const deceHandler = () => {
        console.log("dece")
    }
    const ehHandler = () => {
        console.log("eh")
    }
    const skipHandler = () => {
        console.log('skip')
    }

    return (
        <Modal 
            transparent={true}
            visible={isOpen}
            >
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.modalView}>
                        <ThemedText>How was it?</ThemedText>
                        <ThemedView style={{flexDirection: "row", width: "80%", justifyContent:"center", gap: 5, alignItems: "center"}}>
                            <PrimaryButton style={{width: "40%"}} onPress={deceHandler} name="Pretty dece!" />
                            <PrimaryButton style={{width: "40%"}} onPress={ehHandler} name="Eh..." />
                        </ThemedView>
                        <ThemedView>
                            <ThemedButton onPress={skipHandler}>
                                <ThemedText style={{textDecorationLine: "underline"}}>skip</ThemedText>
                            </ThemedButton>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

            

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
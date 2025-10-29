import { Dimensions, Modal, StyleSheet } from "react-native";
import { PrimaryButton, ThemedView } from "../ui";
import SearchDetailForm from "./SearchDetailForm";
const {width:screenWidth, height:screenHeight} = Dimensions.get("window")

interface SearchModalProps {
    isOpen:boolean;
    handleClose:()=>void
}
export default function SearchModal({isOpen, handleClose}:SearchModalProps){
    

    return (
        <Modal transparent={true} visible={isOpen}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.modalView}>
                    <SearchDetailForm />
                    <PrimaryButton name="close" onPress={handleClose} />

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
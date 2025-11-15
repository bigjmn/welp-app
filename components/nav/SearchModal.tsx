import { Dimensions, Modal, StyleSheet } from "react-native";
import { PrimaryButton, ThemedText, ThemedView } from "../ui";
import SearchDetailForm from "./SearchDetailForm";
import { useUser } from "@/hooks/useUser";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SearchModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

export default function SearchModal({ isOpen, handleClose }: SearchModalProps) {
    const { usingCurrLocation, searchLocation } = useUser();

    // Disable button if not using current location and no search location is set
    const isDisabled = !usingCurrLocation && !searchLocation;

    return (
        <Modal transparent={true} visible={isOpen} animationType="fade">
            <ThemedView style={styles.overlay}>
                <ThemedView style={styles.modalView}>
                    <ThemedView style={styles.header}>
                        <ThemedText style={styles.title}>Search Options</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.content}>
                        <SearchDetailForm />
                    </ThemedView>

                    <ThemedView style={styles.footer}>
                        <PrimaryButton
                            name="Apply"
                            onPress={handleClose}
                            style={styles.button}
                            disabled={isDisabled}
                        />
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
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
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128, 128, 128, 0.2)',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    content: {
        padding: 24,
        paddingBottom: 16,
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
    },
    button: {
        width: '100%',
    },
});
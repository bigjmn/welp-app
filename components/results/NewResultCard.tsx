import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { ScrollView, StyleSheet } from "react-native";
import { PrimaryChip, ThemedText, ThemedView } from "../ui";
import OpenUberButton from "./OpenUberButton";
interface ResultDataProps {
    result: ResultData;
    serviceType: ServiceType
}

export default function NewResultCard({ result, serviceType }:ResultDataProps){
    const { name, displayAddress, displayPhone, categories, imageUrl } = result
    const { colors } = useTheme()
    
    return (
        <ThemedView style={[styles.container, {backgroundColor: colors.uiBackground}]}>
            <Image style={styles.image} source={imageUrl} contentFit="cover" />
            <ThemedView style={styles.content}>
                <ThemedView style={styles.nameHolder}>
                    <ThemedText style={styles.resName} variant="strong">{name}</ThemedText>

                </ThemedView>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesHolder}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((rescat, i) => (
                        <PrimaryChip
                            name={rescat}
                            key={i}
                        />
                    ))}
                </ScrollView>
                <ThemedView style={styles.phoneHolder}>
                    <ThemedText variant="soft">Phone</ThemedText>
                    <ThemedText>{displayPhone}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.addressHolder}>
                    <ThemedText variant="soft">Address</ThemedText>
                    <ThemedText>{displayAddress}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.uberButtonHolder}>
                    <OpenUberButton result={result} />
                </ThemedView>

            </ThemedView>
        </ThemedView>
    )



}

const styles =StyleSheet.create({
    container: {
        width: 360,
        borderRadius:12,
        elevation:12,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        borderWidth: 1,
        borderColor: 'rgba(187,134,252,0.2)',

    },
    image: {
        width: "100%",
        height:220,
        borderTopLeftRadius:12,
        borderTopRightRadius:12

    },

    content: {
        padding:20,
        gap:14,
        width:"100%",
        backgroundColor: "transparent"

    },
    label: {
        
    },
    nameHolder: {
        width:"100%",
        backgroundColor: "transparent"

    },
    resName: {
        width:"100%",
        backgroundColor: "transparent"

    },
    categoriesHolder: {
        width: "100%",
        flexGrow: 0,
    },
    categoriesContent: {
        flexDirection: "row",
        gap: 8,
        paddingRight: 20,
    },
    phoneHolder: {
        width:"100%",
        backgroundColor: "transparent"
    },
    addressHolder: {
        width:"100%",
        backgroundColor: "transparent"
    },

    uberButtonHolder: {
        width:"100%",
        backgroundColor: "transparent"
    }
})
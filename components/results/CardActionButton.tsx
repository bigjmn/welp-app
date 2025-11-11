import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import { PrimaryButton, ThemedView } from "../ui";
import OpenUberButton from "./OpenUberButton";
interface CardActionButtonProps {
    result:ResultData; 
    serviceType:ServiceType;
}
export default function CardActionButton({result, serviceType}:CardActionButtonProps){
    return (
        <ThemedView style={styles.container}>
            {serviceType === "Delivery" ? (
                <OrderOnlineButton result={result} />
            ) : (
                <OpenUberButton result={result} />
            )}
        </ThemedView>
    )
    

}

function OrderOnlineButton({result}:{result:ResultData}){
    const { id } = result 
    const orderUrl = `https://www.yelp.com/biz/${id}?show_platform_modal=True`

    return (
        <PrimaryButton name="Order Online" onPress={() => Linking.openURL(orderUrl)} />
    )
}

const styles = StyleSheet.create({
    container: {
        width:"60%",
        alignSelf: "center"
    }
})
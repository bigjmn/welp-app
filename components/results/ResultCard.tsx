import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import Animated, {
    PinwheelIn
} from 'react-native-reanimated';
import { ThemedText, ThemedView } from "../ui";

export const ResultCard = ({result}: ResultCardProps) => {
    const { name, imageUrl, displayAddress} = result
    

    // return (
    //     <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, maxWidth: 350 }}>
    //         <img
    //             src={imageUrl}
    //             alt={name}
    //             style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
    //         />
    //         <h2 style={{ margin: '16px 0 8px 0' }}>{name}</h2>
    //         <p style={{ color: '#555' }}>{displayAddress}</p>
    //     </div>
    // )
    return (
        <ThemedView style={styles.container}>
            <Animated.View entering={PinwheelIn}>

            
            <Image 
                style={styles.image} 
                source={imageUrl} 
                contentFit="cover"
            />
            <ThemedText>{name}</ThemedText>
            <ThemedText>{displayAddress}</ThemedText>
            </Animated.View>

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 550
    },
    image: {
        flex:1,
        
        width: "100%"
    }
})
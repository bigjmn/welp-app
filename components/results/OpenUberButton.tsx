import { ucapi } from '@/constants/apitest';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/hooks/useUser';
import analytics from '@react-native-firebase/analytics';
import * as Linking from 'expo-linking';
import { Pressable } from 'react-native';
import { ThemedText, ThemedView } from '../ui';
const uberButtonBlack = require("@/assets/uberbuttonblack.png")
export default function OpenUberButton({result}:ResultCardProps){
    const { user } = useUser()

    const { theme } = useTheme()
    const { name, latitude, longitude } = result 


    const [bgColor, textColor] = (theme === "light") ? ["black", "white"] : ["white", "black"]

    

    const clientId = ucapi
    const url = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${name}&client_id=${clientId}`;


    const getUber = async () => {
        console.log('Opening Uber with URL:', url);
        await analytics().logEvent('uber_api_used', {userid: user?.id})

        try {
            // Try to open the Uber app directly
            const canOpen = await Linking.canOpenURL(url);
            console.log('Can open URL:', canOpen);

            if (canOpen) {
                await Linking.openURL(url);
                console.log('Successfully opened Uber app');
            } else {
                // Fallback to Uber website
                console.log('Uber app not available, opening website');
                const webUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodeURIComponent(name)}`;
                await Linking.openURL(webUrl);
            }
        } catch (error) {
            console.error('Error opening Uber:', error);
            // Last resort - try website
            const webUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodeURIComponent(name)}`;
            await Linking.openURL(webUrl);
        }
    }
    return (
        <Pressable onPress={getUber} style={{borderRadius:8,height:56,alignItems:"center",justifyContent:"center", backgroundColor:"black"}}>
            <ThemedText style={{color:"white"}} variant="uber">Open with Uber</ThemedText>
        </Pressable>
    )

    
}


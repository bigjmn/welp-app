import { useTheme } from '@/hooks/useTheme';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { TouchableOpacity } from 'react-native';
const uberButtonBlack = require("@/assets/uberbuttonblack.png")
export default function OpenUberButton({result}:ResultCardProps){

    const { theme } = useTheme()
    const { name, latitude, longitude } = result 

    const [bgColor, textColor] = (theme === "light") ? ["black", "white"] : ["white", "black"]

    

    const clientId = process.env.EXPO_PUBLIC_UBER_CLIENT
    const url = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${name}&client_id=${clientId}`;


    const getUber = async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Uber app is not installed. You can fallback to the mobile website or App Store.");
            // Optional: Fallback to the mobile website or App Store link
        }
    }

    return (
        <TouchableOpacity onPress={getUber} style={{ display:"flex", flexDirection:"row", padding:4, alignItems:"center"}}>
            {/* <Text style={{color:textColor}}>Open </Text> */}
            <Image source={uberButtonBlack} contentFit='contain' style={{width:"100%", height:40}} />
        </TouchableOpacity>
    )
}

    // const pickupLat = 40.71224398712733
    // const pickupLng = -73.95307549029094
    // const dropoffLat = 40.67549009386981 
    // const dropoffLng = -73.96095113262129
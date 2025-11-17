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

    

    const clientId = process.env.EXPO_PUBLIC_UBER_CLIENT
    const url = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${name}&client_id=${clientId}`;


    const getUber = async () => {
        await analytics().logEvent('uber_api_used', {userid: user?.id})
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Uber app is not installed. You can fallback to the mobile website or App Store.");
            // Optional: Fallback to the mobile website or App Store link
        }
    }
    return (
        <Pressable onPress={getUber}>
            <ThemedView style={{borderRadius:8,height:56,alignItems:"center",justifyContent:"center", backgroundColor:"black"}}>
                <ThemedText style={{color:"white"}} variant="uber">Open with Uber</ThemedText>
            </ThemedView>
        </Pressable>
    )

    // return (
    //     <TouchableOpacity onPress={getUber} style={{ display:"flex", flexDirection:"row", padding:4, alignItems:"center"}}>
    //         {/* <Text style={{color:textColor}}>Open </Text> */}
            
    //         <Image source={uberButtonBlack} contentFit='contain' style={{width:"100%", height:40}} />
    //     </TouchableOpacity>
    // )
}

    // const pickupLat = 40.71224398712733
    // const pickupLng = -73.95307549029094
    // const dropoffLat = 40.67549009386981 
    // const dropoffLng = -73.96095113262129
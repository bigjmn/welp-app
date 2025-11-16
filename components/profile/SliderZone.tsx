import { usePrefs } from "@/hooks/usePrefs";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "@rneui/base";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Spacer, ThemedText, ThemedView } from "../ui";
const ADVENTURE_LEVELS = [
    "Do I look like Magellan to you?",
    "My middle name is 'Cautious'",
    "normal",
    "My middle name is 'Danger.' Also my last name.",
    "Never establish a pattern. That's how they find you."
]

const PRICE_LEVELS = [
    "I bought Gamestop at the worst possible time",
    "You think I'm made of money?",
    "normal",
    "I'm not afraid to splash the cash",
    "I don't want to see any plebs"
]

export default function SliderZone(){
    const { colors } = useTheme()
    const { preferUnseen, updatePreferUnseen, preferCheap, updatePreferCheap } = usePrefs()
    const [adventureVal, setAdventureVal] = useState(2)

    const handleUnseenChange = (vc:number) => {
        if (vc === preferUnseen) return;
        console.log('changing unseen pref')
        console.log(vc)
        updatePreferUnseen(vc)
    }

    const handlePricerChange = (pc:number) => {
        if (pc === preferCheap) return;
        console.log("changing price pref 2")
        updatePreferCheap(pc)
    }

    return (
        <ThemedView style={styles.container}>
            
            {/* Adventure preference slider */}
            <View style={[styles.sliderHolder]}>
                <View style={styles.sliderType}>
                    <Ionicons size={22} color={colors.iconColor} name="telescope-sharp" />
                    <Spacer width={20} />
                    <View style={styles.descriptHolder}>
                        <ThemedText variant="medium">Adventure preference</ThemedText>
                        <ThemedText>Preference for new things vs. old favorites</ThemedText>
                    </View>
                </View>
                
            <View style={styles.slider}>
                <Slider 
                    style={{width:"60%"}}
                    value={preferUnseen}
                    onValueChange={handleUnseenChange}

                    maximumValue={4}
                    minimumValue={0}
                    step={1}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.primary}
                    trackStyle={{ height: 5 }}
                    thumbStyle={{height: 20, width: 20, borderRadius:"50%", backgroundColor: "black", borderWidth:1,borderColor:colors.primary }}
                    
                    // thumbProps={{
                    //     children: (
                    //         <Icon
                    //         name="heartbeat"
                    //         type="font-awesome"
                    //         size={20}
                    //         reverse
                    //         containerStyle={{ bottom: 20, right: 20 }}
                    //         color="green"
                    //         />
                    //     ),
                    // }}
                />
                <Spacer height={2} />
            
            <View style={styles.commentContainer}>
                <ThemedText
                    variant="italic"
                    style={styles.commentText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {ADVENTURE_LEVELS[preferUnseen]}
                </ThemedText>
            </View>
            </View>
            
            </View>

            {/* Price preference slider */}
            <Spacer height={10} />
            <ThemedView style={styles.sliderHolder}>
                <ThemedView style={styles.sliderType}>
                    <Ionicons size={22} color={colors.iconColor} name="pricetags-sharp" />
                    <Spacer width={20} />
                    <ThemedView style={styles.descriptHolder}>
                        <ThemedText variant="medium">Pricing preference</ThemedText>
                        <ThemedText>Preference for inexpensive vs fancy</ThemedText>
                    </ThemedView>
                </ThemedView>
            <ThemedView style={styles.slider}>
            <Slider 
                style={{width:"60%"}}
                value={preferCheap}
                onValueChange={handlePricerChange}

                maximumValue={4}
                minimumValue={0}
                step={1}
                minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.primary}
                trackStyle={{ height: 5 }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: "black", borderWidth:1,borderColor:colors.primary }}
                
                // thumbProps={{
                //     children: (
                //         <Icon
                //         name="heartbeat"
                //         type="font-awesome"
                //         size={20}
                //         reverse
                //         containerStyle={{ bottom: 20, right: 20 }}
                //         color="green"
                //         />
                //     ),
                // }}
            />
            
            
            </ThemedView>
            {/* <Spacer height={2} /> */}
            <View style={styles.commentContainer}>
                <ThemedText
                    variant="italic"
                    style={styles.commentText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {PRICE_LEVELS[preferCheap]}
                </ThemedText>
            </View>
            </ThemedView>
        </ThemedView>
    )
}

function PrefSlider(){

}

const styles = StyleSheet.create({
    container: {
        alignItems:"center",
        width:"100%"

    },
    slider: {
        width:"100%",
        alignItems:'center'
    },
    sliderType: {
        width: "100%",
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    sliderHolder: {
        width:"100%",
        alignItems:"center",
        padding:5
    },
    descriptHolder:{

    },
    commentContainer: {
        width: "100%",
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentText: {
        
        paddingHorizontal: 4,
    }
})
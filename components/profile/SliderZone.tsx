import { Slider } from "@rneui/base";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Spacer, ThemedText, ThemedView } from "../ui";

const ADVENTURE_LEVELS = [
    "Least adventurous",
    "Adventure value one",
    "normal",
    "hell yeah baby",
    "adventure level 5"
]

export default function SliderZone(){
    const [adventureVal, setAdventureVal] = useState(2)

    const handleValueChange = (vc:number) => {
        console.log(vc)
        setAdventureVal(vc)
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText>{ADVENTURE_LEVELS[adventureVal]}</ThemedText>
            <Spacer height={10} />
            <ThemedView style={styles.slider}>
            <Slider 
                style={{width:"100%"}}
                value={adventureVal}
                onValueChange={handleValueChange}

                maximumValue={4}
                minimumValue={0}
                step={1}
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'blue' }}
                
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
            <ThemedView style={{display:'flex',flexDirection:'row',justifyContent:'space-between', width:"100%", height:4}}>
                <ThemedView style={{width:4, backgroundColor:"green"}} />
                <ThemedView style={{width:4, backgroundColor:"green"}} />
                <ThemedView style={{width:4, backgroundColor:"green"}} />
                <ThemedView style={{width:4, backgroundColor:"green"}} />
                <ThemedView style={{width:4, backgroundColor:"green"}} />
            </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

function PrefSlider(){

}

const styles = StyleSheet.create({
    container: {
        alignItems:"center"

    },
    slider: {
        width:"60%"
    }
})
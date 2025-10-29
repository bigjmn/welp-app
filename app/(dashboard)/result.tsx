import PlaceCard from "@/components/results/CardFlip";
import { PrimaryButton, Spacer, ThemedText, ThemedView } from "@/components/ui";
import { useWelpSearch } from "@/hooks/useWelpSearch";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
// interface ResultProps {
//     route: RouteParams
// }
export default function Result(){
    const [result, setResult] = useState<ResultData|null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { serviceType, searchInput }:{serviceType:ServiceType,searchInput:string} = useLocalSearchParams()
    const { getResults } = useWelpSearch()

    useEffect(() => {
        getResults(serviceType, searchInput)
        .then((resultOb) => {
            if (resultOb.errMessage !== null){
                throw Error(resultOb.errMessage)
            }
            setResult(resultOb.resultList[0])
        }).catch((e) => console.log(e))
        .finally(() => {
            setIsLoading(false)
        })
    })
    const handleReject = () => {
        console.log('rejection handler')
    }
    const handleAccept = () => {
        console.log('accept handler')
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Welp, you're getting...</ThemedText>
            {isLoading ? (<ThemedText>Loading...</ThemedText>) : result ? (<PlaceCard result={result} />) : (<ThemedText>Nothing!</ThemedText>)}
            <Spacer />
            <PrimaryButton style={styles.button} name="Welp, I tried it..." onPress={handleAccept} />
            <PrimaryButton style={styles.button} name="No welping way" onPress={handleReject} />
        </ThemedView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    button: {
        width: "60%"
    }
})
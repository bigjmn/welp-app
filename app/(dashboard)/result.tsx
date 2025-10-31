import PlaceCard from "@/components/results/CardFlip";
import { PrimaryButton, Spacer, ThemedText, ThemedView } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { useWelpSearch } from "@/hooks/useWelpSearch";
import { shufflePrefs } from "@/utils/randomizers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
// interface ResultProps {
//     route: RouteParams
// }
export default function Result(){
    const [result, setResult] = useState<ResultData|null>(null)
    const [weightedResults, setWeightedResults] = useState<ResultData[]|null>(null)
    const [resultIdx, setResultIdx] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const { serviceType, searchInput }:{serviceType:ServiceType,searchInput:string} = useLocalSearchParams()
    const { getResults } = useWelpSearch()
    const { user } = useUser()

    useEffect(() => {
        if (!user){
            return
        }
        const {preferUnseen, orderHistory} = user
        getResults(serviceType, searchInput)
        .then((resultOb) => {
            if (resultOb.errMessage !== null){
                throw Error(resultOb.errMessage)
            }
            const shuffledResults = shufflePrefs(orderHistory, resultOb.resultList, preferUnseen)
            setWeightedResults(shuffledResults)
        }).catch((e) => console.log(e))
        .finally(() => {
            setIsLoading(false)
        })
    }, [])
    const handleReject = () => {
        console.log('rejection handler')
    }
    const handleAccept = () => {
        console.log('accept handler')
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Welp, you're getting...</ThemedText>
            {isLoading ? (<ThemedText>Loading...</ThemedText>) : (weightedResults && weightedResults.length > resultIdx) ? (<PlaceCard result={weightedResults[resultIdx]} />) : (<ThemedText>Nothing!</ThemedText>)}
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
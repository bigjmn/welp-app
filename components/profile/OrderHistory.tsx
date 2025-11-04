import { useUser } from "@/hooks/useUser";
import { formatTimestamp } from "@/utils/formatters";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "../ui";
export default function OrderHistory(){
    const { user } = useUser()
    if (!user){
        return
    }
    const { orderHistory } = user 

    return (
        <ThemedView style={styles.container}>
            <FlatList 
                data={orderHistory}
                keyExtractor={(item) => `${item.timestamp}`}
                renderItem={({item}) => <HistoryTile orderDetail={item} />}
                
                />
        </ThemedView>

    )
}

function HistoryTile({orderDetail}:{orderDetail:HistoryItem}){
    const timestring = formatTimestamp(orderDetail.timestamp)

    return (
        <ThemedView style={styles.tileStyle}>
            <ThemedView style={styles.tileLeft}>
                <ThemedText>{timestring}</ThemedText>
                <ThemedText>{orderDetail.name}</ThemedText>
            </ThemedView>
            <ThemedView>
                {(orderDetail.review && orderDetail.review === "Pretty dece!") ? <ThemedText style={{color:"green"}}>Pretty dece!</ThemedText> : 
                (orderDetail.review && orderDetail.review === "Eh.") ? <ThemedText style={{color:"red"}}>Eh.</ThemedText> : null }
            </ThemedView>

        </ThemedView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    listStyle: {
        padding:2
    },
    tileStyle: {
        display:'flex',
        flexDirection:'row',
        width:"100%",
        justifyContent:'space-between',
        alignItems:'center'
    },
    tileLeft: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    }
})
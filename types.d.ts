type ServiceType = "Search"|"Restaurant"|"Bar"|"Delivery"
interface WelpService {
    name: ServiceType;
    isSelected: boolean;
}

interface ResultData {
    id: string;
    name: string; 
    imageUrl: string; 
    displayAddress: string; 
}

interface SearchResponse {
    resultList: ResultData[]|null,
    errMessage: string | null

}

type Review = "Pretty dece!" | "Eh."
interface HistoryItem {
    timestamp: number;
    name: string; 
    review?: Review; 



}
interface User {
    id: string; 
    preferUnseen: boolean 
    orderHistory: HistoryItem[]
}
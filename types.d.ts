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
    url: string; 
    rating: number;
    displayPhone: string;
    categories: string[]
}

interface SearchResponse {
    resultList: ResultData[]|null,
    errMessage: string | null

}
interface ResultCardProps {
    result: ResultData
}
interface Category {
    title: string;
    alias:string;
}
type Review = "Pretty dece!" | "Eh."
interface HistoryItem {
    id:string;
    timestamp: number;
    name: string; 
    review?: Review; 



}
interface User {
    id: string; 
    
    orderHistory: HistoryItem[]
}

interface ConfirmMessage {
    errMessage: string|null;
}

type TextVariant = "regular"|"tabText"|"header"|"promptText"|"title"|"dateText"|"voteAnswer"|"italicStyle"
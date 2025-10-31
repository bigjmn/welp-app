import { useUser } from "./useUser";
const endpointMap:Record<ServiceType,string> = {
    "Restaurant": "https://api.yelp.com/v3/businesses/search?",
    "Delivery": "https://api.yelp.com/v3/transactions/delivery/search",
    "Bar": "https://api.yelp.com/v3/businesses/search?categories=[bars]",
    "Search": "https://api.yelp.com/v3/businesses/search?"
}
const catMap = (cat:Category) => {
    return cat.title; 
}
const createSearch = (serviceType:ServiceType, latitude:number, longitude:number, searchtime:number|null, terms: string) => {
    const timing_string = searchtime === null ? "open_now=true" : `open_at=${searchtime}`
    if (serviceType === "Restaurant"){
        return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&${timing_string}&sort_by=best_match&limit=20`
    }
    if (serviceType === "Delivery"){
        return `https://api.yelp.com/v3/transactions/delivery/search?latitude=${latitude}&longitude=${longitude}&${timing_string}&sort_by=best_match&limit=20`
    }
    if (serviceType === "Bar"){
        return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=[bars]&${timing_string}&sort_by=best_match&limit=20`
    }
    if (serviceType === "Search"){
        let sTerm = ""
        if (terms !== ""){
            sTerm = "term="+ terms.replace(" ","%20")+"&"
        }
        return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&${sTerm}${timing_string}&sort_by=best_match&limit=20`
    }
    // This should never be reached! 
    console.log("problem!")
    return `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&${timing_string}&sort_by=best_match&limit=20`

}
export const useWelpSearch = () => {
    const apiKey = process.env.EXPO_PUBLIC_YELP_API

    const headers:Record<string, string> = {"accept": "application/json", "authorization": "Bearer "+apiKey};
    const { usingCurrLocation, location, searchLocation, usingNow, searchTime } = useUser()
    

    const getResults = async (serviceType:ServiceType, searchTerm:string) => {
        const latitude = (usingCurrLocation && location) ? location.coords.latitude : searchLocation!.latitude
        const longitude = (usingCurrLocation && location) ? location.coords.longitude : searchLocation!.longitude 
        const timingString = usingNow ? null : searchTime ? searchTime.valueOf() : null 
        const searchEndpoint = createSearch(serviceType, latitude, longitude, timingString, searchTerm)

        try {
            console.log("API CALL")
            const response = await fetch(searchEndpoint, {headers:headers})
            if (response.status >= 400){
                throw Error("Something bad happened!")
            }
            const responseOb = await response.json()
            const resultList:ResultData[] = responseOb["businesses"].map((b:Record<string,any>) => {
                const resultOb:ResultData = {
                    id: b["id"],
                    name: b["name"],
                    imageUrl: b["image_url"],
                    displayAddress: b["location"]["display_address"].join(),
                    url: b["url"],
                    rating: b["rating"],
                    displayPhone: b["display_phone"],
                    categories:b["categories"].map(catMap)


                }
                return resultOb
                
            })
            if (resultList.length === 0){
                throw Error("no results!")
            }
            return { resultList, errMessage: null }


        } catch (e) {
            let errMessage = "could not search!"
            if (e instanceof Error) {
                errMessage = e.message 
            }
            return { resultList: null, errMessage }
            
        }




    }

    return { getResults }
}
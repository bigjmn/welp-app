import Location from "expo-location";

const endpointMap:Record<ServiceType,string> = {
    "Restaurant": "https://api.yelp.com/v3/businesses/search?",
    "Delivery": "https://api.yelp.com/v3/transactions/delivery/search",
    "Bar": "https://api.yelp.com/v3/businesses/search?categories=[bars]",
    "Search": "https://api.yelp.com/v3/businesses/search?"
}
export const useWelpSearch = () => {
    const apiKey = "Jp4bwEQIE2AE0Ja0HHXBbnjhrjMF7b0rVczcj1BVt2Iri4L1fLRzirLGicnyqbLPlfo0M4fsW9G7qq5SbnQNWr8V0XN46WuY_fhVLMRP2TfhUwsscFb1VFeDKa7CYXYx"

    const headers:Record<string, string> = {"accept": "application/json", "authorization": "Bearer "+apiKey};
    const getResults = async (serviceType:ServiceType, location:Location.LocationObject) => {
        const searchEndpoint = endpointMap[serviceType] 
        const searchUrl = `${searchEndpoint}latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&sort_by=best_match&limit=20`

        try {
            const response = await fetch(searchUrl, {headers:headers})
            if (response.status >= 400){
                throw Error("Something bad happened!")
            }
            const responseOb = await response.json()
            const resultList = responseOb["businesses"].map((b:Record<string,any>) => {
                const resultOb:ResultData = {
                    id: b["id"],
                    name: b["name"],
                    imageUrl: b["image_url"],
                    displayAddress: b["location"]["display_address"].join()


                }
                return resultOb
                
            })
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
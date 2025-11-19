import { yapi } from '@/constants/apitest';
import { useState } from 'react';
export const useAiFetch = () => {
    const SUGGESTION_ENDPOINT = yapi
    
    const apiKey = process.env.EXPO_PUBLIC_YELP_API
    
    const headers:Record<string, string> = {"accept": "application/json", "authorization": "Bearer "+apiKey};

    const [errMessage, setErrMessage] = useState<string|null>(null)
    const [aiPending, setAiPending] = useState(false)

    const [aiResponse, setAiResponse] = useState<string|null>(null)

    const getItemSuggestion = async (rname:string, address:string) => {
        
        const reqData = {
            query: `What's something I would like from ${rname} at ${address}?`
        }
        setAiPending(true)
        setErrMessage(null)
        try {
            console.log("AI API CALL")
            const aiSuggestionRes = await fetch(SUGGESTION_ENDPOINT, {
            method: "POST",
            headers: headers, 
            body: JSON.stringify(reqData)
            })

            if (aiSuggestionRes.status >= 400){
                throw Error("something went wrong!")
                
            }

        } catch (err){
            setErrMessage("could not get suggestion, sorry!")
            console.log(err)
        } finally {
            setAiPending(false)
        }
    }



}
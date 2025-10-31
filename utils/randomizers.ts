import { customAlphabet } from "nanoid/non-secure";

interface ShuffleItem{
    id:string;
    weight:number;
}
const alphaNumber = "abcdefghijklmnopqrstuvwxyz123456789"

export const generateId = customAlphabet(alphaNumber, 6)



export const shufflePrefs = (orderHistory:HistoryItem[], resultList:ResultData[], preferNew:boolean = true) => {
      // Tunable knobs
  const PRIOR_DECAY = 0.9;              // base prior: 0.9^rank
  const GOOD_MULT = 1.6;                // multiplier for avg rating = 1
  const BAD_MULT  = 0.3;                // multiplier for avg rating = 0
  const SEEN_UNRATED_MULT = 0.7;        // seen but no ratings at all
  const UNSEEN_BOOST = 1.4;             // boost if preferNew and unseen
  const SEEN_PENALTY_PER_VISIT = 0.85;  // extra penalty per seen-occurrence when preferNew

  const agg = new Map()
  for (const h of orderHistory || []){
    const rec = agg.get(h.id) || {count:0, rated:0, good:0}
    rec.count+=1;
    if (h.review === "Pretty dece!") {
        rec.rated += 1
        rec.good += 1
    } else if (h.review === "Eh."){
        rec.rated += 1
    }
    agg.set(h.id, rec)
  }

  const baseWeights = resultList.map((_, i) => Math.pow(PRIOR_DECAY, i))

  const weights = resultList.map((resdata, i) => {
    let w = baseWeights[i]
    const rec = agg.get(resdata.id)
    const seen = !!rec

    if (rec && rec.rated > 0){
        const avg = rec.good/rec.rated; 
        const ratingMult = BAD_MULT+(GOOD_MULT-BAD_MULT)*avg 
        w*=ratingMult 
    } else if (seen){
        w*=SEEN_UNRATED_MULT
    }

    if (preferNew){
        if (!seen){
            w*=UNSEEN_BOOST
        } else {
            w*=Math.pow(SEEN_PENALTY_PER_VISIT, rec.count)
        }
    }
    return {resdata, weight:w}

  })
  const shuffled = weights.map(({resdata, weight}) => ({
    resdata, 
    key: Math.pow(Math.random(), 1/weight)
  }))
  .sort((a,b) => b.key - a.key)
  .map(({resdata}) => resdata)

  return shuffled

}
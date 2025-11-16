import { customAlphabet } from "nanoid/non-secure";

interface ShuffleItem{
    id:string;
    weight:number;
}
const alphaNumber = "abcdefghijklmnopqrstuvwxyz123456789"

export const generateId = customAlphabet(alphaNumber, 6)



export const shufflePrefs = (orderHistory:HistoryItem[], resultList:ResultData[], preferNew:number, pricePreference:number) => {
      // Tunable knobs
//   const PRIOR_DECAY = 0.9;              // base prior: 0.9^rank
//   const GOOD_MULT = 1.6;                // multiplier for avg rating = 1
//   const BAD_MULT  = 0.3;                // multiplier for avg rating = 0
//   const SEEN_UNRATED_MULT = 0.7;        // seen but no ratings at all
//   const UNSEEN_BOOST = 1.4;             // boost if preferNew and unseen
//   const SEEN_PENALTY_PER_VISIT = 0.85;  // extra penalty per seen-occurrence when preferNew
const PRIOR_DECAY = 0.9;               // base prior: 0.9^rank (sorted best→worst)

  // History multipliers
  const GOOD_MULT = 1.6;                 // when avg rating = 1 (all good)
  const BAD_MULT  = 0.3;                 // when avg rating = 0 (all bad)
  const SEEN_UNRATED_MULT = 0.75;        // seen but no rated visits

  // Novelty shaping (depend on preferNew 0..4 around neutral=2)
  const UNSEEN_BASE = 1.25;              // step size for unseen boost/penalty per level
  const UNSEEN_MIN  = 0.5;               // ensure unseen never drops below this (so unseen > bad)
  const SEEN_PENALTY_PER_VISIT = 0.85;   // base per-visit penalty for seen items
  const SEEN_PENALTY_EXP_STEP = 0.5;     // how much exponent changes per level from neutral

  // Price preference (small effect vs. history/novelty)
  const PRICE_BASE = 1.10;               // step base (kept mild)

    const noveltyLevel = Math.max(0, Math.min(4, Math.floor(preferNew))) - 2; // -2..+2
    const priceLevel   = Math.max(0, Math.min(4, Math.floor(pricePreference))) - 2;

  const agg = new Map()
  for (const h of orderHistory || []){
    const rec = agg.get(h.id) || {count:0, rated:0, good:0}
    rec.count+=1;
    if (h.review && h.review.rating === "Pretty dece!") {
        rec.rated += 1
        rec.good += 1
    } else if (h.review && h.review.rating === "Eh."){
        rec.rated += 1
    }
    agg.set(h.id, rec)
  }

  const baseWeights = resultList.map((_, i) => Math.pow(PRIOR_DECAY, i))

  const weights = resultList.map((resdata, i) => {
    let w = baseWeights[i]
    const rec = agg.get(resdata.id)
    const seen = !!rec
    const price = resdata.price ?? 2 



    if (rec && rec.rated > 0){
        const avg = rec.good/rec.rated; 
        const ratingMult = BAD_MULT+(GOOD_MULT-BAD_MULT)*avg 
        w*=ratingMult 
    } else if (seen){
        w*=SEEN_UNRATED_MULT
    }

    if (!seen) {
      // unseen boost/penalty around neutral; clamp so unseen never worse than BAD
      const factor = Math.max(UNSEEN_MIN, Math.pow(UNSEEN_BASE, noveltyLevel));
      w *= factor;
    } else {
      // penalize seen based on how many times it's been seen; exponent varies with noveltyLevel
      const exp = Math.max(0, 1 + noveltyLevel * SEEN_PENALTY_EXP_STEP); // at 0 → 0 penalty exponent
      if (exp > 0) {
        w *= Math.pow(Math.pow(SEEN_PENALTY_PER_VISIT, rec.count), exp);
      }
    }
    const pNorm = (price - 2.5)/1.5
    const priceMult = Math.pow(PRICE_BASE, priceLevel*pNorm)
    w*=priceMult 
    if (!Number.isFinite(w) || w<=0) w=1e-9;
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

interface CategoryInfo {
    label:string;
    catsearch:string;

}
export const CATEGORIES_DICT:Record<string,CategoryInfo> = {
    "chinese":{label:"Chinese",catsearch:"categories=chinese"},
    "diners":{label:"Diners", catsearch:"categories=diners"},
    "indian":{label:"Indian",catsearch:"categories=indian"},
    "italian":{label:"Italian",catsearch:"categories=italian"},
    "mediterranian":{label:"Mediterranian",catsearch:"categories=mediterranian"},
    "mexican":{label:"Mexican",catsearch:"categories=mexican"},
    "pizza":{label:"Pizza",catsearch:"categories=pizza"},
    "seafood":{label:"Seafood",catsearch:"categories=seafood"},
    "steak":{label:"Steakhouse/BBQ",catsearch:"categories=steak&categories=bbq"},
    "sushi":{label:"Sushi",catsearch:"categories=sushi"},
    "thai":{label:"Thai",catsearch:"categories=thai"},
    "vegetarian":{label:"Vegetarian",catsearch:"categories=vegetarian"}
}

export const createPrefDict = () => {
    const prefDict:Record<string,boolean> = {}
    Object.keys(CATEGORIES_DICT).forEach(k => {
        prefDict[k] = true;
    })
    return prefDict
}

export const createCatString = (pdict:Record<string,boolean>) => {
    const catStringParts = Object.entries(CATEGORIES_DICT).map(([k,v]) => {
        return pdict[k] ? v.catsearch : ""
    })
    const cstring = catStringParts.join("&")
    return cstring 
}
export const getLabel = (cval:string) => {
    return CATEGORIES_DICT[cval]
}
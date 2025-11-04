import moment from "moment";

export const formatTimestamp = (ts:number) => {
    return moment(new Date(ts)).format("MM/DD/YY")
}
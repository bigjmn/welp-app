
const uberlink="uber://riderequest?pickup[latitude]=37.775818&pickup[longitude]=-122.418028&pickup[nickname]=UberHQ&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=37.802374&dropoff[longitude]=-122.405818&dropoff[nickname]=Coit%20Tower&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383"

const createLink = (curr_lat:number,curr_long:number,curr_formatted:string,dest_lat:number,dest_long:number,dest_formatted:string) => {
    return `uber://riderequest?pickup[latitude]=${curr_lat}&pickup[longitude]=${curr_long}&pickup[formatted_address]=${curr_formatted}&dropoff[latitude]=${dest_lat}&dropoff[longitude]=${dest_long}&dropoff[formatted_address]=${dest_formatted}&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383`

}
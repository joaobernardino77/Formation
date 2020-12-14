import axios from 'axios'
import url from './URL'

async function scheduleUser({monday, tuesday, wednesday, thursday, friday, userToken}){
    const response = await axios.post(`${url}/schedules`,{
        monday,
        tuesday,
        wednesday,
        thursday,
        friday
    }, {
        headers: {
            Authorization: `Bearer ${userToken}`,
        }
    }).catch(error => console.log(error))

    return response
}

export default scheduleUser
import axios from "axios"
import { getParamsEnv } from "./getParamsEnv"

const {API_URL_BASE} = getParamsEnv()

export const resetClient = async (clientId, token) => {
  
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/clients/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response)
        return response.data
      } catch (error) {
        console.log(error)
      }
    }
  
      const client = await fetchClient()
  
  
    
    return {
   client
    }
  }
import {MainInstance} from './index'

export const getRoutes = async ()=>{
    try {
        const response = await MainInstance.get(
          `/routes_data`
        )
  
        if (!response.status) {
          throw new Error(response.message)
        }

        return {
          data: response.data,
          error: { status: false, message: '' },
        }
      } catch (error) {
        return { data: null, error: { status: true, message: error.message } }
      }
    }

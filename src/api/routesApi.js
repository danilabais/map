import {MainInstance} from './index'

export const getRoutes =async ()=>{
    // const  {data} = await MainInstance.get('routes_data?key=012345678abc')
    // console.log(data)
    return (JSON.parse( localStorage.getItem('data')))
    
}
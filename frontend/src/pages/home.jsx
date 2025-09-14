import React,{useState, Suspense} from 'react'
import LoginButton from '../components/Login'
import axios from 'axios'
import { APIURL } from '../../utils'
const Dashboard = React.lazy(() => import('../components/Dashboard'));

function Home() {
 const [data,setData]=useState(null)
   const handlegetData=async()=>{
    const response= await axios.get(`${APIURL}/test-bigquery`,
      {
        headers:{
          'Content-Type':'application/json'
        }
      },
      {withCredentials:true}
    )
    setData(response.data)
   }
  return (
    <>
    
	 <div className='bg-black text-white h-full w-full'>
    
         <Suspense fallback={<div className="text-center mt-10">Loading Dashboard...</div>}>
        <Dashboard />
      </Suspense>

  </div>

  </>  
)
}

export default Home
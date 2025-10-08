import React,{useState, Suspense} from 'react'
const EnergyPrediction = React.lazy(() => import('../components/EnergyPrediction'));

function PredictEnergy() {
  
  return (
    <>
    
	 <div className=' text-white  w-full'>
    

         <Suspense fallback={<div className="text-center mt-10">Loading Energy prediction ...</div>}>
        <div className='mt-20 p-4'>
           
        <EnergyPrediction />
        </div>
      </Suspense>

  </div>

  </>  
)
}

export default PredictEnergy
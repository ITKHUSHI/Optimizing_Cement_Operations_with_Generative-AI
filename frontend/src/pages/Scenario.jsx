import React from 'react'
import ScenarioSimulator from '../components/ScenarioSimulator'

function Scenario() {
  return (
	<>
		<div className='mt-20 p-4'>
			<h2 className='text-center text-3xl font-extrabold text-blue-500 pb-2 mb-2'>SCENARIO</h2>
            <p className="text-gray-700 pb-2">
              Enter the percentages for <strong>Alternative Fuel</strong> and <strong>Hydrogen Fuel</strong> below, then run the simulation to see AI-generated optimization recommendations.
            </p>
			<ScenarioSimulator/>
		</div>
	
	</>
  )
}

export default Scenario
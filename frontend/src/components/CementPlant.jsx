import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APIURL } from '../../utils';
import toast from 'react-hot-toast';

function CementPlant() {
  const [plantData, setPlantData] = useState(null);

  const storedPlantId = localStorage.getItem('plantId') ;
  const plant_id = JSON.parse(storedPlantId);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const res = await axios.get(`${APIURL}/api/cement/cement-plant/plant_id/${plant_id}`, {
          headers: { "Content-Type": "application/json" },
        });

        setPlantData(res.data.cementPlant);
      } catch (error) {
        toast.error('❌ Failed to fetch plant data:', error);
      }
    };

    fetchPlantData();
  }, [plant_id]);

  useEffect(() => {
    if (plantData) {
      localStorage.setItem('plantData', JSON.stringify(plantData));
    }
  }, [plantData]);

  if (!plantData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading plant data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Cement Plant Information</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Plant Name:</h2>
          <p className="text-gray-700">{plantData.plant_name}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Location:</h2>
          <p className="text-gray-700">{plantData.location}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Capacity (TPD):</h2>
          <p className="text-gray-700">{plantData.capacity_tpd}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Plant ID:</h2>
          <p className="text-gray-700">{plantData.plant_id}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Created At:</h2>
          <p className="text-gray-700">{new Date(plantData.created_at.value).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default CementPlant;

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { APIURL } from "../../utils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function MultiStepForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const country = watch("country");
  const state = watch("state");

  const handelRegisterPlant = (data) => {
   try {
     const res = axios.post(`${APIURL}/api/cement/register-cement-plant`,data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
       if (res.status === 201 || res.status === 200) {
              localStorage.setItem('plantId',JSON.stringify(res?.data?.plant?._id));   

             navigate("/cement-plant")
             toast.success("Cement Plant Registered Successfully")
        }
   } catch (error) {
    toast.error("Failed to register cement plant",error)
   }
  };

  const nextStep = async () => {
    const isStepValid = await trigger(); // validate current step
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Cement Plant Registration</h1>
      <form onSubmit={handleSubmit(handelRegisterPlant)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Plant Name *</label>
              <input
                {...register("plantName", { required: "Plant name is required" })}
                className="w-full border p-2 rounded"
                placeholder="Enter plant name"
              />
              {errors.plantName && (
                <p className="text-red-500 text-sm">{errors.plantName.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Organization Name *</label>
              <input
                {...register("organizationName", { required: "Organization name is required" })}
                className="w-full border p-2 rounded"
                placeholder="Enter organization name"
              />
              {errors.organizationName && (
                <p className="text-red-500 text-sm">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Organization Email *</label>
              <input
                type="email"
                {...register("organizationEmail", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                className="w-full border p-2 rounded"
                placeholder="Enter email"
              />
              {errors.organizationEmail && (
                <p className="text-red-500 text-sm">{errors.organizationEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Password *</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full border p-2 rounded"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Country *</label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={Country.getAllCountries().map((c) => ({
                      value: c.isoCode,
                      label: c.name,
                    }))}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">State *</label>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      country
                        ? State.getStatesOfCountry(country.value).map((s) => ({
                            value: s.isoCode,
                            label: s.name,
                          }))
                        : []
                    }
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">City *</label>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      country && state
                        ? City.getCitiesOfState(country.value, state.value).map((city) => ({
                            value: city.name,
                            label: city.name,
                          }))
                        : []
                    }
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Manager Info */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Manager Name</label>
              <input
                {...register("managerName")}
                className="w-full border p-2 rounded"
                placeholder="Enter manager name"
              />
            </div>

            <div>
              <label className="block font-medium">Manager Email</label>
              <input
                type="email"
                {...register("managerEmail")}
                className="w-full border p-2 rounded"
                placeholder="Enter manager email"
              />
            </div>

            <div>
              <label className="block font-medium">Manager Phone</label>
              <input
                {...register("managerPhone")}
                className="w-full border p-2 rounded"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        )} 

        {/* Step 4: Operational Details */}
{step === 4 && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Operational Details</h2>

    <input
      type="number"
      {...register("capacityTPD", { required: "Capacity is required" })}
      placeholder="Capacity (TPD)"
      className="w-full border p-2 rounded"
    />
    {errors.capacityTPD && (
      <p className="text-red-500 text-sm">{errors.capacityTPD.message}</p>
    )}

    <input
      type="number"
      {...register("kilnCount", { required: "Kiln count is required" })}
      placeholder="Kiln Count"
      className="w-full border p-2 rounded"
    />
    {errors.kilnCount && (
      <p className="text-red-500 text-sm">{errors.kilnCount.message}</p>
    )}

    <select
      {...register("kilnType", { required: "Kiln type is required" })}
      className="w-full border p-2 rounded"
    >
      <option value="dry">Dry</option>
      <option value="wet">Wet</option>
      <option value="preheater">Preheater</option>
      <option value="precalciner">Precalciner</option>
    </select>
    {errors.kilnType && (
      <p className="text-red-500 text-sm">{errors.kilnType.message}</p>
    )}

    <input
      type="number"
      {...register("productionLines")}
      placeholder="Production Lines"
      className="w-full border p-2 rounded"
    />

    <select
      {...register("primaryFuel")}
      className="w-full border p-2 rounded"
    >
      <option value="">Select Primary Fuel</option>
      <option value="coal">Coal</option>
      <option value="petcoke">Petcoke</option>
      <option value="natural_gas">Natural Gas</option>
      <option value="alt_fuels">Alternative Fuels</option>
      <option value="other">Other</option>
    </select>

    <label className="block font-medium">Alternative Fuels</label>
    <div className="flex gap-4">
      {["RDF", "Biomass", "Tires", "Hydrogen", "Other"].map((fuel) => (
        <label key={fuel} className="flex items-center gap-1">
          <input
            type="checkbox"
            value={fuel.toLowerCase()}
            {...register("alternativeFuels")}
          />
          {fuel}
        </label>
      ))}
    </div>
  </div>
)}

     {/* Step 5: Energy & Environment */}
     {step === 5 && (
       <div className="space-y-4">
         <h2 className="text-xl font-semibold">Energy & Environment</h2>
     
         <input
           type="number"
           {...register("powerCapacityMW", { required: "Power capacity required" })}
           placeholder="Power Capacity (MW)"
           className="w-full border p-2 rounded"
         />
         {errors.powerCapacityMW && (
           <p className="text-red-500 text-sm">{errors.powerCapacityMW.message}</p>
         )}
     
         <input
           type="number"
           {...register("tsr")}
           placeholder="TSR (%)"
           className="w-full border p-2 rounded"
         />
     
         <input
           type="number"
           {...register("co2Baseline")}
           placeholder="CO₂ Baseline (kg/ton clinker)"
           className="w-full border p-2 rounded"
         />
     
         <input
           type="number"
           {...register("energyBaseline")}
           placeholder="Energy Baseline (kWh/ton cement)"
           className="w-full border p-2 rounded"
         />
       </div>
     )}
     
     {/* Step 6: Extra Details */}
     {step === 6 && (
       <div className="space-y-4">
         <h2 className="text-xl font-semibold">Extra Details</h2>
     
         <input
           type="number"
           {...register("rawMaterialQuality.limestoneGrade")}
           placeholder="Limestone Grade (% CaCO₃)"
           className="w-full border p-2 rounded"
         />
     
         <input
           type="text"
           {...register("constraints")}
           placeholder="Constraints / Regulations"
           className="w-full border p-2 rounded"
         />
     
         <input
           type="number"
           {...register("yearCommissioned")}
           placeholder="Year Commissioned"
           className="w-full border p-2 rounded"
         />
       </div>
     )}


        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Back
            </button>
          )}
          {step < 6 && (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
          {step === 6 && (
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

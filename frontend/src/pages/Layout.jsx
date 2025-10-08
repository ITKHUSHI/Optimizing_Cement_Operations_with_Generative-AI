// LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cement Plant Optimization with Generative AI
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Unlock actionable insights, optimize energy consumption, enhance fuel efficiency, and maximize operational stability for JK Cement plants using AI-driven predictions.
            </p>
            <div className="flex gap-4">
              <a
                href="#features"
                className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Explore Features
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://www.jkcement.com/wp-content/uploads/2023/07/panna-plant1-jpg.webp"
              alt="Cement Plant AI Optimization"
			  
              className="rounded-xl shadow-lg h-128 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Reduce Specific Power Consumption</h3>
            <p className="text-gray-600">
              Lower SPC across Pyro process and Grinding System through AI-optimized operations.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Maximize Alternative Fuel Use</h3>
            <p className="text-gray-600">
              Increase Thermal Substitution Rate (TSR) by intelligently managing fuel combinations.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Ensure Consistent Quality</h3>
            <p className="text-gray-600">
              Maintain clinker and cement quality via predictive analytics and real-time monitoring.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Enhance Operational Stability</h3>
            <p className="text-gray-600">
              Reduce variability, prevent downtime, and improve process resilience through AI control.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Optimize Fuel Efficiency</h3>
            <p className="text-gray-600">
              Minimize energy consumption in utilities and grinding, reducing costs and environmental impact.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">
              Fuse siloed plant data into actionable insights for strategic decision-making and continuous improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto text-center px-6 lg:px-0">
          <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
          <p className="text-gray-700 mb-6">
            We leverage Generative AI and predictive analytics to provide precise, plant-specific recommendations. Each insight is personalized based on location, raw material quality, and operational conditions to maximize efficiency and sustainability.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <li className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Predict & Optimize</h3>
              <p className="text-gray-600">Forecast energy consumption and adjust processes for minimal power usage.</p>
            </li>
            <li className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">AI-Driven Recommendations</h3>
              <p className="text-gray-600">Provide actionable guidance for grinding, kiln operation, and alternative fuel usage.</p>
            </li>
            <li className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Continuous Improvement</h3>
              <p className="text-gray-600">Integrate real-time feedback to refine strategies and maintain consistent quality.</p>
            </li>
          </ul>
        </div>
      </section>

     
    </div>
  );
}


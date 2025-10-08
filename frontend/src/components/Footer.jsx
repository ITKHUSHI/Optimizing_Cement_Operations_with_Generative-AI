import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">SmartCemAi</h3>
          <p className="text-gray-600 text-sm">
            A cutting-edge platform for cement plant optimization, energy efficiency, and CO₂ reduction. Our AI-powered tools help plants achieve operational excellence and sustainability.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Quick Links</h3>
          <ul className="text-gray-700 space-y-2">
            <li>
              <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link>
            </li>
            <li>
              <Link to="/pridict-energy" className="hover:text-blue-500 transition-colors">Energy OPT</Link>
            </li>
            <li>
              <Link to="/scenario" className="hover:text-blue-500 transition-colors">Scenario</Link>
            </li>
            <li>
              <Link to="/cement-plant" className="hover:text-blue-500 transition-colors">Cement Plant</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Contact</h3>
          <p className="text-gray-700 text-sm">Email: <a href="mailto:khushee0225@gmail.com" target="_blank" className="text-blue-500 hover:underline">khushee0225@gmail.com</a> </p>
          <p className="text-gray-700 text-sm">Address: Madhya Pradesh, India</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            
            <a href="https://github.com/ITKHUSHI" target="_blank" className="text-gray-600 hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c-5.411 0-9.801 4.39-9.801 9.8 0 4.338 2.807 8.009 6.677 9.295.488.09.667-.212.667-.47 0-.232-.008-.847-.013-1.664-2.717.592-3.29-1.308-3.29-1.308-.445-1.134-1.087-1.436-1.087-1.436-.889-.607.067-.595.067-.595.982.069 1.498 1.01 1.498 1.01.873 1.496 2.292 1.064 2.85.814.088-.632.342-1.065.622-1.309-2.167-.246-4.444-1.084-4.444-4.82 0-1.064.38-1.935 1.004-2.616-.102-.245-.435-1.234.096-2.573 0 0 .82-.263 2.685.998a9.37 9.37 0 014.884 0c1.865-1.261 2.684-.998 2.684-.998.532 1.339.198 2.328.097 2.573.625.681 1.003 1.552 1.003 2.616 0 3.744-2.28 4.572-4.454 4.813.352.303.667.901.667 1.819 0 1.313-.012 2.373-.012 2.696 0 .261.177.565.673.47 3.868-1.286 6.673-4.957 6.673-9.294 0-5.41-4.39-9.801-9.8-9.801z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/khushee0225/" target="_blank" className="text-gray-600 hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.226.792 24 1.771 24h20.451C23.208 24 24 23.226 24 22.273V1.727C24 .774 23.208 0 22.225 0zm-13.847 20.452H5.363V9h3.015v11.452zM6.819 7.5a1.747 1.747 0 110-3.495 1.747 1.747 0 010 3.495zm13.635 12.952h-3.014v-5.604c0-1.336-.025-3.059-1.863-3.059-1.863 0-2.148 1.454-2.148 2.956v5.707h-3.014V9h2.892v1.561h.041c.403-.764 1.386-1.563 2.851-1.563 3.048 0 3.609 2.007 3.609 4.617v7.837z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SmartCemAi. All rights reserved.
      </div>
    </footer>
  );
}

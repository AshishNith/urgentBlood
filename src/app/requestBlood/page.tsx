"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Header } from "@/components/Header";

export default function FindNearbyDonorsPage() {
  const [formData, setFormData] = useState({
    address: "",
    bloodType: "",
  });
  const [loading, setLoading] = useState(false);
  const [nearbyDonors, setNearbyDonors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch nearby donors from the backend
      const response = await fetch(
        `/api/nearby-donors?bloodType=${formData.bloodType}&address=${encodeURIComponent(formData.address)}`
      );
      const donors = await response.json();

      if (donors.length === 0) {
        toast.error("No nearby donors found.");
      } else {
        toast.success(`${donors.length} nearby donors found!`);
        setNearbyDonors(donors);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // TypewriterEffect words
  const words = [
    { text: "Find" },
    { text: "Nearby" },
    { text: "Donors", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Home Button */}

      <div className="text-center mb-8">
        <TypewriterEffect words={words} />
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transform transition-all hover:scale-105">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Blood Type */}
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blood Type
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Searching..." : "Search Nearby Donors"}
          </button>
        </form>

        {/* Donors List and Map */}
        {nearbyDonors.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Nearby Donors
            </h2>

            {/* Donors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {nearbyDonors.map((donor, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {donor.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Blood Type: {donor.bloodType}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Phone: {donor.phone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Distance: {donor.distance.toFixed(2)} km
                    </p>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="h-96 w-full rounded-lg overflow-hidden">
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
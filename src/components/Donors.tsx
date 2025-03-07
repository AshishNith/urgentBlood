"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

export const Donors = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [donors, setDonors] = useState([]); // State to store fetched donors
  const [loading, setLoading] = useState(true); // Loading state
  const [filters, setFilters] = useState({
    bloodType: "",
    location: "",
  });

  // Fetch donors from the backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filters.bloodType) queryParams.append("bloodType", filters.bloodType);
        if (filters.location) queryParams.append("location", filters.location);

        const response = await fetch(`http://localhost:5000/api/donors?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch donors");
        }
        const data = await response.json();
        setDonors(data.donors); // Update state with fetched donors
      } catch (error) {
        console.error("Error fetching donors:", error);
        toast.error("Failed to fetch donors");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDonors();
  }, [filters]); // Re-fetch when filters change

  const handleRequestClick = () => {
    toast.success("Request sent successfully!");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading donors...</div>; // Show loading state
  }

  return (
    <div className="max-w-6xl mx-auto px-2 mb-6">
      <h1 className="text-3xl font-bold text-center mb-8 pt-10">Donors Nearby You</h1>

      {/* Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="text"
          name="bloodType"
          placeholder="Blood Type (e.g., A+)"
          value={filters.bloodType}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., New York)"
          value={filters.location}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Donor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.length > 0 ? (
          donors.map((donor, idx) => (
            <div
              key={idx}
              className="relative group block p-2 h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-200 relative z-20"
              >
                <h2 className="text-xl font-bold text-black">{donor.name}</h2>
                <p className="text-neutral-600 mt-2">Email: {donor.email}</p>
                <p className="text-neutral-600">Blood Type: {donor.bloodType}</p>
                <p className="text-neutral-600 flex items-center mt-2">
                  <FaMapMarkerAlt className="inline-block mr-1" />
                  {donor.location}
                </p>
                <button
                  onClick={handleRequestClick}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors w-full"
                >
                  Emergency Request
                </button>
              </motion.div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">No donors found.</div>
        )}
      </div>
    </div>
  );
};
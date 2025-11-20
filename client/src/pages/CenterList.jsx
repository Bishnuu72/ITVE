import React, { useState, useEffect } from "react";
import topImage from "../assets/images/Course8.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE = import.meta.env.VITE_API_URL;

function CenterList() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await fetch(`${API_BASE}/centres/public`);
        
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || "Failed to load centres");
        }

        const data = await response.json();
        
        // Sort by centreCode
        const sorted = data.sort((a, b) => a.centreCode.localeCompare(b.centreCode));
        
        setCenters(sorted);
      } catch (err) {
        console.error("Fetch centres error:", err);
        setError("Unable to load centre list right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCentres();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="relative w-full h-64">
          <img
            src={topImage}
            alt="ITVE Centers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-6">
              ITVE Center List
            </h1>
          </div>
        </div>

        {/* Content */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-12">
            Registered & Affiliated ITVE Centers
          </h2>

          {/* Loading */}
          {loading && (
            <div className="text-center py-32">
              <div className="inline-block animate-spinner rounded-full h-16 w-16 border-8 border-red-200 border-t-red-600"></div>
              <p className="mt-6 text-2xl text-gray-700 font-medium">Loading Centers...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-32 bg-red-50 rounded-2xl border-2 border-red-200">
              <p className="text-2xl text-red-600 font-bold">{error}</p>
            </div>
          )}

          {/* No Centres */}
          {!loading && !error && centers.length === 0 && (
            <div className="text-center py-32 bg-gray-100 rounded-2xl">
              <p className="text-2xl text-gray-600">No centres found at the moment.</p>
            </div>
          )}

          {/* Centres Table */}
          {!loading && !error && centers.length > 0 && (
            <>
              <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-700 to-red-900 text-white">
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">S.No</th>
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">Center Code</th>
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">Center Name</th>
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">Full Address</th>
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">District</th>
                      <th className="px-8 py-6 text-lg font-bold uppercase tracking-wider">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centers.map((center, index) => (
                      <tr
                        key={center._id}
                        className={`border-b-2 border-gray-200 text-gray-800 font-medium text-lg transition-all hover:bg-red-50 hover:shadow-lg ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-8 py-6 text-center font-bold text-red-600 text-xl">
                          {index + 1}
                        </td>
                        <td className="px-8 py-6 font-bold text-red-700 text-xl">
                          {center.centreCode}
                        </td>
                        <td className="px-8 py-6 text-xl font-semibold">
                          {center.centreName}
                        </td>
                        <td className="px-8 py-6">
                          {center.centreStreet}, {center.centreTown}, {center.centreDistrict} - {center.centrePin}
                        </td>
                        <td className="px-8 py-6 text-center font-semibold">
                          {center.centreDistrict}
                        </td>
                        <td className="px-8 py-6 text-center font-bold text-red-600 text-xl">
                          {center.centreState}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Count */}
              <div className="mt-16 text-center">
                <p className="text-2xl text-gray-700">
                  Total Affiliated Centers:{" "}
                  <span className="text-5xl font-bold text-red-600">{centers.length}</span>
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  All centers listed above are officially approved and active.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

export default CenterList;
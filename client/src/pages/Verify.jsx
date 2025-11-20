import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Shield, Building2, MapPin, Phone, Mail, Globe } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

function Verify() {
  const [loginId, setLoginId] = useState("");
  const [centre, setCentre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setError("Please enter Login ID");
      return;
    }

    setLoading(true);
    setError("");
    setCentre(null);

    try {
      const res = await fetch(`${API_BASE}/centres/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Centre not found");
      }

      setCentre(data.centre);
    } catch (err) {
      setError(err.message || "Invalid Login ID");
      setCentre(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="w-20 h-20 text-red-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Verify ITVE Centre</h1>
            <p className="text-xl text-gray-600">Enter Centre Login ID to verify authenticity</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10">
            <form onSubmit={handleVerify} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Enter Centre Login ID (e.g. centre_123456)"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 border-2 border-gray-300 rounded-2xl focus:border-red-500 focus:outline-none text-lg font-medium"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-12 py-5 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>Verifying...</>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    Verify Centre
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-4">
                <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-red-700">Not Verified</p>
                  <p className="text-lg text-red-600">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Verified Result */}
          {centre && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="p-12 text-center">
                <CheckCircle className="w-24 h-24 mx-auto mb-6" />
                <h2 className="text-5xl font-bold mb-4">100% AUTHENTIC</h2>
                <p className="text-2xl mb-8">This ITVE Centre is Officially Verified & Approved</p>
              </div>

              <div className="bg-white text-gray-800 p-12">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="text-center">
                    {centre.centreLogo ? (
                      <img 
                        src={`${API_BASE_URL}/uploads/${centre.centreLogo}`} 
                        alt="Centre Logo" 
                        className="w-40 h-40 rounded-full mx-auto border-8 border-green-500 object-cover shadow-xl"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                        <Building2 className="w-20 h-20 text-green-600" />
                      </div>
                    )}
                    <h3 className="text-4xl font-bold mt-6 text-green-700">{centre.centreName}</h3>
                    <p className="text-2xl font-semibold text-gray-600">Centre Code: <span className="text-red-600">{centre.centreCode}</span></p>
                    <p className="text-xl text-gray-600 mt-2">Login ID: <span className="font-mono bg-gray-100 px-4 py-2 rounded-lg">{centre.loginId}</span></p>
                  </div>

                  <div className="space-y-6 text-lg">
                    <div className="flex items-start gap-4">
                      <Building2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-xl">Owner</p>
                        <p className="text-xl">{centre.ownerName}</p>
                        <p className="text-gray-600">Contact: {centre.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-xl">Address</p>
                        <p className="text-lg">
                          {centre.centreStreet}, {centre.centreTown},<br />
                          {centre.centreDistrict}, {centre.centreState} - {centre.centrePin}
                        </p>
                      </div>
                    </div>

                    {centre.email && (
                      <div className="flex items-center gap-4">
                        <Mail className="w-8 h-8 text-green-600" />
                        <p className="text-lg">{centre.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 text-center bg-green-50 rounded-2xl p-8">
                  <p className="text-3xl font-bold text-green-700">✓ OFFICIALLY REGISTERED & ACTIVE</p>
                  <p className="text-xl text-gray-700 mt-4">This centre is fully authorized by ITVE</p>
                  <p className="text-lg text-gray-600 mt-6">Verified on: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Verify;
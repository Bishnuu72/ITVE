import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { getSliders, getImageUrl } from "../../services/sliderService";
import { getAllSettings } from "../../services/settingService";
import Swal from "sweetalert2";

export default function Affiliation() {
  const [logos, setLogos] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logos and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sliders, siteSettings] = await Promise.all([
          getSliders(),
          getAllSettings(),
        ]);

        const affiliationLogos = sliders
          .filter((s) => s.logo && s.status === "Active")
          .map((s) => getImageUrl(s.logo));

        setLogos(affiliationLogos);
        setSettings(siteSettings);
      } catch (err) {
        Swal.fire("Error", "Failed to load data", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white rounded-lg p-4 md:p-8 my-10 text-center">
        Loading affiliations...
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-lg p-4 md:p-8 my-10">
      {/* Top Contact Section */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#045C8C] text-white text-center">
        <div className="flex items-center justify-center gap-2 py-3 w-full md:w-1/2 h-20 border-b md:border-b-0 md:border-r-30 border-white">
          <Phone className="text-cyan-300" />
          <span className="font-semibold text-lg">
            Franchise Enquiry: {settings?.franchiseEnquiry || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 py-3 w-full md:w-1/2">
          <Phone className="text-cyan-300" />
          <span className="font-semibold text-lg">
            Helpline: {settings?.helpline || "N/A"}
          </span>
        </div>
      </div>

      {/* Affiliations Title */}
      <h2 className="text-center text-5xl font-bold text-[#064E3B] mt-10 mb-4">
        Affiliations
      </h2>

      {/* Scrolling Logos */}
      <div className="overflow-hidden relative w-full bg-white py-6">
        <div className="flex animate-scroll gap-12">
          {logos.concat(logos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              className="h-20 object-contain mx-auto"
            />
          ))}
        </div>
      </div>

      {/* Animation Style */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: calc(200%);
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
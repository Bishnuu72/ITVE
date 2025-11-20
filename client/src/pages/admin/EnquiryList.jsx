import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      type: "Contact",
      name: "IsabellaVoite",
      mobile: "1143264120",
      email: "emmamr187@hotmail.com",
      message:
        "Hey, I just stumbled onto your site… are you always this good at catching attention, or did you make it just for me? Write to me on this website --- rb.gy/ydlgvk?Voite --- my username is the same, I'll be waiting.",
      date: "22/10/2025 5:11 pm",
    },
    {
      id: 2,
      type: "Contact",
      name: "Mike Svein Girard",
      mobile: "8630742726",
      email: "mike@monkeydigital.co",
      message:
        "Hey, This is Mike from Monkey Digital, I am reaching out about a mutual collaboration. How would you like to place our banners on your site and redirect via your unique tracking link towards popular services from our website? This way, you earn a recurring 35% profit share, continuously from any transactions that come in from your website. Think about it, everyone benefit from SEO, so this is a huge opportunity. We already have thousands of affiliates and our payouts are paid out monthly. Recently, we paid out over $27,000 in affiliate earnings to our partners. If this sounds good, kindly chat with us here: https://monkeydigital.co/affiliates-whatsapp/ Or register today: https://www.monkeydigital.co/join-our-affiliate-program/ Cheers, Mike Svein Girard Phone/whatsapp: +1 (775) 314-7914",
      date: "22/10/2025 11:28 am",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      setEnquiries(enquiries.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              All Enquiries
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center">Type</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center">Mobile</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Message</th>
                    <th className="border p-2 text-center">Date</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e, index) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{e.type}</td>
                      <td className="border p-2">{e.name}</td>
                      <td className="border p-2 text-center">{e.mobile}</td>
                      <td className="border p-2">{e.email}</td>
                      <td className="border p-2">{e.message}</td>
                      <td className="border p-2 text-center">{e.date}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-gray-500 py-4 italic">
                        No enquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

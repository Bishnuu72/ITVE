import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSliders,
  deleteSlider,
  getImageUrl,
} from "../../services/sliderService";

export default function ManageSlider() {
  const [search, setSearch] = useState("");
  const [sliders, setSliders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const data = await getSliders();
      setSliders(data);
    } catch (err) {
      console.error("Failed to fetch sliders", err);
    }
  };

  const filtered = sliders.filter((slider) =>
    slider.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-slider/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteSlider(id);
        Swal.fire("Deleted!", "Slider has been deleted.", "success");
        fetchSliders();
      } catch (err) {
        Swal.fire("Error!", "Failed to delete slider.", "error");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Sliders
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-slider")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm min-w-[900px]">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center w-32">Photo</th>
                    <th className="border p-2 text-center w-32">Logo</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center w-32">Status</th>
                    <th className="border p-2 text-center w-40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((slider, index) => (
                    <tr key={slider._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {slider.photo ? (
                          <img
                            src={getImageUrl(slider.photo)}
                            alt="Photo"
                            className="h-12 w-24 object-cover mx-auto rounded"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No Photo</span>
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {slider.logo ? (
                          <img
                            src={getImageUrl(slider.logo)}
                            alt="Logo"
                            className="h-12 w-24 object-contain mx-auto rounded"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No Logo</span>
                        )}
                      </td>
                      <td className="border p-2">{slider.name}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            slider.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slider.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(slider._id)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slider._id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No sliders found.
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
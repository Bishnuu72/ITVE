import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addSlider,
  updateSlider,
  getSliders,
  getImageUrl,
} from "../../services/sliderService";

export default function AddSlider() {
  const [sliderData, setSliderData] = useState({
    name: "",
    link: "",
    slNo: "",
    description: "",
    photo: null,
    logo: null,
    status: "Active",
  });
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSliders().then((data) => {
        const slider = data.find((s) => s._id === id);
        if (slider) {
          setSliderData({
            name: slider.name,
            link: slider.link,
            slNo: slider.slNo,
            description: slider.description,
            photo: null,
            logo: null,
            status: slider.status,
          });
          setExistingPhoto(slider.photo);
          setExistingLogo(slider.logo);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" || name === "logo") {
      const file = files[0];
      setSliderData({ ...sliderData, [name]: file });

      const previewUrl = URL.createObjectURL(file);
      if (name === "photo") setPhotoPreview(previewUrl);
      if (name === "logo") setLogoPreview(previewUrl);
    } else {
      setSliderData({ ...sliderData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in sliderData) {
      if (sliderData[key]) formData.append(key, sliderData[key]);
    }

    try {
      if (id) {
        await updateSlider(id, formData);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Slider updated successfully!",
        });
      } else {
        await addSlider(formData);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Slider added successfully!",
        });
      }
      navigate("/manage-slider");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Something went wrong!",
      });
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              {id ? "Edit Slider" : "Add Slider"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={sliderData.name}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Link:</label>
                <input
                  type="text"
                  name="link"
                  value={sliderData.link}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Sl No:</label>
                <input
                  type="number"
                  name="slNo"
                  value={sliderData.slNo}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Description:</label>
                <textarea
                  name="description"
                  value={sliderData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Photo:</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="w-full"
                />
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Selected Photo"
                    className="mt-2 h-20 object-cover rounded"
                  />
                ) : existingPhoto && (
                  <img
                    src={getImageUrl(existingPhoto)}
                    alt="Existing Photo"
                    className="mt-2 h-20 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Logo:</label>
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  className="w-full"
                />
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Selected Logo"
                    className="mt-2 h-20 object-contain rounded"
                  />
                ) : existingLogo && (
                  <img
                    src={getImageUrl(existingLogo)}
                    alt="Existing Logo"
                    className="mt-2 h-20 object-contain rounded"
                  />
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Status:</label>
                <select
                  name="status"
                  value={sliderData.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
                >
                  {id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/manage-slider")}
                  className="bg-gray-400 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
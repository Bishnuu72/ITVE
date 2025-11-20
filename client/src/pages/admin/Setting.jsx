import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Swal from "sweetalert2";
import {
  getAllSettings,
  createOrUpdateSetting,
  deleteSetting,
} from "../../services/settingService";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    seoTitle: "",
    seoKeyword: "",
    seoDescription: "",
    adminMobile: "",
    franchiseEnquiry: "",
    helpline: "",
    adminEmail: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
    studentRegFee: "",
    headBranchRegFee: "",
    centerRegFee: "",
    logo: null,
    qrCode: null,
    signature: null,
  });

  const [previews, setPreviews] = useState({
    logo: null,
    qrCode: null,
    signature: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [settingId, setSettingId] = useState(null);

  // Fetch settings from server
  const fetchSettings = async () => {
    try {
      const data = await getAllSettings();
      if (data) {
        setSettings({
          seoTitle: data.seoTitle || "",
          seoKeyword: data.seoKeyword || "",
          seoDescription: data.seoDescription || "",
          adminMobile: data.adminMobile || "",
          franchiseEnquiry: data.franchiseEnquiry || "",
          helpline: data.helpline || "",
          adminEmail: data.adminEmail || "",
          address: data.address || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          youtube: data.youtube || "",
          whatsapp: data.whatsapp || "",
          studentRegFee: data.studentRegFee || "",
          headBranchRegFee: data.headBranchRegFee || "",
          centerRegFee: data.centerRegFee || "",
          logo: null,
          qrCode: null,
          signature: null,
        });

        // Set previews with full URLs from service
        setPreviews({
          logo: data.logo || null,
          qrCode: data.qrCode || null,
          signature: data.signature || null,
        });

        setSettingId(data._id);
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setSettings((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      await createOrUpdateSetting(formData);
      Swal.fire(
        "Success!",
        `Settings ${isEditing ? "updated" : "created"} successfully.`,
        "success"
      );
      fetchSettings();
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire("Error!", "Something went wrong while saving.", "error");
    }
  };

  const handleDelete = async () => {
    if (!settingId) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the settings!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSetting(settingId);
        Swal.fire("Deleted!", "Settings have been deleted.", "success");
        setSettings({
          seoTitle: "",
          seoKeyword: "",
          seoDescription: "",
          adminMobile: "",
          franchiseEnquiry: "",
          helpline: "",
          adminEmail: "",
          address: "",
          facebook: "",
          instagram: "",
          linkedin: "",
          youtube: "",
          whatsapp: "",
          studentRegFee: "",
          headBranchRegFee: "",
          centerRegFee: "",
          logo: null,
          qrCode: null,
          signature: null,
        });
        setPreviews({ logo: null, qrCode: null, signature: null });
        setIsEditing(false);
        setSettingId(null);
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete settings.", "error");
      }
    }
  };

  const handleReset = () => {
    fetchSettings();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              Admin Settings
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* SEO Settings */}
              <div>
                <label className="block font-semibold mb-1">Seo Title *</label>
                <input
                  type="text"
                  name="seoTitle"
                  value={settings.seoTitle}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Seo Keyword *</label>
                <textarea
                  name="seoKeyword"
                  value={settings.seoKeyword}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Seo Description *</label>
                <textarea
                  name="seoDescription"
                  value={settings.seoDescription}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  rows="4"
                  required
                />
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="adminMobile"
                  value={settings.adminMobile}
                  onChange={handleChange}
                  placeholder="Admin Mobile"
                  className="w-full border rounded-md p-2"
                  required
                />
                <input
                  type="text"
                  name="franchiseEnquiry"
                  value={settings.franchiseEnquiry}
                  onChange={handleChange}
                  placeholder="Franchise Enquiry"
                  className="w-full border rounded-md p-2"
                  required
                />
                <input
                  type="text"
                  name="helpline"
                  value={settings.helpline}
                  onChange={handleChange}
                  placeholder="Helpline"
                  className="w-full border rounded-md p-2"
                  required
                />
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  placeholder="Admin Email"
                  className="w-full border rounded-md p-2"
                  required
                />
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border rounded-md p-2 md:col-span-2"
                  rows="2"
                  required
                />
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="url"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="url"
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="url"
                  name="linkedin"
                  value={settings.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="url"
                  name="youtube"
                  value={settings.youtube}
                  onChange={handleChange}
                  placeholder="YouTube URL"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="text"
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp Number"
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Fees */}
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="number"
                  name="studentRegFee"
                  value={settings.studentRegFee}
                  onChange={handleChange}
                  placeholder="Student Reg. Fee"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="number"
                  name="headBranchRegFee"
                  value={settings.headBranchRegFee}
                  onChange={handleChange}
                  placeholder="Head Branch Reg. Fee"
                  className="w-full border rounded-md p-2"
                />
                <input
                  type="number"
                  name="centerRegFee"
                  value={settings.centerRegFee}
                  onChange={handleChange}
                  placeholder="Center Reg. Fee"
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* File Uploads */}
              <div className="grid md:grid-cols-3 gap-4">
                {["logo", "qrCode", "signature"].map((field) => (
                  <div key={field}>
                    <label className="block font-semibold mb-1 capitalize">
                      {field === "qrCode" ? "QR Code" : field}
                    </label>
                    {previews[field] && (
                      <img
                        src={previews[field]}
                        alt={field}
                        className="w-24 h-24 object-contain border rounded mb-2"
                      />
                    )}
                    <input
                      type="file"
                      name={field}
                      onChange={handleFileChange}
                      className="w-full"
                      accept="image/*"
                    />
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
                >
                  Reset
                </button>
                {isEditing && settingId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

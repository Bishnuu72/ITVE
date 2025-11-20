// src/pages/admin/CenterEnquiryList.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Swal from "sweetalert2";
import { getAllContacts, deleteContact, markContactRead } from "../../services/contactService";

export default function CenterEnquiryList() {
  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all contacts
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const data = await getAllContacts();
        setEnquiries(Array.isArray(data) ? data : []); // Ensure it's an array
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  // Filter enquiries by search
  const filtered = Array.isArray(enquiries)
    ? enquiries.filter(
        (enq) =>
          enq.name?.toLowerCase().includes(search.toLowerCase()) ||
          enq.email?.toLowerCase().includes(search.toLowerCase()) ||
          enq.phone?.includes(search) ||
          enq.message?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // View details modal
  const handleView = (id) => {
    Swal.fire({
      title: "Enquiry Details",
      html: `<pre>${JSON.stringify(
        enquiries.find((e) => e._id === id),
        null,
        2
      )}</pre>`,
      width: 600,
      scrollbarPadding: false,
    });
  };

  // Toggle Read/Unread
  const handleToggleRead = async (enq) => {
    try {
      const updated = await markContactRead(enq._id, !enq.read);
      setEnquiries(
        enquiries.map((e) => (e._id === enq._id ? updated : e))
      );
      Swal.fire(
        "Updated!",
        `Enquiry marked as ${updated.read ? "Read" : "Unread"}.`,
        "success"
      );
    } catch (err) {
      console.error("Failed to update read status:", err);
      Swal.fire("Error", "Failed to update read status.", "error");
    }
  };

  // Delete enquiry
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the enquiry!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteContact(id);
        setEnquiries(enquiries.filter((e) => e._id !== id));
        Swal.fire("Deleted!", "Enquiry has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete enquiry.", "error");
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Center Enquiries
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center py-6 text-gray-500">Loading enquiries...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2 text-center w-12">Sl No</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Email</th>
                      <th className="border p-2 text-left">Mobile</th>
                      <th className="border p-2 text-left">Message</th>
                      <th className="border p-2 text-center">Date</th>
                      <th className="border p-2 text-center w-44">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((enq, index) => (
                        <tr key={enq._id} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2">{enq.name}</td>
                          <td className="border p-2">{enq.email}</td>
                          <td className="border p-2">{enq.phone}</td>
                          <td className="border p-2">{enq.message}</td>
                          <td className="border p-2 text-center">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border p-2 text-center flex justify-center gap-2">
                            {/* Toggle Read/Unread */}
                            <button
                              onClick={() => handleToggleRead(enq)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-white font-medium transition-colors duration-200 ${
                                enq.read
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {enq.read ? "Mark Unread" : "Mark Read"}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(enq._id)}
                              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                          No enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

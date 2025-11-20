import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import { getAllMessages, deleteMessage } from "../../services/messageService";
import Swal from "sweetalert2";

export default function MessageList() {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch messages from backend
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getAllMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Navigate to Edit page
  const handleEdit = (id) => {
    navigate(`/add-message/${id}`);
  };

  // Delete message
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMessage(id);
        Swal.fire("Deleted!", "Message has been deleted.", "success");
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete message.", "error");
      }
    }
  };

  // View full message in SweetAlert2 modal
  const viewFullMessage = (student, subject, message) => {
    Swal.fire({
      title: `<strong>${student}</strong> - ${subject}`,
      html: `<p class="text-left leading-relaxed">${message.replace(/\n/g, "<br>")}</p>`,
      icon: "info",
      confirmButtonText: "Close",
      width: "600px",
      customClass: {
        popup: "rounded-xl",
        title: "text-xl",
        htmlContainer: "text-sm",
      },
    });
  };

  // Filter messages
  const filtered = messages.filter(
    (msg) =>
      msg.center?.toLowerCase().includes(search.toLowerCase()) ||
      msg.student?.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Messages
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by center, student, subject or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-80"
                />
                <button
                  onClick={fetchMessages}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/add-message")}
                  className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Error / Loading */}
            {error && <div className="text-red-600 font-medium mb-4 bg-red-50 p-3 rounded">{error}</div>}
            {loading && <div className="text-gray-600 mb-4">Loading messages...</div>}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-3 text-center w-12">Sl No</th>
                    <th className="border p-3 text-left">Center</th>
                    <th className="border p-3 text-left">Student</th>
                    <th className="border p-3 text-left">Subject</th>
                    <th className="border p-3 text-left">Message</th>
                    <th className="border p-3 text-center w-32">Date</th>
                    <th className="border p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((msg, index) => {
                      const shortMessage = msg.message?.length > 80 
                        ? msg.message.substring(0, 80) + "..." 
                        : msg.message || "-";

                      return (
                        <tr key={msg._id} className="hover:bg-gray-50 transition">
                          <td className="border p-3 text-center font-medium">{index + 1}</td>
                          <td className="border p-3">{msg.center || "-"}</td>
                          <td className="border p-3 font-medium">{msg.student || "-"}</td>
                          <td className="border p-3">{msg.subject || "-"}</td>
                          <td className="border p-3 text-gray-700">
                            <div className="flex items-start gap-2">
                              <span className="line-clamp-2">{shortMessage}</span>
                              {msg.message?.length > 80 && (
                                <button
                                  onClick={() => viewFullMessage(msg.student, msg.subject, msg.message)}
                                  className="text-blue-600 underline text-xs font-medium hover:text-blue-800 whitespace-nowrap"
                                >
                                  View Full
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="border p-3 text-center text-xs">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleDateString("en-IN")
                              : "-"}
                          </td>
                          <td className="border p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(msg._id)}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(msg._id)}
                                className="bg-red-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-500 italic text-lg">
                        {loading ? "Loading messages..." : "No messages found."}
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
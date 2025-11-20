import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { addMessage, getMessageById, updateMessage } from "../../services/messageService";

const API_BASE = import.meta.env.VITE_API_URL?.trim();

export default function AddMessage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [centres, setCentres] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [formData, setFormData] = useState({
    center: "",
    student: "",
    subject: "",
    message: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Centres
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await fetch(`${API_BASE}/centres`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setCentres(list);
      } catch (err) {
        setError("Failed to load centres");
      } finally {
        setLoadingCentres(false);
      }
    };
    fetchCentres();
  }, []);

  // Fetch All Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await fetch(`${API_BASE}/students`);
        const result = await res.json();
        const list = result.data || [];
        setAllStudents(list);
      } catch (err) {
        setError("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students when centre changes → EXACT MATCH with stored centre string
  useEffect(() => {
    if (!formData.center) {
      setFilteredStudents([]);
      if (formData.student) {
        setFormData(prev => ({ ...prev, student: "" }));
      }
      return;
    }

    // Find the full centre label like "ITVE Main Center (ITVE001)"
    const selectedCentreObj = centres.find(c => c.name === formData.center);
    if (!selectedCentreObj) {
      setFilteredStudents([]);
      return;
    }

    const fullCentreLabel = `${selectedCentreObj.name} (${selectedCentreObj.code})`;

    const matchedStudents = allStudents.filter(student => 
      student.center === fullCentreLabel
    );

    setFilteredStudents(matchedStudents);

    // If current selected student is not in this centre → reset
    const currentStudentStillValid = matchedStudents.some(s => s.studentName === formData.student);
    if (formData.student && !currentStudentStillValid) {
      setFormData(prev => ({ ...prev, student: "" }));
    }
  }, [formData.center, centres, allStudents, formData.student]);

  // Load existing message (Edit mode)
  useEffect(() => {
    if (id) {
      const loadMessage = async () => {
        setLoading(true);
        try {
          const msg = await getMessageById(id);
          setFormData({
            center: msg.center.split(" (")[0], // extract only name part for dropdown
            student: msg.student,
            subject: msg.subject,
            message: msg.message,
            attachment: null,
          });
        } catch (err) {
          setError("Failed to load message");
        } finally {
          setLoading(false);
        }
      };
      loadMessage();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "attachment" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.center || !formData.student) {
      setError("Centre and Student are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (id) {
        await updateMessage(id, formData);
        Swal.fire("Success!", "Message updated", "success");
      } else {
        await addMessage(formData);
        Swal.fire("Sent!", "Message sent successfully", "success");
        // Reset form but keep selected centre
        setFormData(prev => ({
          center: prev.center,
          student: "",
          subject: "",
          message: "",
          attachment: null,
        }));
      }
      navigate("/message-list");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save message";
      setError(msg);
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-10">

            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-10">
              {id ? "Edit Message" : "Send New Message"}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Centre */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Centre <span className="text-red-500">*</span>
                </label>
                <select
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  required
                  disabled={loadingCentres}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base font-medium focus:ring-4 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    {loadingCentres ? "Loading centres..." : "-- Select Centre --"}
                  </option>
                  {centres.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  required
                  disabled={!formData.center || loadingStudents}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base font-medium focus:ring-4 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">
                    {formData.center
                      ? loadingStudents
                        ? "Loading students..."
                        : filteredStudents.length === 0
                        ? "No students in this centre"
                        : "-- Select Student --"
                      : "-- First select a centre --"}
                  </option>
                  {filteredStudents.map((s) => (
                    <option key={s._id} value={s.studentName}>
                      {s.studentName} ({s.rollNo || s.enrollmentNo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject & Message */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject"
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  placeholder="Write your message..."
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 focus:ring-4 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Attachment (Optional)</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full file:mr-6 file:py-3 file:px-8 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : id ? "Update Message" : "Send Message"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/message-list")}
                  className="bg-gray-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
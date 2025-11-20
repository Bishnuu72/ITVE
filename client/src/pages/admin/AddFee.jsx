import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { addFee, getFeeById, updateFee, getAllStudents, getAllCentres } from "../../services/feeService";

export default function AddFee() {
  const [formData, setFormData] = useState({
    student: "",
    centre: "",
    amount: "",
    date: "",
    paymentMode: "",
    remarks: "",
  });
  const [allStudents, setAllStudents] = useState([]);
  const [allCentres, setAllCentres] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const paymentModes = ["Cash", "Bank Transfer", "UPI", "Cheque"];

  // Fetch Students & Centres
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [studentRes, centreRes] = await Promise.all([
          getAllStudents(),
          getAllCentres()
        ]);

        const students = Array.isArray(studentRes?.data) ? studentRes.data : studentRes || [];
        const centres = Array.isArray(centreRes?.data) ? centreRes.data : centreRes || [];

        setAllStudents(students);
        setAllCentres(centres);
        setFilteredStudents(students); // initially show all
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load data", "error");
        setAllStudents([]);
        setAllCentres([]);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // Load existing fee (Edit mode)
  useEffect(() => {
    if (id && !fetching) {
      const loadFee = async () => {
        try {
          setLoading(true);
          const fee = await getFeeById(id);
          setFormData({
            student: fee.student || "",
            centre: fee.centre || "",
            amount: fee.amount || "",
            date: fee.date ? new Date(fee.date).toISOString().split("T")[0] : "",
            paymentMode: fee.paymentMode || "",
            remarks: fee.remarks || "",
          });
        } catch (err) {
          Swal.fire("Error", "Failed to load fee", "error");
        } finally {
          setLoading(false);
        }
      };
      loadFee();
    }
  }, [id, fetching]);

  // When Centre changes → filter students
  useEffect(() => {
    if (!formData.centre) {
      setFilteredStudents(allStudents);
      return;
    }

    const selectedCentreFull = allCentres.find(c => c.name === formData.centre);
    const centreLabel = selectedCentreFull ? `${selectedCentreFull.name} (${selectedCentreFull.code})` : formData.centre;

    const filtered = allStudents.filter(s => s.center === centreLabel);
    setFilteredStudents(filtered);

    // If current student not in this centre → reset
    if (formData.student && !filtered.some(s => s.studentName === formData.student)) {
      setFormData(prev => ({ ...prev, student: "" }));
    }
  }, [formData.centre, allStudents, allCentres]);

  // When Student changes → auto-fill centre
  const handleStudentChange = (selectedStudentName) => {
    const student = allStudents.find(s => s.studentName === selectedStudentName);
    if (student && student.center) {
      // Extract centre name from "Centre Name (CODE)"
      const centreName = student.center.split(" (")[0];
      setFormData(prev => ({
        ...prev,
        student: selectedStudentName,
        centre: centreName
      }));
    } else {
      setFormData(prev => ({ ...prev, student: selectedStudentName }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "student") {
      handleStudentChange(value);
    } else if (name === "centre") {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.student) errs.student = "Student is required";
    if (!formData.centre) errs.centre = "Centre is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) errs.amount = "Valid amount required";
    if (!formData.date) errs.date = "Date is required";
    if (!formData.paymentMode) errs.paymentMode = "Payment mode is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await updateFee(id, formData);
        Swal.fire("Success!", "Fee updated", "success");
      } else {
        await addFee(formData);
        Swal.fire("Success!", "Fee added", "success");
      }
      navigate("/fee-list");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to save fee", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-10">
              {id ? "Edit Fee Record" : "Add New Fee"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Centre */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Centre <span className="text-red-500">*</span>
                </label>
                <select
                  name="centre"
                  value={formData.centre}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base focus:ring-4 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Centre --</option>
                  {allCentres.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {errors.centre && <p className="text-red-600 text-sm mt-1">{errors.centre}</p>}
              </div>

              {/* Student - Filtered */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base focus:ring-4 focus:ring-blue-500"
                  required
                >
                  <option value="">
                    {formData.centre 
                      ? filteredStudents.length === 0 
                        ? "No students in this centre" 
                        : "-- Select Student --"
                      : "-- First select centre or choose student --"}
                  </option>
                  {filteredStudents.map((s) => (
                    <option key={s._id} value={s.studentName}>
                      {s.studentName} ({s.rollNo || s.enrollmentNo})
                    </option>
                  ))}
                </select>
                {errors.student && <p className="text-red-600 text-sm mt-1">{errors.student}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
                {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
                {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                >
                  <option value="">-- Select Mode --</option>
                  {paymentModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                {errors.paymentMode && <p className="text-red-600 text-sm mt-1">{errors.paymentMode}</p>}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Remarks (Optional)</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any additional notes..."
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 focus:ring-4 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : id ? "Update Fee" : "Add Fee"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/fee-list")}
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
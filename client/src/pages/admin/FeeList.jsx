import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../components/admin/Sidebar"; // Adjust path if needed
import Topbar from "../../components/admin/Topbar"; // Adjust path if needed
import { getFees, deleteFee, getFeeById } from "../../services/feeService";

export default function FeeList() {
  const [search, setSearch] = useState("");
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // For initial auth check
  // New states for print modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const navigate = useNavigate();

  const LOGIN_ROUTE = "/login"; // Adjust to your login route

  // Check auth on mount (before fetching fees)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const tokenExists = !!token && token.trim() !== "";
      if (!tokenExists) {
        console.warn("⚠️ No token found in FeeList. Redirecting to login.");
        Swal.fire({
          title: "Authentication Required",
          text: "Please log in to access fee list.",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate(LOGIN_ROUTE);
        });
        setCheckingAuth(false);
        return;
      }
      console.log("✅ Token found in FeeList. Proceeding to fetch fees.");
      setCheckingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  // Fetch fees (only if auth checked and passed)
  useEffect(() => {
    if (checkingAuth) return; // Wait for auth check

    const fetchFees = async () => {
      try {
        setLoading(true);
        const data = await getFees();
        setFees(data || []);
      } catch (error) {
        console.error("Fetch fees error:", error);
        
        // Specific handling for auth errors (401/403)
        if (error.message.includes("Authentication failed") || error.message.includes("401")) {
          Swal.fire({
            title: "Session Expired",
            text: "Your login session has expired. Please log in again.",
            icon: "error",
            confirmButtonText: "Go to Login",
          }).then(() => {
            localStorage.removeItem("token"); // Clear invalid token
            navigate(LOGIN_ROUTE);
          });
          return;
        } else if (error.message.includes("Access denied") || error.message.includes("403")) {
          Swal.fire({
            title: "Access Denied",
            text: "You are not authorized to view fees. Contact admin.",
            icon: "error",
            confirmButtonText: "Go to Login",
          }).then(() => {
            localStorage.removeItem("token");
            navigate(LOGIN_ROUTE);
          });
          return;
        }
        
        // Other errors
        Swal.fire("Error", error.message || "Failed to load fees", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [checkingAuth, navigate]);

  const filteredFees = fees.filter(
    (f) =>
      f.student.toLowerCase().includes(search.toLowerCase()) ||
      (f.centre || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (id, action) => {
    switch (action) {
      case "edit":
        navigate(`/edit-fee/${id}`);
        break;

      case "delete":
        Swal.fire({
          title: "Are you sure?",
          text: "This fee record will be permanently deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteFee(id);
              setFees(fees.filter((fee) => fee._id !== id));
              Swal.fire("Deleted!", "Fee record deleted successfully.", "success");
            } catch (error) {
              console.error("Delete error:", error);
              
              // Handle auth error during delete
              if (error.message.includes("Authentication failed") || error.message.includes("401")) {
                Swal.fire({
                  title: "Session Expired",
                  text: "Your login session has expired. Please log in again.",
                  icon: "error",
                  confirmButtonText: "Go to Login",
                }).then(() => {
                  localStorage.removeItem("token");
                  navigate(LOGIN_ROUTE);
                });
                return;
              } else if (error.message.includes("Access denied") || error.message.includes("403")) {
                Swal.fire({
                  title: "Access Denied",
                  text: "You are not authorized to delete fees. Contact admin.",
                  icon: "error",
                  confirmButtonText: "Go to Login",
                }).then(() => {
                  localStorage.removeItem("token");
                  navigate(LOGIN_ROUTE);
                });
                return;
              }
              
              Swal.fire("Error", error.message || "Failed to delete fee", "error");
            }
          }
        });
        break;

      case "print":
        try {
          console.log(`🖨️ Preparing to print fee ID: ${id}`);
          // Fetch full details (populated) for print
          const feeData = await getFeeById(id);
          if (!feeData) {
            Swal.fire("Error", "Fee not found for printing.", "error");
            return;
          }
          setSelectedFee(feeData);
          setShowPrintModal(true);
          
          // Trigger print after modal renders (small delay for DOM)
          setTimeout(() => {
            window.print();
          }, 500);
        } catch (error) {
          console.error("Print error:", error);
          
          // Handle auth error during print fetch
          if (error.message.includes("Authentication failed") || error.message.includes("401")) {
            Swal.fire({
              title: "Session Expired",
              text: "Your login session has expired. Please log in again.",
              icon: "error",
              confirmButtonText: "Go to Login",
            }).then(() => {
              localStorage.removeItem("token");
              navigate(LOGIN_ROUTE);
            });
            return;
          } else if (error.message.includes("Access denied") || error.message.includes("403")) {
            Swal.fire({
              title: "Access Denied",
              text: "You are not authorized to view this fee for printing. Contact admin.",
              icon: "error",
              confirmButtonText: "Go to Login",
            }).then(() => {
              localStorage.removeItem("token");
              navigate(LOGIN_ROUTE);
            });
            return;
          }
          
          Swal.fire("Error", error.message || "Failed to load fee for printing", "error");
        }
        break;

      default:
        break;
    }
  };

  // Handle print modal close (after print)
  useEffect(() => {
    if (showPrintModal) {
      const handleAfterPrint = () => {
        setShowPrintModal(false);
        setSelectedFee(null);
        console.log("🖨️ Print modal closed.");
      };

      window.addEventListener("afterprint", handleAfterPrint);
      return () => window.removeEventListener("afterprint", handleAfterPrint);
    }
  }, [showPrintModal]);

  // Show auth checking state
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto flex items-center justify-center">
            <p className="text-center text-gray-500">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // If loading, show loader
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto flex items-center justify-center">
            <p className="text-center text-gray-500">Loading fees...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                  All Fees
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by student or centre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => navigate("/add-fee")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                  >
                    + Add Fee
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border border-gray-300 p-2 text-center w-12">Sl No</th>
                      <th className="border border-gray-300 p-2 text-left">Student</th>
                      <th className="border border-gray-300 p-2 text-left">Centre</th>
                      <th className="border border-gray-300 p-2 text-center w-24">Amount</th>
                      <th className="border border-gray-300 p-2 text-left">Remarks</th>
                      <th className="border border-gray-300 p-2 text-center w-28">Payment Mode</th>
                      <th className="border border-gray-300 p-2 text-center w-28">Date</th>
                      <th className="border border-gray-300 p-2 text-center w-32">Created</th>
                      <th className="border border-gray-300 p-2 text-center w-56">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFees.map((f, index) => (
                      <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 p-2">{f.student}</td>
                        <td className="border border-gray-300 p-2">{f.centre || "N/A"}</td>
                        <td className="border border-gray-300 p-2 text-center font-medium">₹{parseFloat(f.amount).toFixed(2)}</td>
                        <td className="border border-gray-300 p-2">{f.remarks || "N/A"}</td>
                        <td className="border border-gray-300 p-2 text-center">{f.paymentMode}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {new Date(f.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-xs">
                          {new Date(f.createdAt).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAction(f._id, "edit")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction(f._id, "delete")}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleAction(f._id, "print")}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                            >
                              Print Slip
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredFees.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-gray-500 py-4 italic border border-gray-300">
                          No fees found{search ? ` for "${search}"` : "."}
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

      {/* New: Print Modal (Receipt Slip) - Tailwind Only */}
      {showPrintModal && selectedFee && (
        <>
          {/* Backdrop - Full screen for print, semi-transparent on screen */}
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-8">
            {/* Close button - Top-right, hidden on print */}
            <div className="print:hidden absolute top-4 right-4 z-50">
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedFee(null);
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                &times;
              </button>
            </div>

            {/* Receipt Content - Optimized for screen and print */}
            <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl border border-gray-200 print:shadow-none print:border-none print:rounded-none print:p-4 print:max-w-none print:w-full">
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-gray-300 pb-4 mb-4 print:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">ITVE Fee Receipt</h1>
                <p className="text-sm text-gray-600">Information Technology & Vocational Education</p>
                <p className="text-xs text-gray-500 mt-1">Receipt ID: {selectedFee._id}</p>
              </div>

              {/* Fee Details - Flex layout for alignment */}
              <div className="space-y-3 text-sm print:text-base print:leading-relaxed">
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-gray-700 w-1/3">Student:</span>
                  <span className="text-gray-900 w-2/3 text-right">{selectedFee.student}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-gray-700 w-1/3">Centre:</span>
                  <span className="text-gray-900 w-2/3 text-right">{selectedFee.centre || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-300 mt-2">
                  <span className="font-semibold text-gray-700 w-1/3">Amount:</span>
                  <span className="text-lg md:text-xl font-bold text-green-600 w-2/3 text-right">₹{parseFloat(selectedFee.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-gray-700 w-1/3">Payment Date:</span>
                  <span className="text-gray-900 w-2/3 text-right">{new Date(selectedFee.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-gray-700 w-1/3">Payment Mode:</span>
                  <span className="uppercase text-gray-900 w-2/3 text-right">{selectedFee.paymentMode}</span>
                </div>
                {selectedFee.remarks && (
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-gray-700 w-1/3">Remarks:</span>
                    <span className="text-gray-900 w-2/3 text-right italic">{selectedFee.remarks}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1 border-t border-gray-300 mt-2">
                  <span className="font-semibold text-gray-700 w-1/3">Created By:</span>
                  <span className="text-gray-900 w-2/3 text-right">{selectedFee.createdBy?.name || "N/A"} ({selectedFee.createdBy?.email || ""})</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                  <span className="w-1/2">Generated: {new Date(selectedFee.createdAt).toLocaleString()}</span>
                  <span className="w-1/2 text-right">Updated: {new Date(selectedFee.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 pt-4 border-t border-gray-300 text-sm text-gray-600 print:text-base">
                <p className="font-medium">Thank you for your payment!</p>
                <p className="text-xs mt-2 print:text-sm">This is a computer-generated receipt. No signature required.</p>
              </div>

              {/* Print Controls - Hidden on print */}
              <div className="print:hidden flex justify-center gap-4 mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors shadow-md"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    setSelectedFee(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Tailwind Print Styles - Add to tailwind.config.js for full support */}
          {/* If print variants not configured, add this to your global CSS or config: */}
          <style>{`
            @media print {
              .print-hidden {
                display: none !important;
              }
              body {
                background: white !important;
              }
              .fixed.inset-0 {
                position: fixed !important;
                background: white !important;
              }
              .max-w-4xl {
                max-width: none !important;
                width: 100% !important;
              }
              @page {
                margin: 0.5in;
                size: A4;
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
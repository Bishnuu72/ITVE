// services/studentAdmissionService.js
const API_BASE = import.meta.env.VITE_API_URL;

export const submitStudent = async (formData) => {
  const submitData = new FormData();
  
  // Append all fields (including registrationType)
  Object.keys(formData).forEach((key) => {
    if (key !== "studentPhoto" && key !== "idProof" && key !== "eduProof") {
      submitData.append(key, formData[key]);
    }
  });

  // Append files
  if (formData.studentPhoto instanceof File) submitData.append("studentPhoto", formData.studentPhoto);
  if (formData.idProof instanceof File) submitData.append("idProof", formData.idProof);
  if (formData.eduProof instanceof File) submitData.append("eduProof", formData.eduProof);

  // ✅ NEW: Debug - Log FormData contents
  console.log("🔍 Sending FormData keys:", Array.from(submitData.keys()));
  for (let [key, value] of submitData.entries()) {
    console.log(`${key}:`, value.name ? `File (${value.name})` : value);
  }

  const response = await fetch(`${API_BASE}/students`, {
    method: "POST",
    body: submitData,
  });

  const result = await response.json();
  console.log("🔍 Backend response:", result); // ✅ NEW: Log full response

  if (!response.ok) {
    throw { response: { data: result } }; // Pass full error
  }

  return result;
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/teams';
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Get all team members
export const getTeamMembers = async () => {
  const response = await axios.get(API_URL);
  // Attach full image URL if photo exists
  return response.data.map(member => ({
    ...member,
    photoUrl: member.photo ? `${UPLOADS_URL}${member.photo}` : null,
  }));
};

// Get single team member by ID
export const getTeamMemberById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  const member = response.data;
  return {
    ...member,
    photoUrl: member.photo ? `${UPLOADS_URL}${member.photo}` : null,
  };
};

// Create new team member (with image)
export const createTeamMember = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update team member
export const updateTeamMember = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete team member
export const deleteTeamMember = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
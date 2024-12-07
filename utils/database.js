import axios from 'axios';

const API_URL = 'http://youripandport/phpnativeapi/api'; // CHANGE THIS TO YOUR API URL

export const registerUser = async (username, password, email) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      email
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

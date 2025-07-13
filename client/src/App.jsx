import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper
} from "@mui/material";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    userEmail: "",
    location: "",
    familyContact: "",
    message: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const locationName = data.display_name;

            setFormData((prevData) => ({
              ...prevData,
              location: locationName,
              latitude: latitude,
              longitude: longitude
            }));
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error fetching coordinates:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmergencyAlert = async () => {
    try {
      // Removed !formData.message from validation since it's optional
      if (!formData.name || !formData.age || !formData.userEmail || !formData.location || !formData.familyContact) {
        toast.error(
          "Please fill in all the required fields!",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/alert`, formData);
      
      if (response.status === 200) {
        toast.success(
          "Emergency alert sent to your family members!",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      toast.error(
        "Failed to send mail!",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: " #ADD8E6",
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
            <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
              🚨🚑 AlertYou: Emergency Alert App
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4 }}>
              Fill in the details below to send an emergency alert to your family.
            </Typography>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Your Email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Detected Location"
                    name="location"
                    value={formData.location}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Family Contact Email"
                    name="familyContact"
                    value={formData.familyContact}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Optional Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={sendEmergencyAlert}
                    variant="contained"
                    color="info"
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      backgroundColor: "#29b6f7",
                      "&:hover": {
                        backgroundColor: "#0288d1"
                      }
                    }}
                  >
                  Send Emergency Alert Now!!
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default App;

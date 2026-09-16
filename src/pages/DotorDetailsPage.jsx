import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getDoctorById } from "../services/api";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getDoctorById(id)
      .then((res) => {
        setDoctor(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Could not retrieve doctor details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Box py={4}>
        <Alert severity="error">{error || "Doctor not found"}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/doctors")}
          sx={{ mt: 2 }}
        >
          Back to Doctors
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/doctors")}
        sx={{ mb: 3 }}
      >
        Back to Doctors
      </Button>

      <Card elevation={2} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="100%"
              image={doctor.avatar}
              alt={doctor.name}
              sx={{ minHeight: 320, objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={doctor.specialty} color="primary" />
                <Chip
                  icon={<StarIcon sx={{ "&&": { color: "#faaf00" } }} />}
                  label={`${doctor.rating} Rating`}
                  variant="outlined"
                />
                <Chip
                  label={`${doctor.experience} Experience`}
                  variant="outlined"
                />
              </Stack>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {doctor.name}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                {doctor.bio}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Available Working Days:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                {doctor.workingDays.map((day) => (
                  <Chip key={day} label={day} size="small" />
                ))}
              </Stack>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Available Time Slots:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ mb: 4, flexWrap: "wrap" }}
              >
                {doctor.slots.map((slot) => (
                  <Chip
                    key={slot}
                    label={slot}
                    color="info"
                    variant="outlined"
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(`/book/${doctor.id}`)}
              >
                Book Appointment With {doctor.name}
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

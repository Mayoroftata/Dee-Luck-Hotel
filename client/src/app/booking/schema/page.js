import * as yup from "yup";
const match = /^\d{10}$/;

// Get the current date as a static value (avoid dynamic Date objects during prerendering)
const today = new Date().toISOString().split("T")[0]; // e.g., "2025-07-25"

export const bookingSchema = yup.object().shape({
  firstName: yup.string().required("Full name is required"),
  lastName: yup.string().required("Full name is required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  phone: yup.string()
    .matches(match, "Phone number must be 11 digits")
    .required("Phone number is required"),
  arrival: yup
    .date()
    .required("Arrival date is required")
    .min(today, "Arrival date must be today or later")
    .typeError("Arrival date must be a valid date"),
  departure: yup
    .date()
    .required("Departure date is required")
    .min(yup.ref("arrival"), "Departure date must be after arrival")
    .typeError("Departure date must be a valid date"),
});
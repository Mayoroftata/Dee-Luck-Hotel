"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import { bookingSchema } from "./schema/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import { showToast } from "@/lib/Toast"; // assuming you have a toast utility
import { useAuth } from "@/context/AuthContext"; // assuming you have auth context

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      _id
      guestFirstName
        guestLastName
      guestEmail
    }
  }
`;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const { user, isAuthenticated } = useAuth(); // pull from auth context

  const [createBooking, { loading }] = useMutation(CREATE_BOOKING);

    console.log("user", user);
    
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (values, formikHelpers) => {
    try {
      const { data } = await createBooking({
        variables: {
          input: {
            guestFirstName: values.firstName,
            guestLastName: values.lastName,
            guestEmail: values.email,
            room: roomId,
            checkIn: values.arrival,
            checkOut: values.departure,
            specialRequests: "", // you can add a field later
          },
        },
      });

      showToast("Booking successful!", "success");
      formikHelpers.resetForm();
      router.push({
        pathname: "/booking-success",
        query: {
            fullname: values.fullname,
            email: values.email,
            arrival: values.arrival,
            departure: values.departure,
        },
    });
    } catch (error) {
      console.error(error);
      showToast("Booking failed. Try again.", "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
        lastName: "",
      email: "",
      phone: "",
      arrival: "",
      departure: "",
    },
    validationSchema: bookingSchema,
    onSubmit,
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  if (loading) {
    return <div>Loading...</div>; // Or your custom loader
  }

  return (
    <div className="justify-center flex items-center  min-h-screen bg-blue-900">
      <div className="bg-white  w-full max-w-lg mx-6 border border-white/20 shadow rounded">
        <h1 className="text-center text-2xl font-bold text-blue-900 my-3">
          Hotel Booking
        </h1>
        <div className="px-5 pb-5 space-y-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Full Name */}
            <InputField
              label="firstName*"
              name="firstName"
              value={values.firstName}
              error={errors.firstName}
              touched={touched.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <InputField
              label="Last Name*"
              name="lastName"
              value={values.lastName}
              error={errors.lastName}
              touched={touched.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Email */}
            <InputField
              label="Email address*"
              name="email"
              type="email"
              value={values.email}
              error={errors.email}
              touched={touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number*"
              name="phone"
              type="tel"
              value={values.phone}
              error={errors.phone}
              touched={touched.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {/* Dates */}
            <div className="flex space-x-3">
              <InputField
                label="Arrival Date*"
                name="arrival"
                type="date"
                value={values.arrival}
                error={errors.arrival}
                touched={touched.arrival}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <InputField
                label="Departure Date*"
                name="departure"
                type="date"
                value={values.departure}
                error={errors.departure}
                touched={touched.departure}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="font-bold rounded-lg text-white w-full bg-blue-900 py-2 hover:bg-blue-800"
              >
                {loading ? "Booking..." : "Book now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({
  label,
  name,
  type = "text",
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => (
  <div className="w-full">
    <label className="text-blue-900 pb-1 font-medium block" htmlFor={name}>
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`p-1.5 w-full border rounded-lg focus:outline-none ${
        error && touched ? "border-red-500" : "border-gray-300 focus:border-blue-900"
      }`}
    />
    {error && touched && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default Page;

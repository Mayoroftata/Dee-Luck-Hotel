"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import Link from "next/link";
import Image from "next/image";
import { registerSchema } from "@/components/schema/AuthSchema";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";
// import { signIn } from "next-auth/react";
import axios from "axios";

export const dynamic = "force-dynamic"; // Disable prerendering

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Success Toast
  const showSuccessToast = (message) => {
    toast.success(message);
  };
  // Error Toast
  const showErrorToast = (message) => {
    toast.error(message);
  };

  const onSubmit = (values, { resetForm }) => {
    setIsLoading(true);
    console.log("Form submitted", values);

    axios
      .post("http://localhost:5000/api/register", values)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "201") {
          // Adjust to the response format from backend
          showSuccessToast(res.data.message);
          localStorage.setItem("user", JSON.stringify(values));
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else if (res.data.status === "error") {
          // Adjust the backend response
          showErrorToast("User already exists");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          showErrorToast(err.response.data.message);
        } else {
          showErrorToast("Something went wrong");
        }
      });
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registerSchema,
      onSubmit,
    });
    console.log("Form values:", values);
    
  console.log(errors);

  const googleSign = async () => {
    try {
      setIsLoading(true);

      // Trigger Google sign-in
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        setIsLoading(false);
        showErrorToast(result.error || "Google sign-in failed");
        return;
      }

      // Redirect to the dashboard after successful sign-in
      showSuccessToast("Google sign-in successful");
      setTimeout(() => {
        window.location.href = "/Client/ClientDashboard";
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Something went wrong during Google sign-in");
    }
  };

  return (
    <div>
      <div className="justify-center flex items-center  min-h-screen bg-blue-900">
        <div className="bg-white  w-full max-w-lg mx-6 border border-white/20 shadow rounded">
          <h1 className="font-bold ps-4 text-center text-blue-900 my-3 text-2xl">
            Create Account{" "}
          </h1>
          <div className="px-5 pb-5 space-y-2">
            <ToastContainer position="top-right" autoClose={3000} />
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex space-x-3">
                <div className="w-full">
                  <input
                    name="firstName"
                    onBlur={handleBlur}
                    value={values.firstName}
                    onChange={handleChange}
                    className={`p-2 w-full border border-gray-300  rounded-lg focus:outline-none text-black ${
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : "focus:border-blue-900"
                    }`}
                    type="text"
                    placeholder="First name"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    name="lastName"
                    onBlur={handleBlur}
                    value={values.lastName}
                    onChange={handleChange}
                    className={`p-2 w-full border border-gray-300 rounded-lg focus:outline-none text-black ${
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : "focus:border-blue-900"
                    }`}
                    type="text"
                    placeholder="Last name"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <input
                  name="phoneNumber"
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                  onChange={handleChange}
                  className={`p-2 w-full border border-gray-300 rounded-lg focus:outline-none text-black ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : "focus:border-blue-900"
                  }`}
                  type="text"
                  placeholder="Phone Number"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <input
                  name="email"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  className={`p-2 w-full border border-gray-300 rounded-lg focus:outline-none text-black  ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "focus:border-blue-900"
                  }`}
                  type="email"
                  placeholder="Email"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  name="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  className={`p-2 w-full border border-gray-300 rounded-lg focus:outline-none text-black  ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "focus:border-blue-900"
                  }`}
                  type="password"
                  placeholder="password"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  name="confirmPassword"
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className={`p-2 w-full border border-gray-300 rounded-lg focus:outline-none text-black  ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "focus:border-blue-900"
                  }`}
                  type="password"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`font-bold rounded-lg text-white w-full bg-blue-900 py-2 hover:bg-blue-800 ${
                    isLoading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  {isLoading ? (
                    <PulseLoader size={13} color="#fff" />
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>
            <div>
              <p className="text-center pt-2 text-gray-500">
                Have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-900 underline font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <div className="flex items-center space-x-2 my-3">
              <hr className="flex-1 border-gray-300" />
              <p className="text-center text-blue-900"> or with </p>
              <hr className="flex-1 border-gray-300" />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={googleSign}
                type="button"
                className="bg-blue-900 rounded-lg w-1/3 py-1 flex items-center justify-center"
              >
                <Image
                  alt="google"
                  src="/images/google.svg"
                  width={23}
                  height={1}
                />
              </button>
              <button className="bg-blue-900 rounded-lg w-1/3 py-1 flex items-center justify-center">
                <Image
                  alt="google"
                  src="/images/github.svg"
                  width={30}
                  height={1}
                />
              </button>
              <button className="bg-blue-900 rounded-lg w-1/3 py-1 flex items-center justify-center">
                <Image
                  alt="facebook"
                  src="/images/facebook.svg"
                  width={21}
                  height={1}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

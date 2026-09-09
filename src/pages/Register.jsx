import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let didCancel = false;

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.role) {
      setError("Please select a role");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/register`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        },
        { withCredentials: true }
      );

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      let userData = response.data?.user;
      if (!userData) {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/me`, {
          withCredentials: true,
          headers: response.data?.token
            ? { Authorization: `Bearer ${response.data.token}` }
            : {},
        });
        userData = res.data;
      }

      if (!didCancel) {
        dispatch(setUser(userData));
        setSuccess("Registration successful! Redirecting...");

        if (userData?.role === "admin") {
          navigate("/admin");
        } else if (userData?.role === "campaignOwner") {
          navigate("/create");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (!didCancel) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong");
      }
    }

    return () => {
      didCancel = true;
    };
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-green-50 via-white to-green-100"
      style={{ color: "black" }}
    >
      <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-br from-green-100 via-white to-green-200" />

      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-green-100 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-green-800 mb-8 drop-shadow">
          📝 Register for CrowdSpark
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Name
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
              style={{ color: "black" }}
            >
              <option value="">Select Role</option>
              <option value="backer">Backer</option>
              <option value="campaignOwner">Campaign Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/80"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium -mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-sm font-medium -mt-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

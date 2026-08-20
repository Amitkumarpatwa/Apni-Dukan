import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/useAuth";

const AdminLoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    try {
      setError("");
      const response = await authApi.login(values);
      login(response.data.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20 sm:p-7">
      <h1 className="text-2xl font-bold text-white">Admin Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-white outline-none ring-fuchsia-400 placeholder:text-slate-400 focus:ring"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2 text-white outline-none ring-fuchsia-400 placeholder:text-slate-400 focus:ring"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-3 py-2.5 font-semibold text-white transition hover:opacity-90"
          type="submit"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default AdminLoginPage;

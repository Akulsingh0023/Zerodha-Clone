// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:4000/api/auth/login", form);
//       toast.success(res.data.message);
//       localStorage.setItem("token", res.data.token);
//       setForm({ email: "", password: "" });
//       // redirect after login
//    window.location.href = "http://localhost:5174/";

//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container mt-5">
//       <Toaster />
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-5">
//           <div className="card shadow-lg p-5 position-relative">

//             {/* Cross button */}
//             <button
//               className="btn-close position-absolute"
//               style={{ top: "15px", right: "15px" }}
//               onClick={() => navigate("/Dashboard")}
//             ></button>

//             <h2 className="text-center mb-4 text-success">Login</h2>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label fw-bold">Email</label>
//                 <input
//                   type="email"
//                   className="form-control form-control-lg"
//                   placeholder="Enter your email"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-bold">Password</label>
//                 <input
//                   type="password"
//                   className="form-control form-control-lg"
//                   placeholder="Enter your password"
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn-success w-100 btn-lg"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </button>
//             </form>

//             {/* Signup link */}
//             <div className="text-center mt-4">
//               <span>Not registered? </span>
//               <button
//                 className="btn btn-outline-primary btn-sm ms-3"
//                 onClick={() => navigate("/signup")}
//               >
//                 Signup
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        form
      );

      toast.success(res.data.message);
      localStorage.setItem("token", res.data.token);
      setForm({ email: "", password: "" });

      // 🔥 Redirect to Dashboard (Port 5174)
      window.location.href = "http://localhost:5174";

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-5 position-relative">

            {/* Cross button */}
            <button
              className="btn-close position-absolute"
              style={{ top: "15px", right: "15px" }}
              onClick={() => window.location.href = "http://localhost:5174"}
            ></button>

            <h2 className="text-center mb-4 text-success">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="text-end mb-4">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 btn-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              <span>Not registered? </span>
              <button
                className="btn btn-outline-primary btn-sm ms-3"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

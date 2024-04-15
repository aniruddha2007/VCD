// // register.js
// import React, { useState } from "react";
// import axios from "axios";
// import { Navigate } from "react-router-dom";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const isLoggedIn = () => {
//     return !!localStorage.getItem("token");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:3000/auth/register", {
//         username,
//         password,
//       });
//       return <Navigate to="/login" />;
//     } catch (error) {
//       setError("Registration failed");
//     }
//     setLoading(false);
//   };

//   if (isLoggedIn()) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div>
//       <h2>Register</h2>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit" disabled={loading}>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

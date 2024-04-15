// login.js
// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";
// import { Navigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, isLoggedIn } = useAuth();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:3000/auth/login", {
//         username,
//         password,
//       });
//       const token = response.data.token;
//       localStorage.setItem("token", token);
//       login({ username });
//     } catch (error) {
//       setError("Invalid username or password");
//     }
//     setLoading(false);
//   };

//   if (isLoggedIn()) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div>
//       <h2>Login</h2>
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
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

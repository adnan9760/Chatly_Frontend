import { useState } from "react";
import { motion } from "framer-motion";
import { sendOtp, Register, Login } from "../services/operation/authapi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSignupData } from "../Reducer/slices/authSlice";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = isSignUp
        ? { username, email, password, confirmPassword }
        : { email, password };

      if (isSignUp) {
        dispatch(setSignupData(body));
        dispatch(sendOtp(email, navigate));
      } else {
        const res = await dispatch(Login(body));
        console.log("response of login:", res);
        if(res.success){
          navigate('/dashboard');
        }
        else{
          navigate("/signup")
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-72 h-72 bg-white/20 rounded-full top-10 left-10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-96 h-96 bg-pink-400/20 rounded-full bottom-10 right-10 blur-3xl"
      />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
          />
          {isSignUp && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

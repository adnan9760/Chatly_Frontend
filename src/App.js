
import { useEffect, useRef, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import HomePage from "./Pages/Home";
import Dashboard from "./Pages/DashBoadUI";
import VerifyOtpPage from "./Pages/verifyOTP";

export const WebSocketContext = createContext(null);

const WS_URL = "wss://chatappp-3-mr6c.onrender.com";

function App() {
  const socketRef = useRef(null);
  const location = useLocation();

  const authRoutes = ["/signin", "/signup", "/verifyotp"];

  const isAuthRoute = authRoutes.includes(location.pathname);

  useEffect(() => {
    if (!isAuthRoute) {
      const token = localStorage.getItem("token");
      socketRef.current = new WebSocket(`${WS_URL}?token=${token}`);

      socketRef.current.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      socketRef.current.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      socketRef.current.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [isAuthRoute]);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/verifyotp" element={<VerifyOtpPage />} />
      </Routes>
    );
  }

  return (
    <WebSocketContext.Provider value={socketRef}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-friend" element={<Dashboard />} />
      </Routes>
    </WebSocketContext.Provider>
  );
}

export default App;

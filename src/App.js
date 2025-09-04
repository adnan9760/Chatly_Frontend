// App.jsx
import { useEffect, useRef, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import HomePage from "./Pages/Home";
import Dashboard from "./Pages/DashBoadUI";
import VerifyOtpPage from "./Pages/verifyOTP";
import OTPInput from "./Pages/verifyOTP";

export const WebSocketContext = createContext(null);

const WS_URL = "ws://localhost:8080"; 

function App() {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(WS_URL);

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
  }, []);

  return (
    <WebSocketContext.Provider value={socketRef}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-friend" element={<Dashboard />} />
        <Route path="/verifyotp" element={<OTPInput />} />
      </Routes>
    </WebSocketContext.Provider>
  );
}

export default App;

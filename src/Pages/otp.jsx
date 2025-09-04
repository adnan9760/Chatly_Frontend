import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function OTPInput({ length = 6, onSubmit }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < length - 1) {
        inputs.current[index + 1].focus();
      }

      if (newOtp.join("").length === length && !newOtp.includes("")) {
        onSubmit(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (/^[0-9]+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      newOtp.forEach((val, idx) => {
        if (inputs.current[idx]) inputs.current[idx].value = val;
      });
      if (newOtp.length === length) {
        onSubmit(newOtp.join(""));
      }
    }
  };

  return (
    <motion.div
      className="flex justify-center space-x-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onPaste={handlePaste}
    >
      {otp.map((digit, index) => (
        <motion.input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          whileFocus={{ scale: 1.1, borderColor: "#6366f1" }}
          className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl 
                     bg-white shadow-md focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 transition-all"
        />
      ))}
    </motion.div>
  );
}

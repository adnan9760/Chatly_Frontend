import { useState, useRef, useEffect } from 'react';
import { Register } from '../services/operation/authapi';
import { useDispatch } from 'react-redux';
import { setSignupData } from '../Reducer/slices/authSlice';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function OTPInput() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
   const currentSignupData = useSelector((state) => state.auth.signupdata);
  console.log("Curren",currentSignupData);

  useEffect(() => {
    const isOtpComplete = otp.every(digit => digit !== '');
    setIsComplete(isOtpComplete);
    
    if (isOtpComplete) {
      setError('');
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
const otpcode = otp.join('');

console.log("otp",otpcode);

if(otpcode.length === 6){
    const updatedsignupdata = {
        ...currentSignupData,
        otpcode 
    }
    console.log("Data",updatedsignupdata);
    const responce = await dispatch(Register(updatedsignupdata));
 console.log("responcessssssssssss",responce);
    if(responce.data.success){
        navigate('/signin')
    }
    else{
     navigate('/signup')
    }
}
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setIsSuccess(false);
    setError('');
    inputRefs.current[0].focus();
    console.log('OTP resent!');
  };

  const handleClear = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsSuccess(false);
    inputRefs.current[0].focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
            <p className="text-gray-600">Enter the 6-digit code sent to your phone</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex gap-3 justify-center mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                    ${digit 
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:bg-blue-50'
                    }
                    ${error ? 'border-red-500 bg-red-50' : ''}
                    ${isSuccess ? 'border-green-500 bg-green-50 text-green-900' : ''}
                  `}
                  disabled={isVerifying || isSuccess}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center text-red-600 text-sm mb-4 animate-pulse">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-center justify-center text-green-600 text-sm mb-4">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                OTP verified successfully!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleVerify}
              disabled={!isComplete || isVerifying || isSuccess}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center
                ${isComplete && !isVerifying && !isSuccess
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : isSuccess ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleResendOTP}
                disabled={isVerifying}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Resend OTP
              </button>
              
              <button
                onClick={handleClear}
                disabled={isVerifying}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Didn't receive the code? Check your spam folder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
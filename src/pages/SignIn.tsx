// src/pages/SignIn.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // NEW: Import useNavigate
import { signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct
import './Auth.css'; // Ensure this path is correct (for basic styling)

// Extend Window interface to add reCAPTCHA properties
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any; // Consider a more specific type if you import ConfirmationResult
    grecaptcha: any; // Add grecaptcha to window if it's not already there for global access
  }
}


const SignIn: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // NEW: Initialize useNavigate hook

  // Initialize reCAPTCHA on component mount (or when needed)

  
  React.useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log('reCAPTCHA solved');
          // Important: reCAPTCHA callback (for invisible or normal) provides a token, not widgetId directly.
          // This part is generally fine as 'response' is the token.
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
          // Reset reCAPTCHA if it expires.
          // The render() promise resolves with the widget ID (a number).
          // You need to explicitly cast window.recaptchaVerifier if its type doesn't infer render() correctly.
          if (window.grecaptcha && window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then((widgetId: number) => { // CHANGED TO number
              window.grecaptcha.reset(widgetId);
            }).catch(err => console.error("Error resetting recaptcha on expiry:", err));
          }
        }
      });
    }
  }, []);

  // Helper function to redirect after successful authentication
  const handleSuccessfulAuth = () => {
    navigate('/chat'); // Redirect to chat landing page after successful login
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleSuccessfulAuth(); // Redirect
    } catch (err: any) {
      setError(err.message);
      console.error('Google Sign-In Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      // It's good practice to ensure reCAPTCHA is ready/rendered if it's invisible
      // The .render() method returns a Promise<number> (the widget ID)
      const widgetId = await window.recaptchaVerifier.render(); // widgetId is a number
      console.log("reCAPTCHA widget rendered with ID:", widgetId);

      const appVerifier = window.recaptchaVerifier; // Use the RecaptchaVerifier instance
      const phoneNumberWithPrefix = `+91${mobileNumber}`;

      window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumberWithPrefix, appVerifier);
      setOtpSent(true);
      localStorage.setItem('userMobile', mobileNumber);
      alert('OTP sent to your mobile number!');

    } catch (err: any) {
      setError(err.message);
      console.error('Error sending OTP:', err);
      // Reset reCAPTCHA on error to allow retrying
      if (window.grecaptcha && typeof window.recaptchaVerifier.render === 'function') {
        // Here, you might not have the widgetId readily available if render() failed.
        // A safer way to reset *after* an error from signInWithPhoneNumber
        // might be to store the widgetId or re-render to get it.
        // For simplicity, we can try to get the last rendered widget ID if available,
        // or just call reset without a specific ID if reCAPTCHA allows a "general" reset.
        // A more robust solution might be to store the widgetId when .render() succeeds.

        // If .render() itself failed, there's no widgetId to reset.
        // If signInWithPhoneNumber failed *after* a successful render, then you have the widgetId.
        // Let's assume `widgetId` from the `await` above would be available here if `render()` succeeded.
        // If it's a general reCAPTCHA error, you can just re-render to get a new ID.
        try {
            // Get the widgetId again or store it globally after successful render
            const currentWidgetId = await window.recaptchaVerifier.render(); // This might re-render or give existing ID
            window.grecaptcha.reset(currentWidgetId); // Pass the numeric ID
        } catch (resetErr) {
            console.error("Error resetting reCAPTCHA after OTP send failure:", resetErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.confirmationResult) {
        setError('No OTP request was sent. Please send OTP first.');
        return;
      }
      await window.confirmationResult.confirm(otp);
      
      handleSuccessfulAuth(); // Redirect
    } catch (err: any) {
      setError(err.message);
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={(e) => e.preventDefault()} className="auth-form">
        <h2>Sign In</h2>
        <button onClick={handleGoogleSignIn} disabled={loading} className="google-signin-button">
          Sign In with Google
        </button>

        <div className="divider">Or</div>

        <div className="form-group">
          <label htmlFor="mobileSignIn">Mobile Number:</label>
          <input
            type="tel"
            id="mobileSignIn"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="e.g., 9876543210"
            required
            disabled={otpSent}
          />
        </div>

        {!otpSent ? (
          <button onClick={handleSendOtp} disabled={loading} className="auth-button">
            Send OTP
          </button>
        ) : (
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp} disabled={loading} className="auth-button">
              Verify OTP
            </button>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {loading && <p>Loading...</p>}
        <div id="recaptcha-container"></div> {/* reCAPTCHA will render here */}
        <p className="auth-link-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
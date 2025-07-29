// auth.js

// ✅ Initialize Firebase App (add your own config here)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "your_app_id"
};

firebase.initializeApp(firebaseConfig);

// 🔐 Firebase Auth reference
const auth = firebase.auth();

window.onload = () => {
  // Setup reCAPTCHA verifier
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sendOtpBtn', {
    size: 'invisible',
    callback: function(response) {
      // reCAPTCHA solved
      sendOTP();
    }
  });

  // Restore dark mode if saved
  const savedDark = localStorage.getItem("darkMode") === "true";
  if (savedDark) document.body.classList.add("dark-mode");
};

// 📲 Send OTP
function sendOTP() {
  const phoneInput = document.getElementById("phoneInput");
  const phoneNumber = phoneInput.value;

  if (!phoneNumber) {
    alert("Enter a valid phone number.");
    return;
  }

  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      document.getElementById("otpBox").style.display = "flex";
      alert("OTP sent successfully!");
    })
    .catch((error) => {
      console.error("OTP Error:", error);
      alert("Failed to send OTP: " + error.message);
    });
}

// ✅ Verify OTP
function verifyOTP() {
  const code = document.getElementById("otpInput").value;

  if (!code || code.length !== 6) {
    alert("Enter the 6-digit OTP.");
    return;
  }

  window.confirmationResult.confirm(code)
    .then((result) => {
      const user = result.user;
      alert("Login successful!");
      window.location.href = "driverTrack.html";
    })
    .catch((error) => {
      console.error("OTP Verification Error:", error);
      alert("Invalid OTP. Please try again.");
    });
}

// 🔐 Google Sign-In (optional)
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
      window.location.href = "driverTrack.html";
    })
    .catch((error) => {
      console.error("Google Sign-in Error:", error);
      alert("Google sign-in failed.");
    });
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPKgtVq5TlBwVTlyOjwaI1LN0cI-G3HEc",
  authDomain: "web-login-dd17e.firebaseapp.com",
  projectId: "web-login-dd17e",
  storageBucket: "web-login-dd17e.appspot.com", // small typo fixed here too
  messagingSenderId: "600075238312",
  appId: "1:600075238312:web:55ab2a9acaad4e6001fb9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Show message function (uncommented and fixed!)
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create user', 'signUpMessage');
      }
    });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = './dash/dash.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account does not exist', 'signInMessage');
      }
    });
});





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
// import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// // Your web app's Firebase configuration
// // !! IMPORTANT: In a production environment, never expose your API key directly in client-side code.
// // Consider using Firebase Hosting environment variables or a proxy server.
// const firebaseConfig = {
//     apiKey: "AIzaSyCPKgtVq5TlBwVTlyOjwaI1LN0cI-G3HEc",
//     authDomain: "web-login-dd17e.firebaseapp.com",
//     projectId: "web-login-dd17e",
//     storageBucket: "web-login-dd17e.appspot.com",
//     messagingSenderId: "600075238312",
//     appId: "1:600075238312:web:55ab2a9acaad4e6001fb9d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Get references to elements
// const signUpForm = document.getElementById('signup');
// const signInForm = document.getElementById('signIn');
// const signUpButton = document.getElementById('signUpButton');
// const signInButton = document.getElementById('signInButton');
// const submitSignUp = document.getElementById('submitSignUp');
// const submitSignIn = document.getElementById('submitSignIn');

// // Helper function to show messages
// function showMessage(message, divId, isError = false) {
//     const messageDiv = document.getElementById(divId);
//     messageDiv.textContent = message;
//     messageDiv.classList.remove('success', 'error'); // Clean previous states
//     if (isError) {
//         messageDiv.classList.add('error');
//     } else {
//         messageDiv.classList.add('success');
//     }
//     messageDiv.classList.add('show'); // Trigger CSS transition

//     setTimeout(() => {
//         messageDiv.classList.remove('show');
//     }, 5000); // Message disappears after 5 seconds
// }

// // Toggle between sign-up and sign-in forms
// signUpButton.addEventListener('click', () => {
//     signInForm.style.display = 'none';
//     signUpForm.style.display = 'block';
// });

// signInButton.addEventListener('click', () => {
//     signUpForm.style.display = 'none';
//     signInForm.style.display = 'block';
// });

// // Handle Sign Up
// submitSignUp.addEventListener('click', async (event) => {
//     event.preventDefault();
//     const email = document.getElementById('rEmail').value;
//     const password = document.getElementById('rPassword').value;
//     const firstName = document.getElementById('fName').value;
//     const lastName = document.getElementById('lName').value;

//     // Basic client-side validation
//     if (!email || !password || !firstName || !lastName) {
//         showMessage('Please fill in all fields.', 'signUpMessage', true);
//         return;
//     }
//     if (password.length < 6) {
//         showMessage('Password should be at least 6 characters.', 'signUpMessage', true);
//         return;
//     }

//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         const userData = {
//             email: email,
//             firstName: firstName,
//             lastName: lastName,
//             createdAt: new Date() // Add a timestamp for creation
//         };

//         await setDoc(doc(db, "users", user.uid), userData);
//         showMessage('Account created successfully!', 'signUpMessage');
//         // Optionally, redirect after a short delay
//         setTimeout(() => {
//             window.location.href = 'homepage.html'; // Assuming you have a homepage.html
//         }, 1500);

//     } catch (error) {
//         const errorCode = error.code;
//         console.error("Sign Up Error:", error); // Log full error for debugging

//         if (errorCode === 'auth/email-already-in-use') {
//             showMessage('This email address is already in use.', 'signUpMessage', true);
//         } else if (errorCode === 'auth/weak-password') {
//             showMessage('Password is too weak. Please choose a stronger password.', 'signUpMessage', true);
//         } else if (errorCode === 'auth/invalid-email') {
//             showMessage('The email address is not valid.', 'signUpMessage', true);
//         }
//         else {
//             showMessage('Failed to create account. Please try again.', 'signUpMessage', true);
//         }
//     }
// });

// // Handle Sign In
// submitSignIn.addEventListener('click', async (event) => {
//     event.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Basic client-side validation
//     if (!email || !password) {
//         showMessage('Please enter your email and password.', 'signInMessage', true);
//         return;
//     }

//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         localStorage.setItem('loggedInUserId', user.uid); // Store user ID for session management
//         showMessage('Login successful!', 'signInMessage');
//         // Redirect to homepage
//         setTimeout(() => {
//             window.location.href = 'homepage.html';
//         }, 1500);

//     } catch (error) {
//         const errorCode = error.code;
//         console.error("Sign In Error:", error); // Log full error for debugging

//         if (errorCode === 'auth/invalid-credential') {
//             showMessage('Incorrect email or password. Please try again.', 'signInMessage', true);
//         } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
//             // These errors are generally covered by 'invalid-credential' for security reasons by Firebase
//             showMessage('Incorrect email or password. Please try again.', 'signInMessage', true);
//         } else if (errorCode === 'auth/invalid-email') {
//             showMessage('The email address is not valid.', 'signInMessage', true);
//         }
//         else {
//             showMessage('Login failed. Please check your credentials.', 'signInMessage', true);
//         }
//     }
// });

// // Initial state: display sign-in form
// document.addEventListener('DOMContentLoaded', () => {
//     signUpForm.style.display = 'none';
//     signInForm.style.display = 'block';
// });
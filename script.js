// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Register User
document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Registration successful");
      showDashboard();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login User
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful");
      showDashboard();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Logout User
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("Logged out");
    hideDashboard();
  });
});

// Save Personal Data
document.getElementById("savePersonalData").addEventListener("click", () => {
  const user = auth.currentUser;
  const personalData = {
    age: document.getElementById("age").value,
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
  };

  db.collection("users")
    .doc(user.uid)
    .set(
      {
        personalData: personalData,
      },
      { merge: true }
    )
    .then(() => {
      alert("Personal data saved");
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Save Blood Analysis Data
document.getElementById("saveBloodAnalysis").addEventListener("click", () => {
  const user = auth.currentUser;
  const bloodData = {
    erythrocytes: document.getElementById("erythrocytes").value,
    platelets: document.getElementById("platelets").value,
  };

  db.collection("users")
    .doc(user.uid)
    .set(
      {
        bloodAnalysis: bloodData,
      },
      { merge: true }
    )
    .then(() => {
      alert("Blood analysis saved");
      updateStatistics(bloodData);
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Show Dashboard when User is logged in
function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

// Hide Dashboard when User is logged out
function hideDashboard() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}

// Update Health Statistics
function updateStatistics(bloodData) {
  const statsDiv = document.getElementById("statistics");
  statsDiv.innerHTML = `
        <p>Erythrocytes: ${bloodData.erythrocytes} million/µL</p>
        <p>Platelets: ${bloodData.platelets} thousand/µL</p>
    `;
}

// Authentication State Change Listener
auth.onAuthStateChanged((user) => {
  if (user) {
    showDashboard();
  } else {
    hideDashboard();
  }
});

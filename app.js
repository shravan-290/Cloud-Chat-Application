// 🔥 Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyCADgXx2jJK0eeq1qz-d0KsmEONRMU4Gz0",
  authDomain: "cloud-chat-app-6834c.firebaseapp.com",
  databaseURL: "https://cloud-chat-app-6834c-default-rtdb.firebaseio.com",
  projectId: "cloud-chat-app-6834c",
  storageBucket: "cloud-chat-app-6834c.firebasestorage.app",
  messagingSenderId: "713470054699",
  appId: "1:713470054699:web:d5d7baf9aab25755c7356e",
  measurementId: "G-48808VF2QG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      document.getElementById("auth").style.display = "none";
      document.getElementById("chat").style.display = "block";
      document.getElementById("user").innerText = user.email;

      loadMessages();
    })
    .catch((err) => alert(err.message));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      document.getElementById("auth").style.display = "none";
      document.getElementById("chat").style.display = "block";
      document.getElementById("user").innerText = user.email;

      loadMessages();
    })
    .catch((err) => alert(err.message));
}

// LOGOUT
function logout() {
  auth.signOut();
}

// AUTH STATE (auto login handling)
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("chat").style.display = "block";
    document.getElementById("user").innerText = user.email;

    loadMessages();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("chat").style.display = "none";
  }
});

// SEND MESSAGE
function sendMessage() {
  const msg = document.getElementById("message").value;
  const user = auth.currentUser;

  if (!msg) return;

  db.ref("messages").push({
    text: msg,
    sender: user.email,
    time: Date.now()
  });

  document.getElementById("message").value = "";
}

// LOAD MESSAGES (REAL-TIME)
function loadMessages() {
  document.getElementById("messages").innerHTML = ""; // clear old messages

  db.ref("messages").on("child_added", (snapshot) => {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `<b>${data.sender}</b>: ${data.text}`;

    document.getElementById("messages").appendChild(div);
  });
}
// import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAuth, initializeAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { createAsyncStorage } from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// declare const require: any;

// const firebaseConfig = {
//   apiKey: "AIzaSyBvzcF4NmjEH10Jj5SL41cwwSkh5h5A2k",
//   authDomain: "star-kid-feadb.firebaseapp.com",
//   projectId: "star-kid-feadb",
//   storageBucket: "star-kid-feadb.firebasestorage.app",
//   messagingSenderId: "848587052876",
//   appId: "1:848587052876:web:ed50a7933a68780c9aa1e9",
//   measurementId: "G-42K3DFXGKS",
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// const rnAuth = Platform.OS !== "web" ? require("@firebase/auth/dist/rn") : null;
// const authPersistence =
//   Platform.OS !== "web" && rnAuth
//     ? rnAuth.getReactNativePersistence(createAsyncStorage("@star-kid/auth"))
//     : undefined;

// export const auth =
//   Platform.OS === "web"
//     ? getAuth(app)
//     : initializeAuth(app, {
//         persistence: authPersistence,
//       });

// export const db = getFirestore(app);
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvzcF4NmKjEH10Jj5SL41cwwSkh5h5A2k",
  authDomain: "star-kid-feadb.firebaseapp.com",
  projectId: "star-kid-feadb",
  storageBucket: "star-kid-feadb.firebasestorage.app",
  messagingSenderId: "848587052876",
  appId: "1:848587052876:web:ed50a7933a68780c9aa1e9",
  measurementId: "G-42K3DFXGKS",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

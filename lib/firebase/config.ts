import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

declare const require: any;

// const firebaseConfig = {
//   apiKey: "AIzaSyBvzcF4NmKjEH10Jj5SL41cwwSkh5h5A2k",
//   authDomain: "star-kid-feadb.firebaseapp.com",
//   projectId: "star-kid-feadb",
//   storageBucket: "star-kid-feadb.firebasestorage.app",
//   messagingSenderId: "848587052876",
//   appId: "1:848587052876:web:ed50a7933a68780c9aa1e9",
//   measurementId: "G-42K3DFXGKS",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCObUMiqXTbFRamwMeFhGBv5Fn3lIGTPBc",
  authDomain: "starkid-ce96b.firebaseapp.com",
  projectId: "starkid-ce96b",
  storageBucket: "starkid-ce96b.firebasestorage.app",
  messagingSenderId: "299901686200",
  appId: "1:299901686200:web:bd5e3296e1601119b9bf4d",
  measurementId: "G-679HLLTCE3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const rnAuth = Platform.OS !== "web" ? require("@firebase/auth/dist/rn") : null;
const authPersistence =
  Platform.OS !== "web" && rnAuth
    ? rnAuth.getReactNativePersistence(AsyncStorage)
    : undefined;

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: authPersistence,
      });

export const db = getFirestore(app);


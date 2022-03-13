// Functions for working with firebase
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  setPersistence,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { atom } from "recoil";
import { setRecoil } from "recoil-nexus";
const firebaseConfig = {
  apiKey: "AIzaSyAqMW192GdbbKjrouWul_m11IJc_R2TKms",
  authDomain: "flex-manager-7f31e.firebaseapp.com",
  projectId: "flex-manager-7f31e",
  storageBucket: "flex-manager-7f31e.appspot.com",
  messagingSenderId: "240579438113",
  appId: "1:240579438113:web:af575f8a957ae1ebb92560",
  measurementId: "G-F1JMXSQNCZ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const DBState = atom({
  key: "DBState",
  default: true
});
const signInWithGoogle = async (remember) => {
  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );
    setRecoil(DBState, false);
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (!docSnap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    // we've confirmed the database exists
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
  setRecoil(DBState, true);
};
const logInWithEmailAndPassword = async (email, password, remember) => {
  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  setRecoil(DBState, false);
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
  setRecoil(DBState, true);
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const getDefaultClass = async () => {
  const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
  return userDoc.defaultClass;
};

const setDefaultClass = async (classId) => {
  // maybe check if classId is valid first??
  const uid = auth.currentUser.uid;
  await updateDoc(doc(db, "users", uid), {
    defaultClass: classId,
  });
};

let availableClasses = null;

const getAvailableClasses = async () => {
  if (availableClasses == null) {
    availableClasses = [];
    const query = await getDocs(collection(db, "courses"));
    query.forEach((doc) => {
      availableClasses.push(doc);
    });
  }
  return availableClasses;
}

export {
  getAvailableClasses,
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getDefaultClass,
  setDefaultClass,
  DBState,
};

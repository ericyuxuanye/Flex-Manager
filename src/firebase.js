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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  measurementId: "G-F1JMXSQNCZ",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const DBState = atom({
  key: "DBState",
  default: true,
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
  const userDoc = await db.collection("users").doc(auth.currentUser.uid).get();
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
};

const setUserPassword = async (oldPassword, newPassword) => {
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    oldPassword
  );
  try {
    await reauthenticateWithCredential(auth.currentUser, credential);
  } catch (err) {
    alert("Wrong old password");
    console.error(err);
    return;
  }
  try {
    await updatePassword(auth.currentUser, newPassword);
    alert("Password has been reset!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const setUserClasses = async (classes) => {
  const uid = auth.currentUser.uid;
  await updateDoc(doc(db, "users", uid), {
    classes: classes,
  });
  alert("Favorite classes have been updated");
};

const getUserClasses = async () => {
  const classes = (await getDoc(doc(db, "users", auth.currentUser.uid))).data()
    .classes;
  if (classes === undefined) return [];
  return classes;
};

// return a object that maps a date string to a course name
const getSelectedClasses = async () => {
  const uid = auth.currentUser.uid;
  const userDoc = await getDoc(doc(db, "users", uid));
  const courses = userDoc.data().courses;
  return courses === undefined ? {} : courses;
};

const addClassToUser = async (date, course) => {
  const uid = auth.currentUser.uid;
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const dateString = `${year}-${month > 8 ? month + 1 : "0" + (month + 1)}-${
    day > 9 ? day : "0" + day
  }`;
  // I know, this isn't thread safe, but screw that
  const userDoc = await getDoc(doc(db, "users", uid));
  await updateDoc(doc(db, "users", uid), {
    courses: {
      ...userDoc.data().courses,
      [dateString]: course,
    },
  });
};

export {
  addClassToUser,
  getAvailableClasses,
  getSelectedClasses,
  getUserClasses,
  setUserClasses,
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  setUserPassword,
  logout,
  getDefaultClass,
  setDefaultClass,
  DBState,
};

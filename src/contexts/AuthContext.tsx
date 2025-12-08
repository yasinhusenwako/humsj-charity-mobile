import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string) => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      // Update display name
      await updateProfile(userCredential.user, { displayName });
      
      // Store user data in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        role: email === "admin@humsj.edu.et" ? "admin" : "donor",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        totalDonated: 0,
        monthlyDonations: 0,
      });
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user profile exists in Firestore
    if (userCredential.user) {
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user profile if it doesn't exist (for existing auth users)
        await setDoc(userRef, {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || email.split('@')[0],
          role: email === "admin@humsj.edu.et" ? "admin" : "donor",
          status: "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          totalDonated: 0,
          monthlyDonations: 0,
        });
      }
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (result.user) {
      // Check if user exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user profile in Firestore
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || "User",
          role: result.user.email === "admin@humsj.edu.et" ? "admin" : "donor",
          status: "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          totalDonated: 0,
          monthlyDonations: 0,
          photoURL: result.user.photoURL,
        });
      }
    }
  };

  const loginWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithPhone,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { app } from '@/database/firebase';

const auth = getAuth(app);

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const signUp = async (email, password) => {
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
        } catch (error) {
            console.log("error", error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const logOut = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const changePassword = async (password) => {
        setIsLoading(true);
        try {
            await updatePassword(auth.currentUser, password);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return { user, isLoading, isSignedIn: Boolean(user), signIn, signUp, logOut, changePassword, error, setError };
};

export default useAuth;
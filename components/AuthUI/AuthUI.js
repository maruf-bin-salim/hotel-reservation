import useAuth from '@/hooks/useAuth';
import { useState } from 'react';
import styles from './AuthUI.module.css';




const AuthUI = ({ InnerComponent, isAdmin }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('signin');
    const { user, isLoading, signUp, signIn, error, setError } = useAuth();

    const handleEmailChange = (event) => {
        setError(null);
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setError(null);
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (mode === 'signup') {
            await signUp(email, password);
        } else {
            await signIn(email, password);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>Loading...</div>
        );
    }

    if (user) {
        return (
            <InnerComponent user={user} />
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h2>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
                <div className={styles.main}>
                    <input placeholder='E-mail' type="email" value={email} onChange={handleEmailChange} />
                    <input placeholder='password' type="password" value={password} onChange={handlePasswordChange} />
                    <button onClick={handleSubmit}>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</button>
                </div>
                {!isAdmin && error && <p>{error}</p>}
                {isAdmin && error && <p>{"Admin credential is not correct!"}</p>}
                {
                    !isAdmin &&
                    <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
                        {mode === 'signup' ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
                    </button>
                }
            </div>

        </div>
    );
}



export default AuthUI;
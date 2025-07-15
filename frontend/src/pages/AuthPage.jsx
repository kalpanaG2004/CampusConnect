import { useLocation } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

function AuthPage() {
    const location = useLocation();
    const isLogin = location.pathname === "/login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#c9e3b2] px-4 pt-20">
            <div className="bg-[#e2f1d4] p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#3A8F50] mb-0">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>
                {isLogin ? <Login /> : <Signup onSuccess={() => window.location.href = "/login"} />}
                <p className="mt-4 text-sm text-center">
                    {isLogin ? (
                        <>
                            New here?{" "}
                            <a href="/signup" className="text-[#3A8F50] font-semibold hover:underline">
                                Sign Up
                            </a>
                        </>
                    ) : (
                        <>
                            Already registered?{" "}
                            <a href="/login" className="text-[#3A8F50] font-semibold hover:underline">
                                Login
                            </a>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

export default AuthPage;

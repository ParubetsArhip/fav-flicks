import { useState } from "react";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <div className="flex items-center justify-center min-h-screen px-4 cosmic-gradient">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8">
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setMode("login")}
                        className={`px-4 py-2 rounded-full transition ${
                            mode === "login"
                                ? "bg-violet-600 text-white"
                                : "bg-white/20 text-gray-200 hover:bg-white/30"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode("register")}
                        className={`px-4 py-2 rounded-full transition ${
                            mode === "register"
                                ? "bg-green-600 text-white"
                                : "bg-white/20 text-gray-200 hover:bg-white/30"
                        }`}
                    >
                        Register
                    </button>
                </div>

                {mode === "login" ? <Login /> : <Register />}

                <p
                    onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                    }
                    className="mt-6 text-center text-sm text-gray-300 cursor-pointer hover:underline"
                >
                    {mode === "login"
                        ? "Don't have an account? Sign up!"
                        : "Already have an account? Log in!"}
                </p>
            </div>
        </div>
    );
}

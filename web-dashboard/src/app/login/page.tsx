'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scan, LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            setIsLoading(false);
            // Route to dashboard
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 md:p-8 font-sans">

            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col md:flex-row overflow-hidden">

                {/* Left Side: Branding / Visual */}
                <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-950 p-12 w-1/2 relative overflow-hidden">
                    {/* Background Decorative Rings */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-blue-100 mb-8 z-10 hidden">
                        <img src="/logo.svg" alt="BrighterVision Logo" className="w-24 h-24 object-contain" />
                    </div>
                    <div className="bg-white/10 p-6 rounded-[2rem] shadow-2xl backdrop-blur-md border border-white/20 mb-8 z-10">
                        <img src="/logo.svg" alt="BrighterVision Logo" className="w-24 h-24 object-contain brightness-0 invert" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4 z-10 text-center">BrighterVision</h1>
                    <p className="text-blue-200 text-center max-w-md z-10 text-lg">
                        Empowering the visually impaired with intelligent IoT assistance and real-time monitoring.
                    </p>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center bg-white relative">

                    {/* Mobile Logo Fallback */}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-slate-100 mb-4">
                            <img src="/logo.svg" alt="BrighterVision Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">BrighterVision</h1>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Please enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 w-full max-w-sm mx-auto md:mx-0">

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#f4f7fb] hover:bg-slate-100/50"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-[#f4f7fb] hover:bg-slate-100/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="flex-1 bg-white hover:bg-[#f4f7fb] text-slate-800 font-semibold py-3.5 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                onClick={() => alert("QR Scanner opening...")}
                            >
                                <Scan className="w-5 h-5 text-blue-600" />
                                Wait ...
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Signal, Wifi, BatteryFull } from 'lucide-react';
import Link from 'next/link';

export default function PatientProfilePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 md:p-8 font-sans">

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col overflow-hidden relative">

                {/* Dashboard-style Header */}
                <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2.5 bg-[#f4f7fb] text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Patient Profile</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">
                            BrighterVision
                        </span>
                    </div>
                </header>

                <div className="flex-1 flex flex-col md:flex-row p-8 gap-8">

                    {/* Left Column: Photo & Basic Info */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white overflow-hidden bg-[#f4f7fb] mb-6 relative group"
                        >
                            <img
                                src="/patient.jpg"
                                alt="tanawat chuthaphiromporn"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 border-[6px] border-slate-50/20 rounded-full pointer-events-none" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                            <h2 className="text-xl font-bold text-slate-800 mb-4 leading-tight break-words">
                                tanawat<br />chuthaphiromporn
                            </h2>
                            <div className="space-y-3 text-slate-500 font-medium text-sm">
                                <div className="flex justify-between border-b border-[#f4f7fb] pb-2">
                                    <span>Age</span>
                                    <span className="text-slate-900 font-bold">67</span>
                                </div>
                                <div className="flex justify-between border-b border-[#f4f7fb] pb-2">
                                    <span>Blood type</span>
                                    <span className="text-rose-500 font-bold">A</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Gender</span>
                                    <span className="text-slate-900 font-bold">Male</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Notes & Medical Details */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex-1 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />

                            <h3 className="text-lg text-slate-800 font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">📋</span>
                                Medical & Care Notes
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-[#f4f7fb] border border-slate-100">
                                    <p className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Emergency Contact</p>
                                    <p className="text-slate-700 font-medium">(สมมุติว่ามันมีตรงนี้)</p>
                                </div>

                                <div className="p-4 rounded-xl bg-[#f4f7fb] border border-slate-100">
                                    <p className="text-sm text-slate-500 font-semibold mb-2 uppercase tracking-wider text-[10px]">Behavioral & Personal Notes</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium text-sm ml-1">
                                        <li>subscribe to Jetto kid innovator</li>
                                        <li>big brain man</li>
                                        <li>A literal sigma</li>
                                        <li>smart ass</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </div>
    );
}

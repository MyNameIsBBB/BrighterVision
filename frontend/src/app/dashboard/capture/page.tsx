'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mic, RefreshCw, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CapturePage() {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [apiLogs, setApiLogs] = useState<{time: string, message: string}[]>([]);
    
    const addLog = (message: string) => {
        setApiLogs(prev => [{ time: new Date().toLocaleTimeString(), message }, ...prev].slice(0, 50));
    };

    const fetchLatestImage = () => {
        setIsLoading(true);
        // Add timestamp to bypass browser cache
        const timestamp = new Date().getTime();
        const url = `http://localhost:8000/latest-image?t=${timestamp}`;
        setImageSrc(url);
        addLog(`Fetched latest image from API at ${new Date().toLocaleTimeString()}`);
        
        // Simulating the image load timeout just in case it's fast
        setTimeout(() => setIsLoading(false), 500); 
    };

    useEffect(() => {
        fetchLatestImage();
    }, []);

    const sendCommandToHat = async (command: string) => {
        try {
            const res = await fetch('http://localhost:8000/api/hardware/hat/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command }),
            });
            
            const reqData = await res.json();
            console.log("Hardware Command response:", reqData);
            addLog(`POST /hardware/hat/command: ${JSON.stringify(reqData)}`);
            
            if (command === 'TAKE_PHOTO') {
                // Wait a few seconds for hardware to capture and sync, then refresh
                setTimeout(fetchLatestImage, 3000);
            }
            
            // alert(`Command sent: ${command}`);
        } catch (e) {
            console.error(e);
            addLog(`Error sending command: ${command}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 font-sans transition-colors duration-700">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent truncate">
                                Camera Feedback
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">Smart Hat Live Capture & Detection</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={fetchLatestImage}
                        className="flex items-center gap-2 text-sm font-semibold bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
                        Refresh Image
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Viewfinder / Image Section */}
                    <div className="lg:col-span-2 rounded-3xl p-6 md:p-8 flex flex-col bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Camera className="w-6 h-6 text-blue-500" />
                            Latest Capture (Object Detection)
                        </h2>
                        
                        <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-2xl min-h-[400px] border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden relative">
                            {isLoading && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-sm gap-3">
                                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
                                    <p className="font-semibold text-slate-500">Loading Capture...</p>
                                </div>
                            )}
                            
                            {imageSrc && (
                                <img 
                                    src={imageSrc} 
                                    alt="Latest Camera Capture" 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        addLog("No image available from server yet.");
                                        setIsLoading(false);
                                    }}
                                    onLoad={(e) => {
                                        e.currentTarget.style.display = 'block';
                                        setIsLoading(false);
                                    }}
                                />
                            )}

                            {/* Fallback state if image hasn't loaded and not loading */}
                            {!imageSrc && !isLoading && (
                                <div className="flex flex-col items-center text-slate-400 gap-3">
                                    <Camera className="w-12 h-12 opacity-50" />
                                    <p className="font-medium">No Image Found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls & Logs Section */}
                    <div className="space-y-6">
                        
                        {/* Remote Controls */}
                        <div className="rounded-3xl p-6 border bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Interactive Controls
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => sendCommandToHat('TAKE_PHOTO')}
                                    className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all active:scale-[0.98] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400"
                                >
                                    <Camera className="w-5 h-5" />
                                    Capture Surroundings
                                </button>
                                <button
                                    onClick={() => sendCommandToHat('RECORD_AUDIO')}
                                    className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all active:scale-[0.98] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400"
                                >
                                    <Mic className="w-5 h-5" />
                                    Request Audio Feed
                                </button>
                            </div>
                        </div>

                        {/* Logs */}
                        <div className="rounded-3xl p-6 border bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-slate-500" />
                                Action Logs
                            </h2>
                            <div className="space-y-2 h-[260px] flex flex-col-reverse overflow-y-auto bg-[#f4f7fb] dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                                {apiLogs.length === 0 ? (
                                    <div className="text-slate-400 text-center py-4">No activity yet...</div>
                                ) : (
                                    apiLogs.map((log, i) => (
                                        <div key={i} className="flex gap-3 border-b border-slate-200 dark:border-slate-800 pb-1 mt-1">
                                            <span className="text-slate-400 shrink-0">[{log.time}]</span>
                                            <span className="text-blue-600 dark:text-blue-400 break-all">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

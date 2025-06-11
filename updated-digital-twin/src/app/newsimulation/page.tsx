"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function NewSimulation() {
  const router = useRouter();
  const [simName, setSimName] = useState('');
  const [targetPopulation, setTargetPopulation] = useState('26000');
  const [weekLimit, setWeekLimit] = useState('07');
  const [targetTemp, setTargetTemp] = useState('12.8');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunchSimulation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      throw new Error("Failed to initialize simulation. Please check your parameters and try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      return;
    } finally {
      setIsLoading(false);
    }
    
    router.push(`/simulation-results?name=${encodeURIComponent(simName)}&population=${targetPopulation}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8 ml-64"> {}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-white border-b border-gray-700 pb-4">
            Create New Simulation
          </h1>
          
          <div className="flex flex-wrap gap-6">
            {/* Left Column */}
            <div className="flex-1 min-w-[400px]">
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-white">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Simulation Name</label>
                    <input 
                      type="text" 
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter simulation name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Target Population Size</label>
                    <input 
                      type="number" 
                      value={targetPopulation}
                      onChange={(e) => setTargetPopulation(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-white">Initial Population Data</h2>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-gray-300 hover:text-blue-400 flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Drop CSV file here or click to upload</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 min-w-[400px]">
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-6 text-white">Simulation Modes</h2>
                
                <div className="space-y-8">
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-blue-400">Mode 1: Time Limitation (Get rid of later)</h3>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Limitation Week </label>
                      <input 
                        type="text" 
                        value={weekLimit}
                        onChange={(e) => setWeekLimit(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-blue-400">Mode 2: Temperature Control (Get rid of later)</h3>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Target Average Temperature: {targetTemp}°C</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        step="0.1"
                        value={targetTemp}
                        onChange={(e) => setTargetTemp(e.target.value)}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button 
                className="px-8 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className={`px-8 py-3 rounded-lg bg-blue-600 text-white flex items-center justify-center min-w-[160px] ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-500'
                } transition-colors`}
                onClick={handleLaunchSimulation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Loading...
                  </>
                ) : (
                  'Launch Simulation'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from 'react';

export default function NewSimulation() {
  const [simName, setSimName] = useState('');
  const [targetPopulation, setTargetPopulation] = useState('26000');
  const [weekLimit, setWeekLimit] = useState('07');
  const [targetTemp, setTargetTemp] = useState('12.8');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Simulation Information</h1>
      
      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">General</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Simulation Name</label>
          <input 
            type="text" 
            value={simName}
            onChange={(e) => setSimName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Target Population Size</label>
          <input 
            type="number" 
            value={targetPopulation}
            onChange={(e) => setTargetPopulation(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Modes</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-blue-400">MODE 1</h3>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Limitation Week</label>
            <input 
              type="text" 
              value={weekLimit}
              onChange={(e) => setWeekLimit(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-blue-400">MODE 2</h3>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Target Average Temperature: {targetTemp}°C</label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              step="0.1"
              value={targetTemp}
              onChange={(e) => setTargetTemp(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Initial Population Data</h2>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer text-gray-300 hover:text-blue-400">
            Click to add file (CSV only)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          className="px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Launch
        </button>
      </div>
    </div>
  );
}

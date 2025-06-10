"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../page.module.css';

interface CSVData {
  week: string;
  population: string;
}

export default function PreRunSimulations() {
  const router = useRouter();
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  
  useEffect(() => {
    const readCSV = async () => {
      try {
        const response = await fetch('/trial.csv');
        const text = await response.text();
        const rows = text.split('\n');
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            week: values[0],
            population: values[1]
          };
        });

        setCsvData(parsedData);
      } catch (error) {
        console.error('Error reading CSV:', error);
      }
    };

    readCSV();
  }, []);
  
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold mb-6">Pre-Run Simulation Results</h1>

      {/* Age Analysis Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Age vs. Willingness to Change Analysis</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={csvData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="week" 
                stroke="#9CA3AF"
                label={{ value: 'Age', position: 'bottom', fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                label={{ 
                  value: 'Willingness to Change', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#9CA3AF' 
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="population"  
                stroke="#60A5FA" 
                strokeWidth={2}
                dot={{ fill: '#60A5FA' }}
                name="Population"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of other analyses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition`}
          onClick={() => router.push('/pre-run-simulations/age-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Age Impact Analysis</h2>
          <p className="text-gray-300 mb-4">Correlation between age and willingness to change energy providers</p>
          <ul className="list-disc list-inside text-gray-300">
            <li>Age group behavioral patterns</li>
            <li>Generation-specific trends</li>
            <li>Age-related decision factors</li>
          </ul>
        </div>

        <div 
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          onClick={() => router.push('/pre-run-simulations/regional-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Regional Climate Analysis</h2>
          <p className="text-gray-300 mb-4">Impact of climate zones on energy provider switching behavior</p>
          <div className="bg-gray-700 h-40 rounded-lg mb-4">
            {/* Placeholder for preview chart/image */}
          </div>
          <ul className="list-disc list-inside text-gray-300">
            <li>Geographic behavior patterns</li>
            <li>Climate zone correlations</li>
            <li>Regional adoption trends</li>
          </ul>
        </div>

        <div 
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          onClick={() => router.push('/pre-run-simulations/housing-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Housing Status Analysis</h2>
          <p className="text-gray-300 mb-4">Effects of home ownership vs. renting on consumer decisions</p>
          <div className="bg-gray-700 h-40 rounded-lg mb-4">
            {/* Placeholder for preview chart/image */}
          </div>
          <ul className="list-disc list-inside text-gray-300">
            <li>Ownership impact analysis</li>
            <li>Rental market trends</li>
            <li>Property type correlations</li>
          </ul>
        </div>

        <div 
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          onClick={() => router.push('/pre-run-simulations/peak-usage-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Peak Usage Analysis</h2>
          <p className="text-gray-300 mb-4">Consumer behavior during peak vs. off-peak hours</p>
          <div className="bg-gray-700 h-40 rounded-lg mb-4">
            {/* Placeholder for preview chart/image */}
          </div>
          <ul className="list-disc list-inside text-gray-300">
            <li>Time-of-use patterns</li>
            <li>Peak hour behavior</li>
            <li>Usage flexibility analysis</li>
          </ul>
        </div>

        <div 
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          onClick={() => router.push('/pre-run-simulations/occupation-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Occupation Impact</h2>
          <p className="text-gray-300 mb-4">Correlation between occupation and switching behavior</p>
          <div className="bg-gray-700 h-40 rounded-lg mb-4">
            {/* Placeholder for preview chart/image */}
          </div>
          <ul className="list-disc list-inside text-gray-300">
            <li>Work schedule impacts</li>
            <li>Income level correlations</li>
            <li>Industry sector patterns</li>
          </ul>
        </div>

        <div 
          className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          onClick={() => router.push('/pre-run-simulations/stability-analysis')}
        >
          <h2 className="text-xl font-semibold mb-3">Stability Preference Analysis</h2>
          <p className="text-gray-300 mb-4">Impact of stability preferences on provider changes</p>
          <div className="bg-gray-700 h-40 rounded-lg mb-4">
            {/* Placeholder for preview chart/image */}
          </div>
          <ul className="list-disc list-inside text-gray-300">
            <li>Long-term customer behavior</li>
            <li>Price sensitivity patterns</li>
            <li>Service reliability impact</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

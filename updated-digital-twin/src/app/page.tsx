"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from './components/Sidebar';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

interface CSVData {
  week: string;
  population: string;
}

export default function Home() {
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
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Digital Twin Dashboard</h1>
        
        <button 
          className={styles.newSimulationBtn}
          onClick={() => router.push('/newsimulation')}
        >
          New Simulation
        </button>

        <div className={styles.dashboardGrid}>
          <div 
            className={`${styles.dashboardCard} ${styles.clickable}`}
            onClick={() => router.push('/active-simulations')}
          >
            <h2>Active Simulations</h2>
            <p>View and manage your running digital twin simulations</p>
          </div>
          <div 
            className={`${styles.dashboardCard} ${styles.clickable}`}
            onClick={() => router.push('/kepler-visualizations')}
          >
            <h2>Kepler.gl Map Visualizations</h2>
            <p>Explore geospatial data visualization and analysis</p>
          </div>
          <div 
            className={`${styles.dashboardCard} ${styles.clickable}`}
            onClick={() => router.push('/what-if-scenarios')}
          >
            <h2>What-If Scenarios</h2>
            <p>Create and analyze predictive simulation scenarios</p>
          </div>
        </div>

        <div className={styles.simulationsList}>
          <h2 className="text-xl font-semibold mb-4 text-white/90">Energy consumer willlingness to change VS Age </h2>
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
      </main>
    </div>
  );
}

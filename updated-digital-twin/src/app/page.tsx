"use client";
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

interface CSVData {
  week: string;
  population: string;
}

export default function Home() {
  const router = useRouter();
  
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
            onClick={() => router.push('/pre-run-simulations')}
          >
            <h2>Pre-Run Simulations</h2>
            <p>View comprehensive analysis of completed simulation scenarios</p>
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
      </main>
    </div>
  );
}

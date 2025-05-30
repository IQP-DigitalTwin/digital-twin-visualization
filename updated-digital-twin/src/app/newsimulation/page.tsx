"use client";
import { useState } from 'react';
import styles from './newsimulation.module.css';

export default function NewSimulation() {
  const [simName, setSimName] = useState('');
  const [targetPopulation, setTargetPopulation] = useState('26000');
  const [weekLimit, setWeekLimit] = useState('07');
  const [targetTemp, setTargetTemp] = useState('12.8');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Simulation Information</h1>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>General</h2>
        <div className={styles.formGroup}>
          <label>Simulation Name</label>
          <input 
            type="text" 
            value={simName}
            onChange={(e) => setSimName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Target Population Size</label>
          <input 
            type="number" 
            value={targetPopulation}
            onChange={(e) => setTargetPopulation(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Modes</h2>
        <div className={styles.modeSection}>
          <h3 className={styles.modeTitle}>MODE 1</h3>
          <div className={styles.formGroup}>
            <label>Limitation Week</label>
            <input 
              type="text" 
              value={weekLimit}
              onChange={(e) => setWeekLimit(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.modeSection}>
          <h3 className={styles.modeTitle}>MODE 2</h3>
          <div className={styles.formGroup}>
            <label>Target Average Temperature: {targetTemp}°C</label>
            <input 
              type="range" 
              min="0" 
              max="30" 
              step="0.1"
              value={targetTemp}
              onChange={(e) => setTargetTemp(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Initial Population Data</h2>
        <div className={styles.fileUpload}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className={styles.fileUploadText}>Click to add file (CSV only)</p>
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.cancelBtn} onClick={() => window.history.back()}>
          Cancel
        </button>
        <button className={styles.launchBtn}>
          Launch
        </button>
      </div>
    </div>
  );
}

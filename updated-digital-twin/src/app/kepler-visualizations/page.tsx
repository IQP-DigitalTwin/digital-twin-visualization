"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function KeplerVisualizations() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Kepler.gl Map Visualizations</h1>
        <iframe 
          src="/kepler.gl.html"
          style={{
            width: '100%',
            height: 'calc(100vh - 100px)', // Adjust height to account for header
            border: 'none',
            borderRadius: '12px',
            marginTop: '20px'
          }}
        />
      </main>
    </div>
  );
}

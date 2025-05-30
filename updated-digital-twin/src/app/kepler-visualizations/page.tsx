"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function KeplerVisualizations() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Kepler.gl Map Visualizations</h1>
        <div className={styles.comingSoon}>
          <h2>Coming Soon</h2>
          <p>This feature is currently under development. I'm tired, will work some other day...........</p>
        </div>
      </main>
    </div>
  );
}

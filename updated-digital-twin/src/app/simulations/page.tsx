"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function Simulations() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Simulations</h1>
        <div className={styles.comingSoon}>
          <h2>Simulation Center</h2>
          <p>Create and manage your digital twin simulations</p>
        </div>
      </main>
    </div>
  );
}

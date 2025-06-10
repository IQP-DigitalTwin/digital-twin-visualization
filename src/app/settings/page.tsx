"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function Settings() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Settings</h1>
        <div className={styles.comingSoon}>
          <h2>System Settings</h2>
          <p>Configure your digital twin environment</p>
        </div>
      </main>
    </div>
  );
}

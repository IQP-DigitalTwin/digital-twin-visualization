"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function Help() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Help & Support</h1>
        <div className={styles.comingSoon}>
          <h2>Documentation</h2>
          <p>Get help and learn about digital twin features</p>
        </div>
      </main>
    </div>
  );
}

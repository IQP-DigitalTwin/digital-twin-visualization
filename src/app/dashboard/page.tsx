"use client";
import Sidebar from '../components/Sidebar';
import styles from '../page.module.css';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Dashboard Overview</h1>
        <div className={styles.comingSoon}>
          <h2>Dashboard Features</h2>
          <p>Overview and quick access to key digital twin features</p>
        </div>
      </main>
    </div>
  );
}

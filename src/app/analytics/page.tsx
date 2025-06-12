"use client";
import Sidebar from "../../components/Sidebar";
import styles from "../page.module.css";

export default function Analytics() {
	return (
		<div className={styles.container}>
			<Sidebar />
			<main className={styles.mainContent}>
				<h1>Analytics</h1>
				<div className={styles.comingSoon}>
					<h2>Data Analytics</h2>
					<p>Analyze and visualize your digital twin data</p>
				</div>
			</main>
		</div>
	);
}

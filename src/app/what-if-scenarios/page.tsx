"use client";
import Sidebar from "../../components/Sidebar";
import styles from "../page.module.css";

export default function WhatIfScenarios() {
	return (
		<div className={styles.container}>
			<Sidebar />
			<main className={styles.mainContent}>
				<h1>What-If Scenarios</h1>
				<div className={styles.comingSoon}>
					<h2>Coming Soon</h2>
					<p>
						This feature is currently under development. Lets
						see......
					</p>
				</div>
			</main>
		</div>
	);
}

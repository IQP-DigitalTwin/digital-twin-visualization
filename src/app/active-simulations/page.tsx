"use client";
import Sidebar from "../../components/Sidebar";
import styles from "../page.module.css";

export default function ActiveSimulations() {
	const dummySimulations = [{ id: 1 }, { id: 2 }, { id: 3 }];

	return (
		<div className={styles.container}>
			<Sidebar />
			<main className={styles.mainContent}>
				<h1>Active Simulations</h1>
				<div className={styles.simulationsList}>
					<div className={styles.simulationHeader}>
						<div>Simulation ID</div>
						<div>Status</div>
						<div>Actions</div>
					</div>
					{dummySimulations.map((sim) => (
						<div key={sim.id} className={styles.simulationRow}>
							<div>Simulation #{sim.id}</div>
							<div>Pending</div>
							<button
								className={styles.detailButton}
								onClick={() =>
									alert("Details feature coming soon!")
								}
							>
								View Details
							</button>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}

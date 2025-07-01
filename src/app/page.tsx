import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {

	return (
		<div className="flex min-h-full">
			<main className={styles.mainContent}>
				<h1>Digital Twin Dashboard</h1>
				<Link
					className={styles.newSimulationBtn}
					href={"/newsimulation"}
				>
					New Simulation
				</Link>

				<div className={styles.dashboardGrid}>
                    <Link
                        href="/active-simulations"
                        className={`${styles.dashboardCard} ${styles.clickable}`}
                    >
                        <h2>Active Simulations</h2>
                        <p>
                            View and manage your running digital twin
                            simulations
                        </p>
                    </Link>
                    <Link
                        href="/pre-run-simulations"
                        className={`${styles.dashboardCard} ${styles.clickable}`}
                    >
                        <h2>Pre-Run Simulations</h2>
                        <p>
                            View comprehensive analysis of completed simulation
                            scenarios
                        </p>
                    </Link>
                    <Link
                        href="/map-visualization"
                        className={`${styles.dashboardCard} ${styles.clickable}`}
                    >
                        <h2>Map Visualizations</h2>
                        <p>
                            Explore geospatial data visualization and analysis
                        </p>
                    </Link>
                    <Link
                        href="/what-if-scenarios"
                        className={`${styles.dashboardCard} ${styles.clickable}`}
                    >
                        <h2>What-If Scenarios</h2>
                        <p>
                            Create and analyze predictive simulation scenarios
                        </p>
                    </Link>
				</div>
			</main>
		</div>
	);
}

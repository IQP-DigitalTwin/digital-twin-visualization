
export function getRandomWorkersUrls(): string {
	if (!process.env.JUMO_WORKERS_URLS) {
		throw new Error("Missing JUMO_WORKERS_URLS environnement variable");
	}

	const JUMO_WORKERS_URLS_ARRAY = process.env.JUMO_WORKERS_URLS?.split(",");
	return JUMO_WORKERS_URLS_ARRAY.map((JUMO_WORKER_URL) =>
		JUMO_WORKER_URL.trim()
	)[Math.floor(Math.random() * JUMO_WORKERS_URLS_ARRAY.length)];
}

export function getHostUrl(): string {
	if (!process.env.HOST_URL) {
		throw new Error("Missing HOST environnement variable");
	}

	return process.env.HOST_URL;
}
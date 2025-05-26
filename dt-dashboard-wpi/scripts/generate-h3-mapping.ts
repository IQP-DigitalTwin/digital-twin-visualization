import geojson2h3 from "geojson2h3";
import { FeatureCollection } from "geojson";
import path from "path";
import * as fs from "fs";
import departements from "../public/files/geo/departements.json";
const readPath = path.join(__dirname, "../public/files/geo/departements/");
const resultPath = path.join(
	__dirname,
	"../public/files/geo/h3-by-department.json",
);
const h3IndexesPath = path.join(
	__dirname,
	"../public/files/geo/h3-indexes.json",
);

interface TypeList {
	[key: string]: FeatureCollection; // adjusting require this in order to some json data type
}

function getAllDepartementsJson(): TypeList {
	const fileNames = fs
		.readdirSync(readPath)
		.filter((file) => file.match(/\.json$/));
	const typeList: TypeList = {};

	fileNames.forEach((fileName: string) => {
		let typeName = fileName.match(/(^.*?)\.json/);
		if (typeName) {
			typeList[typeName[1]] = JSON.parse(
				fs.readFileSync(readPath + fileName, "utf8").toString(),
			);
		}
	});
	return typeList;
}

const result: Record<string, string[]> = {};
const geoJsonDepartements = getAllDepartementsJson();
for (const dep in geoJsonDepartements) {
	const geojson = geoJsonDepartements[dep];
	result[dep] = geojson2h3.featureToH3Set(geojson, 4, { ensureOutput: true });
}

// @ts-ignore
// We are merging Corsica in 20 department number
result["20"] = [...new Set([...result["2A"], ...result["2B"]])];

const h3Indexes = geojson2h3.featureToH3Set(
	departements as FeatureCollection,
	4,
);

fs.writeFile(h3IndexesPath, JSON.stringify(h3Indexes, null, 2), (err) => {
	if (err) throw err;
	console.log("Data written to file : ", h3IndexesPath);
});

fs.writeFile(resultPath, JSON.stringify(result, null, 2), (err) => {
	if (err) throw err;
	console.log("Data written to file : ", resultPath);
});

import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";


export const metadata: Metadata = {
	title: "Digital Twin Dashbord",
	description: "Digital twin for energy market simulation",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
                <Navbar/>
                <div className="flex min-h-full justify-center items-center grow px-20">
                    {children}
                </div>
			</body>
		</html>
	);
}

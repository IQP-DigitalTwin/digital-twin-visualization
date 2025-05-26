"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import useSimulations from "@/hooks/useSimulations";
import SimulationsContext from "@/hooks/contexts/SimulationsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);
  const [
    simulations,
    {
      setSimulations,
      fetchSimulations,
      startSimulationsUpdateLoop,
      stopSimulationsUpdateLoop,
    },
  ] = useSimulations();

  useEffect(() => {
    fetchSimulations().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const id = startSimulationsUpdateLoop();
      return () => stopSimulationsUpdateLoop(id);
    }
  }, [loading]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SimulationsContext.Provider value={[simulations, setSimulations]}>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </SimulationsContext.Provider>
      </body>
    </html>
  );
}

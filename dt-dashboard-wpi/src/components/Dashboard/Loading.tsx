"use client";
import Lottie from "react-lottie";
import * as animationData from "../../../public/images/animations/eolienne.json";

export default function Loading({
  status,
  message,
}: {
  status?: string;
  message?: string;
}) {
  return (
    <div style={{ position: "relative", top: "70px" }}>
      <Lottie
        options={{
          loop: true,
          animationData,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={250}
        width={400}
        style={{
          position: "relative",
          top: "-25px",
        }}
      />
      <div className="text-center text-xl font-bold text-primary">
        <span className="rounded-xl bg-white p-12">
          {message || status || "En cours de chargement..."}
        </span>
      </div>
    </div>
  );
}

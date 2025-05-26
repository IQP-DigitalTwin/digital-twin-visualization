"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <button
        className="hover:bg-primary-hover flex justify-center rounded-full bg-primary px-6 py-2 font-medium text-gray"
        type="submit"
        onClick={() => router.push("/simulations/create")}
      >
        Créer une nouvelle simulation
      </button>
    </>
  );
}

import { Weather } from "@/types/Weather";
import { createContext } from "react";

export default createContext<Weather | null>(null);

import { Menu } from "lucide-react";
import Link from "next/link";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="fixed z-50 top-5 left-5 p-5 shadow-md">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader className="">
                    <SheetTitle>Digital Twins</SheetTitle>
                    <Link className="text-3xl flex flex-row" href={"/"}>
                        {/* <div className="p-1">
                            <Home />
                        </div>  */}
                        <div className="">
                            Home
                        </div>
                    </Link>
                    <Link className="text-3xl" href={"/simulations"}>Simulations</Link>
                    {/* <Link className="text-3xl" href={"/about"}>About</Link> */}
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}

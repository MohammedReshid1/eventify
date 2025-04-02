
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export function NavbarLogo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-[#F97316] flex items-center justify-center">
        <Ticket className="h-5 w-5 text-white" />
      </div>
      <span className="text-2xl font-bold text-[#F97316]">Eventify</span>
    </Link>
  );
}

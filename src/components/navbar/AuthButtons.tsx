
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface AuthButtonsProps {
  onCloseMenu?: () => void;
}

export function AuthButtons({ onCloseMenu }: AuthButtonsProps) {
  return (
    <>
      <ThemeToggle />
      <Link to="/auth" onClick={onCloseMenu}>
        <Button className="bg-[#F97316] hover:bg-[#FB923C] text-white">
          Sign In
        </Button>
      </Link>
    </>
  );
}

import { Link } from "react-router-dom";

interface NavLinksProps {
  user: any;
  onCloseMenu?: () => void;
}

export function NavLinks({ user, onCloseMenu }: NavLinksProps) {
  const handleClick = () => {
    if (onCloseMenu) {
      onCloseMenu();
    }
  };

  return (
    <>
      <Link 
        to="/events"
        className="text-muted-foreground hover:text-foreground"
        onClick={handleClick}
      >
        Explore Events
      </Link>
      {user && (
        <Link 
          to="/my-tickets"
          className="text-muted-foreground hover:text-foreground"
          onClick={handleClick}
        >
          My Tickets
        </Link>
      )}
      <Link 
        to="/contact"
        className="text-muted-foreground hover:text-foreground"
        onClick={handleClick}
      >
        Contact Us
      </Link>
    </>
  );
}

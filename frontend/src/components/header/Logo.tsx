import { Link } from "react-router-dom";
import logo from "@/assets/kizmart-logo-bg-removed.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <img
        src={logo}
        alt="KizMart"
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;

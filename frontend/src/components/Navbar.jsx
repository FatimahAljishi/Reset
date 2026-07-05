import "./Navbar.css";
import logo from "../assets/reset-logo-transparent.png";
import { HiOutlineBars3 } from "react-icons/hi2";

export default function Navbar() {
  return (
    <header className="navbar">
      <img src={logo} alt="Reset" className="logo" />

      <button className="menu-btn">
        <HiOutlineBars3 />
      </button>

      <nav className="desktop-nav">
        <a href="/">Home</a>
        <a href="/">Plans</a>
        <a href="/">Training</a>
        <a href="/">Classes</a>
        <a href="/">About</a>

        <button>Book Session</button>
      </nav>
    </header>
  );
}

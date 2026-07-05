import "./Hero.css";
import heroArt from "../assets/hero-art.png";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Move.
          <br />
          Nourish.
          <br />
          Balance.
          <br />
          <span>Reset.</span>
        </h1>

        <p>Personal training and ready workout plans designed for you.</p>

        <div className="hero-buttons">
          <button className="primary-btn">Explore Plans</button>
          <button className="secondary-btn">Book a Session</button>
        </div>
      </div>

      <img src={heroArt} alt="" className="hero-art" />
    </section>
  );
}

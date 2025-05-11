import background from "../assets/bkg.jpg";
import "./Hero.css";

const Hero = () => {
    return (
        <div className="hero">
            <img src={background} alt="lots of movies" />
            <div className="hero-content">
                <h1>
                The number 1 streaming site of all time</h1>
                <p>FREE content from services like Disney+, Netflix, etc.</p>
                <button className="subscribe-button">Subcribe to get premium streaming, no pop-up with viruses and more! Plans starting at $6.99</button>
            </div>.
        </div>
    )
}

export default Hero;
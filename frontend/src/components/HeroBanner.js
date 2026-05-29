function HeroBanner({ movie }) {
  return (
    <div className="hero" style={{ backgroundImage: `url(${movie.banner})` }}>
      <div className="hero-content">
        <h1>{movie.title}</h1>

        <p>{movie.description}</p>
      </div>
    </div>
  );
}

export default HeroBanner;

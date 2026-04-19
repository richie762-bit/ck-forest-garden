const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/gallery/Overhead.jpg"
          alt="CK Forest Gardens from above — 60 acres of lush tropical forest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container-custom text-center py-32 md:py-40">
        <span className="inline-block text-xs md:text-sm uppercase tracking-widest text-primary-300 font-semibold mb-6 animate-fade-in">
          Guyana's Hidden Forest Retreat
        </span>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 max-w-5xl mx-auto">
          Come as you are.{' '}
          <span className="text-primary-400">Leave refreshed.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
          Sixty acres of living forest in the heart of Guyana. Wander among 30 varieties
          of tropical fruit, cool off in the stream, gather around a fire, and let the
          outside world wait.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://ckforesttours.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-10 py-4 text-lg"
          >
            Plan a Visit
          </a>
          <a
            href="#volunteer"
            className="btn btn-outline-white px-10 py-4 text-lg"
          >
            Volunteer With Us
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-3 max-w-sm mx-auto md:max-w-lg">
          <div className="py-4 px-2">
            <div className="text-3xl md:text-4xl font-bold text-white">60</div>
            <div className="text-xs md:text-sm text-white/65 mt-1">Acres of Forest</div>
          </div>
          <div className="py-4 px-2 border-x border-white/25">
            <div className="text-3xl md:text-4xl font-bold text-white">30+</div>
            <div className="text-xs md:text-sm text-white/65 mt-1">Tropical Fruits</div>
          </div>
          <div className="py-4 px-2">
            <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
            <div className="text-xs md:text-sm text-white/65 mt-1">Happy Visitors</div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      {/* Bottom info strip — desktop only */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 hidden lg:block">
        <div className="container-custom py-4">
          <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
            <div className="px-6 py-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Location</p>
              <p className="text-white text-sm font-medium mt-0.5">Linden-Soesdyke Highway, Guyana</p>
            </div>
            <div className="px-6 py-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Groups</p>
              <p className="text-white text-sm font-medium mt-0.5">10+ Adults Welcome</p>
            </div>
            <div className="px-6 py-2">
              <p className="text-white/60 text-xs uppercase tracking-wider">Book via</p>
              <p className="text-white text-sm font-medium mt-0.5">ckforesttours.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

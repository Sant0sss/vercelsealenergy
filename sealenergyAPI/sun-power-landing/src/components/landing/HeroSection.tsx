import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[70vh] flex items-center overflow-hidden">
    <img src={heroBg} alt="Turbinas eólicas ao pôr do sol" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 gradient-hero" />
    <div className="absolute inset-0 bg-grid opacity-20" />
    <div className="container relative z-10 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Energy Intelligence Redefined</p>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground mb-6">
          Economize até{" "}
          <span className="text-gradient">24%</span> na sua tarifa de energia.
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Energia renovável com economia real para o seu negócio. Sem obras, sem investimento, sem burocracia.
        </p>
        <a href="#calculadora" className="inline-flex items-center px-8 py-3.5 rounded-lg gradient-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity shadow-glow">
          Simule sua economia
        </a>
      </div>
    </div>
  </section>
);

export default HeroSection;

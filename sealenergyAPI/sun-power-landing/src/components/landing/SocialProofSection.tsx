import { useFadeIn } from "@/hooks/useFadeIn";
import partnersLogos from "@/assets/partners-logos.png";

const SocialProofSection = () => {
  const ref = useFadeIn();
  return (
    <section id="empresas" className="py-10 px-6">
      <div ref={ref} className="fade-in-section max-w-7xl mx-auto">
        <div className="text-center text-primary-foreground">
          <h2 className="text-[24px] md:text-[64px] leading-tight drop-shadow-sm">
            <span className="block font-light">EMPRESAS QUE RECEBEM</span>
            <span className="block font-bold mt-2">A NOSSA ENERGIA</span>
          </h2>
        </div>
        <div className="mt-10">
          <img
            src={partnersLogos}
            alt="Empresas parceiras: BTG Pactual, Rentcars, Cresol, Ligga, Ademicon, Laguna, ParanáBanco, Hambre e mais de 100 empresas"
            className="w-full max-w-5xl mx-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;

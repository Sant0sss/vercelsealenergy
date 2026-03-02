import { useFadeIn } from "@/hooks/useFadeIn";
import { Zap } from "lucide-react";

const AboutSection = () => {
  const ref = useFadeIn();
  return (
    <section id="sobre" className="py-20 md:py-28">
      <div ref={ref} className="container fade-in-section">
        <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-8 md:p-14 shadow-2xl border border-white/10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left: big headline + badge */}
          <div className="flex flex-col gap-10">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              A Seal Energy conecta sua empresa{" "}
              à Gedisa, solução que entrega{" "}
              <span className="text-gradient font-bold">
                energia renovável com economia
              </span>{" "}
              para o seu negócio.
            </h2>

            {/* Divider */}
            <div className="w-16 h-px bg-primary" />

            {/* Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                Nossa ligação com a energia{" "}
                <span className="font-bold text-foreground">não é de hoje</span>
              </p>
            </div>
          </div>

          {/* Right: descriptive paragraphs */}
          <div className="space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg">
            <p>
              A Geração Distribuída é um novo jeito de consumir energia elétrica.
              Nela, a energia é produzida em usinas de fontes renováveis — como
              solar, eólica ou biomassa — e enviada para a rede da distribuidora.{" "}
              <strong className="text-foreground">
                Essa energia vira créditos que são usados para abater o valor da
                sua conta de luz.
              </strong>
            </p>
            <p>
              Ou seja: você continua recebendo energia pela mesma rede, mas paga
              bem menos por ela. Na Gedisa, esse processo é 100% digital, sem
              necessidade de obras ou instalação de painéis solares. A Gedisa
              oferece uma solução simples e sustentável para você economizar
              direto na sua tarifa de luz.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

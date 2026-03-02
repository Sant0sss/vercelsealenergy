import { Zap, Building2, Sun, Lightbulb, Users, BarChart3 } from "lucide-react";
import { useFadeIn } from "@/hooks/useFadeIn";

const steps = [
  {
    icon: Building2,
    title: "Contratação de Usinas",
    desc: "A Gedisa aluga usinas de energia renovável de diferentes fontes para garantir a oferta de energia limpa.",
  },
  {
    icon: Sun,
    title: "Geração de Energia",
    desc: "As usinas geram energia e a enviam para a distribuidora local, que a transforma em créditos de consumo.",
  },
  {
    icon: Lightbulb,
    title: "Gestão Inteligente de Créditos",
    desc: "A plataforma da Gedisa analisa o consumo dos clientes e informa à distribuidora a quantidade ideal de créditos que cada um deve receber.",
  },
  {
    icon: Users,
    title: "Energia para os Consumidores",
    desc: "A distribuidora aplica os créditos informados pela Gedisa diretamente na fatura do cliente, na forma de desconto.",
  },
  {
    icon: BarChart3,
    title: "Economia Sustentável",
    desc: "O cliente recebe energia de fontes renováveis, (como usinas eólicas, solares e biomassa), com economia garantida de até 24%.",
  },
];

const HowItWorksSection = () => {
  const ref = useFadeIn();

  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-grid">
      <div ref={ref} className="container fade-in-section">
        <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10">

          {/* Title */}
          <h2 className="font-heading text-2xl md:text-3xl text-foreground text-center mb-12 leading-snug">
            Como a Geração Distribuída da Gedisa
            <br />
            <span className="font-bold">garante energia limpa para você.</span>
          </h2>

          {/*
            Grid 3 cols × 2 rows:
            Row 1: [Orange card] [Step 1] [Step 2]
            Row 2: [Step 3]      [Step 4] [Step 5]
            No row-span — orange naturally taller due to content.
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Orange main card — row 1 col 1 */}
            <div className="gradient-primary rounded-2xl p-8 flex flex-col justify-between border border-primary/30 shadow-glow">
              <p className="text-primary-foreground text-base leading-relaxed mb-8">
                A Gedisa Energia é uma plataforma que conecta pequenos{" "}
                <strong>produtores de energia limpa a consumidores em grandes centros.</strong>
              </p>
              <a
                href="#calculadora"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity self-start"
              >
                Contrate agora
              </a>
            </div>

            {/* Steps 1 & 2 — row 1, cols 2-3 */}
            {steps.slice(0, 2).map((s) => (
              <div
                key={s.title}
                className="gradient-card rounded-xl border border-border p-8 shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-300 flex flex-col gap-4 min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
              </div>
            ))}

            {/* Steps 3, 4, 5 — row 2, all 3 cols */}
            {steps.slice(2).map((s) => (
              <div
                key={s.title}
                className="gradient-card rounded-xl border border-border p-8 shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-300 flex flex-col gap-4 min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

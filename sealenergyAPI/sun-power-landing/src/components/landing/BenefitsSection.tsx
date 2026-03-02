import { TrendingDown, ShieldCheck, Ban, Leaf } from "lucide-react";
import { useFadeIn } from "@/hooks/useFadeIn";

const benefits = [
  {
    icon: TrendingDown,
    title: "Economia na tarifa",
    desc: "Desconto garantido de 15% na tarifa de energia, podendo chegar até 24% na bandeira tarifária vermelha.",
  },
  {
    icon: ShieldCheck,
    title: "Não precisa de painel solar",
    desc: "A energia da Gedisa chega pela rede da distribuidora, sem a necessidade de investimento ou obras na sua residência ou empresa.",
  },
  {
    icon: Ban,
    title: "Cancelamento sem multa",
    desc: "Sem vínculo por fidelidade ou cobrança de multas caso você queira cancelar.",
  },
  {
    icon: Leaf,
    title: "Energia limpa e renovável",
    desc: "Economize e ainda ajude a reduzir as emissões de gases de efeito estufa.",
  },
];

const BenefitsSection = () => {
  const ref = useFadeIn();
  return (
    <section id="beneficios" className="py-20 md:py-28">
      <div ref={ref} className="container fade-in-section">
        <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10">

          {/* Title — left aligned, two lines */}
          <h2 className="font-heading text-2xl md:text-3xl text-foreground text-left mb-12 leading-snug">
            Confira os benefícios
            <br />
            <span className="font-bold">da Geração Distribuída.</span>
          </h2>

          {/* 4-col card grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="gradient-card rounded-xl border border-border p-7 shadow-card hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow transition-all duration-300 flex flex-col min-h-[280px]"
              >
                {/* Icon area */}
                <div className="mb-5">
                  <b.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-border mb-5" />

                {/* Text */}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="font-heading text-base font-bold text-foreground leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

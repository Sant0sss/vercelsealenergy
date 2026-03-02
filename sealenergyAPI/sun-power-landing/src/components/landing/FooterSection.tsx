import { Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import sealLogo from "@/assets/seal-logo.png";

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
  { icon: Facebook, label: "Facebook" },
];

const FooterSection = () => (
  <footer className="py-16 md:py-20 border-t border-primary/30">
    <div className="container grid md:grid-cols-2 gap-12 items-start">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <img src={sealLogo} alt="Seal Energy" className="w-8 h-8 rounded-md" />
          <span className="font-heading text-lg text-primary-foreground tracking-wide">SEAL ENERGY</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl text-primary-foreground leading-tight mb-6">
          Energia que faz bem para você, para os negócios e para o planeta
        </h2>
        <a href="#calculadora" className="inline-flex items-center px-8 py-3.5 rounded-lg bg-primary-foreground text-primary font-bold text-sm hover:opacity-90 transition-opacity">
          Contrate agora
        </a>
        <p className="mt-8 text-xs text-primary-foreground/50 max-w-md leading-relaxed">
          A Seal Energy atua como intermediadora entre consumidores e usinas de geração distribuída de energia renovável. CNPJ 00.000.000/0001-00. Todos os direitos reservados.
        </p>
      </div>
      <div className="flex flex-col items-start md:items-end gap-6">
        <p className="text-sm text-primary-foreground/80 font-medium">Acompanhe nossas redes sociais</p>
        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className="w-10 h-10 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <s.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-xs text-primary-foreground/40 mt-auto">© 2026 Seal Energy. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default FooterSection;

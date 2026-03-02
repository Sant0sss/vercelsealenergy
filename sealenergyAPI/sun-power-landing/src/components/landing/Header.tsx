import { Menu, X } from "lucide-react";
import { useState } from "react";
import sealLogo from "@/assets/seal-logo.png";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={sealLogo} alt="Seal Energy" className="w-8 h-8 rounded-md" />
          <span className="font-heading text-lg text-foreground tracking-wide">SEAL ENERGY</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
          <a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a>
          <a href="#empresas" className="hover:text-primary transition-colors">Empresas</a>
        </nav>
        <a href="#calculadora" className="hidden md:inline-flex items-center px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow">
          Quero economizar
        </a>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
          <a href="#sobre" className="text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Sobre</a>
          <a href="#beneficios" className="text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Benefícios</a>
          <a href="#como-funciona" className="text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Como Funciona</a>
          <a href="#empresas" className="text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Empresas</a>
          <a href="#calculadora" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm" onClick={() => setOpen(false)}>
            Quero economizar
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;

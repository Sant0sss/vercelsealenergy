import { Play } from "lucide-react";
import { useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";



const VideoFAQSection = () => {
  const ref = useFadeIn();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="py-20 md:py-28">
        <div ref={ref} className="container fade-in-section">
          <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10 grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
                Tem dúvidas sobre como funciona a{" "}
                <span className="text-gradient font-bold">Geração Distribuída?</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
                Ao lado, você encontra respostas para as perguntas mais comuns —
                de forma simples, rápida e na hora que quiser.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-3 text-foreground font-semibold text-base hover:text-primary transition-colors duration-300 group"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40 group-hover:bg-primary/40 transition-all duration-300">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </span>
                <span>
                  <strong className="block">Clique para assistir</strong>
                  <span className="text-muted-foreground font-normal text-sm">
                    e descubra como é fácil economizar com a Gedisa.
                  </span>
                </span>
              </button>
            </div>

            {/* Right: Video + FAQ pills */}
            <div className="flex flex-col items-center gap-4">
              {/* Video card */}
              <div className="relative w-full max-w-[300px] mx-auto">
                <div className="bg-card rounded-3xl p-3 shadow-elevated border border-border">
                  <div className="rounded-2xl aspect-[9/16] overflow-hidden relative group cursor-pointer" onClick={() => setShowModal(true)}>
                    <iframe
                      src="https://www.youtube.com/embed/z8SRLfv7WRQ"
                      title="Gedisa Responde - Vídeo explicativo"
                      className="w-full h-full rounded-2xl pointer-events-none"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    {/* Overlay play button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card rounded-2xl p-2 max-w-sm w-full mx-4 shadow-elevated border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[9/16] rounded-xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/z8SRLfv7WRQ?autoplay=1"
                title="Gedisa Responde - Vídeo explicativo"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 w-full py-2.5 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoFAQSection;

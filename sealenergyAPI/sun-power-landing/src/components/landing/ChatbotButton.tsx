import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const ChatbotButton = () => {
  const [showBubble, setShowBubble] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showBubble && (
        <div className="bg-card rounded-xl shadow-elevated p-4 max-w-[240px] relative border border-border animate-[fade-in_0.3s_ease-out]">
          <button onClick={() => setShowBubble(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-sm text-foreground pr-4">
            Olá! Sou o assistente virtual. Como posso lhe ajudar?
          </p>
        </div>
      )}
      <button className="w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-glow flex items-center justify-center hover:opacity-90 transition-opacity animate-pulse-ring">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatbotButton;

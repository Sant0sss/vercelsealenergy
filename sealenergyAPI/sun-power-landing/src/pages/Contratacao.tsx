import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

interface StepMeta {
  id: Step;
  label: string;
  icon: React.ReactNode;
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V3m0 0L8 7m4-4l4 4" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17s3-1.12 3-2.5" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3a2 2 0 004 0M9 3a2 2 0 014 0" />
  </svg>
);

const STEPS: StepMeta[] = [
  { id: 1, label: "Envie sua fatura", icon: <UploadIcon /> },
  { id: 2, label: "Confirme seus dados", icon: <CheckIcon /> },
  { id: 3, label: "Proposta de economia", icon: <DollarIcon /> },
  { id: 4, label: "Termo de adesão", icon: <DocIcon /> },
];

const GEDISA_API_BASE =
  (import.meta as any).env?.VITE_GEDISA_API_BASE ||
  ((import.meta as any).env?.DEV
    ? "/gedisa-api/interno/api/v1"
    : "/api/gedisa/interno/api/v1");

export default function Contratacao() {
  const navigate = useNavigate();
  const personalToken =
    typeof window !== "undefined" ? sessionStorage.getItem("gedisa_token") || "" : "";

  const [step, setStep] = useState<Step>(1);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [senhaPdf, setSenhaPdf] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const formatCpfCnpj = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 11) {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
      if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
      return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
    }
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12)
      return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
  };

  /* ── submit fatura ── */
  const handleSubmitFatura = async () => {
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setFeedback({ type: "error", message: "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido." });
      return;
    }
    if (!file) {
      setFeedback({ type: "error", message: "Selecione o arquivo da fatura de energia." });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("cpf_cnpj", digits);
      formData.append("fatura", file);
      if (senhaPdf.trim()) formData.append("senha_pdf", senhaPdf.trim());

      const response = await fetch(`${GEDISA_API_BASE}/faturas`, {
        method: "POST",
        headers: { Authorization: `Bearer ${personalToken}` },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.status !== "success") {
        setFeedback({
          type: "error",
          message: result.message || "Erro ao enviar fatura. Tente novamente.",
        });
        return;
      }

      setFeedback({ type: "success", message: "Fatura enviada com sucesso!" });
      setTimeout(() => setStep(2), 800);
    } catch {
      setFeedback({ type: "error", message: "Falha ao enviar. Verifique sua conexão." });
    } finally {
      setIsUploading(false);
    }
  };

  /* ── stepper ── */
  const Stepper = () => (
    <div className="flex items-center justify-center gap-0 mb-10 px-4">
      {STEPS.map((s, idx) => {
        const isActive = s.id === step;
        const isDone = s.id < step;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isDone
                    ? "bg-blue-100 border-blue-400 text-blue-500"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {s.icon}
              </div>
              <span
                className={`text-xs font-semibold max-w-[80px] text-center leading-tight ${
                  isActive ? "text-blue-500" : isDone ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 ${s.id < step ? "bg-blue-400" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  /* ── step 1: Envie sua fatura ── */
  const StepFatura = () => (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border-2 border-blue-400 p-8 shadow-lg">
      <h2 className="text-center text-xl font-bold text-blue-500 mb-6">
        Anexe sua fatura de energia
      </h2>

      {/* CPF/CNPJ */}
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Informe seu CPF ou CNPJ
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={cpfCnpj}
        onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
        placeholder="Digite o número do seu documento"
        className="w-full rounded-full border border-gray-300 px-5 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5"
      />

      {/* File + senha */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Anexe sua fatura de energia
      </label>
      <div className="flex gap-3 mb-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          <UploadIcon />
          {file ? file.name.slice(0, 20) + (file.name.length > 20 ? "…" : "") : "Escolher arquivo"}
        </button>
        <input
          type="text"
          value={senhaPdf}
          onChange={(e) => setSenhaPdf(e.target.value)}
          placeholder="Senha PDF"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
            setFeedback(null);
          }}
        />
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1 mb-5">
        <p>
          Para continuar, envie sua fatura de energia.{" "}
          <strong>Preferencialmente, em PDF.</strong>
        </p>
        <p className="mt-2">Se optar por enviar uma foto, <strong>certifique-se de que esteja:</strong></p>
        <ul className="list-none pl-2 space-y-0.5">
          <li>• Legível</li>
          <li>• Completa</li>
          <li>• Estável</li>
          <li>• Bem iluminada</li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">
          Dica: Coloque a fatura em cima da mesa e segure o celular com as duas mãos.
        </p>
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`text-sm font-semibold text-center mb-4 ${
            feedback.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {feedback.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmitFatura}
        disabled={isUploading}
        className={`w-full rounded-full py-3 font-bold text-sm transition-colors ${
          cpfCnpj && file
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        } disabled:opacity-70`}
      >
        {isUploading ? "Enviando…" : "Enviar"}
      </button>
    </div>
  );

  /* ── placeholder steps 2-4 ── */
  const PlaceholderStep = ({ title }: { title: string }) => (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-10 shadow text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-500 text-sm">Esta etapa será carregada em breve.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Logo / back */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-blue-500 font-semibold hover:underline"
        >
          ← Voltar
        </button>
        <span className="text-xs text-gray-400">
          Vamos começar?{" "}
          <strong className="text-blue-500">Anexe sua última fatura</strong> de energia e deixe o
          resto com a gente!
        </span>
      </div>

      <div className="max-w-3xl mx-auto">
        <Stepper />

        {step === 1 && <StepFatura />}
        {step === 2 && <PlaceholderStep title="Confirme seus dados" />}
        {step === 3 && <PlaceholderStep title="Proposta de economia" />}
        {step === 4 && <PlaceholderStep title="Termo de adesão" />}
      </div>
    </div>
  );
}

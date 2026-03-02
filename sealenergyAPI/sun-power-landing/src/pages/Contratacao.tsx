import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

const DISTRIBUIDORAS = [
  "CELPE","COELBA","COSERN","ENERGISA","EQUATORIAL CEEE DISTRIBUICAO",
  "EQUATORIAL ALAGOAS","EQUATORIAL GOIAS","EQUATORIAL MARANHAO","EQUATORIAL PIAUI",
  "EQUATORIAL PARA","LIGHT","ENEL RIO","ENEL SP","ENEL CEARA","ENEL GOIAS",
  "CEMIG","CPFL PAULISTA","CPFL PIRATININGA","EDP SP","EDP ES",
  "ELEKTRO","NEOENERGIA BRASILIA","NEOENERGIA PERNAMBUCO",
  "RGE","RGE SUL","CELESC","COPEL","CELTINS","AME",
];

type FaturaAPIData = {
  uc?: string; unidade_consumidora?: string; distribuidora?: string;
  valor_fatura?: string | number; consumo_kwh?: string | number;
  consumo?: string | number; fatura_id?: string | number; leadFaturaId?: string | number;
};

type ConfirmaForm = {
  uc: string; distribuidora: string; valor_fatura: string;
  consumo_kwh: string; equipamento_essencial: "sim" | "nao";
};

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
const GreenCheck = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
    <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm4.707 7.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L11 13.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const STEPS = [
  { id: 1 as Step, label: "Envie sua fatura", icon: <UploadIcon /> },
  { id: 2 as Step, label: "Confirme seus dados", icon: <CheckIcon /> },
  { id: 3 as Step, label: "Proposta de economia", icon: <DollarIcon /> },
  { id: 4 as Step, label: "Termo de adesao", icon: <DocIcon /> },
];

const GEDISA_API_BASE =
  (import.meta as any).env?.VITE_GEDISA_API_BASE ||
  ((import.meta as any).env?.DEV ? "/gedisa-api/interno/api/v1" : "/api/gedisa/interno/api/v1");

export default function Contratacao() {
  const navigate = useNavigate();
  const personalToken = typeof window !== "undefined" ? sessionStorage.getItem("gedisa_token") || "" : "";

  const [step, setStep] = useState<Step>(1);

  // step 1
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [senhaPdf, setSenhaPdf] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showUnreadModal, setShowUnreadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // step 2
  const [confirmaForm, setConfirmaForm] = useState<ConfirmaForm>({
    uc: "", distribuidora: "", valor_fatura: "", consumo_kwh: "", equipamento_essencial: "nao",
  });
  const [isSubmittingConfirma, setIsSubmittingConfirma] = useState(false);
  const [confirmaFeedback, setConfirmaFeedback] = useState<string | null>(null);
  const [leadFaturaId, setLeadFaturaId] = useState<string | number | null>(null);

  const formatCpfCnpj = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 11) {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
      if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
      return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
    }
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
    return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`;
  };

  const goToManual = () => {
    setShowUnreadModal(false);
    setConfirmaForm({ uc: "", distribuidora: "", valor_fatura: "", consumo_kwh: "", equipamento_essencial: "nao" });
    setStep(2);
  };

  const handleSubmitFatura = async () => {
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setFeedback({ type: "error", message: "Informe um CPF (11 digitos) ou CNPJ (14 digitos) valido." });
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
      const result: { status?: string; message?: string; data?: FaturaAPIData } =
        await response.json().catch(() => ({}));
      if (!response.ok || result.status !== "success") {
        setShowUnreadModal(true);
        return;
      }
      const d = result.data || {};
      const uc = d.uc || d.unidade_consumidora || "";
      const dist = d.distribuidora || "";
      const valor = d.valor_fatura !== undefined ? String(d.valor_fatura) : "";
      const consumo = d.consumo_kwh !== undefined ? String(d.consumo_kwh) : (d.consumo !== undefined ? String(d.consumo) : "");
      const fatId = d.fatura_id || d.leadFaturaId || null;
      setLeadFaturaId(fatId);
      setConfirmaForm({ uc, distribuidora: dist, valor_fatura: valor, consumo_kwh: consumo, equipamento_essencial: "nao" });
      setStep(2);
    } catch {
      setShowUnreadModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmaDados = async () => {
    if (!confirmaForm.uc.trim() || !confirmaForm.distribuidora || !confirmaForm.valor_fatura || !confirmaForm.consumo_kwh) {
      setConfirmaFeedback("Preencha todos os campos obrigatorios.");
      return;
    }
    setIsSubmittingConfirma(true);
    setConfirmaFeedback(null);
    try {
      const body: Record<string, unknown> = {
        uc: confirmaForm.uc,
        distribuidora: confirmaForm.distribuidora,
        valor_fatura: confirmaForm.valor_fatura,
        consumo_kwh: confirmaForm.consumo_kwh,
        equipamento_essencial: confirmaForm.equipamento_essencial === "sim",
      };
      if (leadFaturaId) body.fatura_id = leadFaturaId;
      const response = await fetch(`${GEDISA_API_BASE}/faturas/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${personalToken}` },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.status !== "success") {
        setConfirmaFeedback(result.message || "Erro ao confirmar dados. Tente novamente.");
        return;
      }
      setStep(3);
    } catch {
      setConfirmaFeedback("Falha de conexao. Tente novamente.");
    } finally {
      setIsSubmittingConfirma(false);
    }
  };

  const Stepper = () => (
    <div className="flex items-center justify-center gap-0 mb-10 px-4">
      {STEPS.map((s, idx) => {
        const isActive = s.id === step;
        const isDone = s.id < step;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isActive ? "bg-blue-500 border-blue-500 text-white" : isDone ? "bg-blue-100 border-blue-400 text-blue-500" : "bg-white border-gray-300 text-gray-400"
              }`}>{s.icon}</div>
              <span className={`text-xs font-semibold max-w-[80px] text-center leading-tight ${
                isActive ? "text-blue-500" : isDone ? "text-blue-400" : "text-gray-400"
              }`}>{s.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 ${s.id < step ? "bg-blue-400" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const StepFatura = () => (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border-2 border-blue-400 p-8 shadow-lg">
      <h2 className="text-center text-xl font-bold text-blue-500 mb-6">Anexe sua fatura de energia</h2>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Informe seu CPF ou CNPJ</label>
      <input
        type="text" inputMode="numeric" value={cpfCnpj}
        onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
        placeholder="Digite o numero do seu documento"
        className="w-full rounded-full border border-gray-300 px-5 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5"
      />
      <label className="block text-sm font-semibold text-gray-700 mb-2">Anexe sua fatura de energia</label>
      <div className="flex gap-3 mb-4">
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
          <UploadIcon />
          {file ? file.name.slice(0, 20) + (file.name.length > 20 ? "..." : "") : "Escolher arquivo"}
        </button>
        <input type="text" value={senhaPdf} onChange={(e) => setSenhaPdf(e.target.value)}
          placeholder="Senha PDF"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setFeedback(null); }} />
      </div>
      <div className="text-sm text-gray-500 mb-5 space-y-1">
        <p>Para continuar, envie sua fatura de energia. <strong>Preferencialmente, em PDF.</strong></p>
        <p className="mt-2">Se optar por enviar uma foto, <strong>certifique-se de que esteja:</strong></p>
        <ul className="pl-2 space-y-0.5"><li>Legivel</li><li>Completa</li><li>Estavel</li><li>Bem iluminada</li></ul>
        <p className="mt-2 text-xs text-gray-400">Dica: Coloque a fatura em cima da mesa e segure o celular com as duas maos.</p>
      </div>
      {feedback && (
        <p className={`text-sm font-semibold text-center mb-4 ${feedback.type === "success" ? "text-green-600" : "text-red-500"}`}>
          {feedback.message}
        </p>
      )}
      <button type="button" onClick={handleSubmitFatura} disabled={isUploading}
        className={`w-full rounded-full py-3 font-bold text-sm transition-colors ${
          cpfCnpj && file ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-500 cursor-not-allowed"
        } disabled:opacity-70`}>
        {isUploading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );

  const UnreadModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-blue-400 p-8 shadow-2xl relative">
        <button type="button" onClick={() => setShowUnreadModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none">x</button>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Nao conseguimos ler sua fatura.</h3>
        <p className="text-gray-500 text-sm mb-5">Por favor, tente novamente.</p>
        <p className="text-sm font-semibold text-gray-700 mb-2">Certifique-se de que esteja:</p>
        <ul className="text-sm text-gray-600 space-y-1 mb-4 pl-2">
          <li>Legivel</li><li>Completa</li><li>Estavel</li><li>Bem iluminada</li>
        </ul>
        <div className="text-sm text-gray-600 space-y-1 mb-8">
          <p className="font-semibold">Dica:</p>
          <p>Ao enviar a fatura, <strong>de preferencia para o formato digital em PDF.</strong> Voce pode solicitar a 2 via para a sua distribuidora.</p>
          <p>Caso esteja fotografando a fatura, apoie-a cima da mesa e segure o celular com as duas maos.</p>
          <p>Tente processar a fatura novamente.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={goToManual}
            className="flex-1 rounded-full border-2 border-blue-500 py-3 font-semibold text-blue-500 hover:bg-blue-50 transition-colors text-sm">
            Preencher manual
          </button>
          <button type="button" onClick={() => { setShowUnreadModal(false); fileInputRef.current?.click(); }}
            className="flex-1 rounded-full bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 transition-colors text-sm">
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );

  const StepConfirma = () => (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border-2 border-blue-400 p-8 shadow-lg">
      <button type="button" onClick={() => setStep(1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 mb-4 transition-colors">
        &larr; Voltar
      </button>
      <h2 className="text-center text-xl font-bold text-blue-500 mb-1">Confirme os dados da sua fatura</h2>
      {(!confirmaForm.uc && !confirmaForm.distribuidora) ? (
        <p className="text-center text-sm text-gray-500 mb-6">Os dados da sua fatura nao foram reconhecidos. <strong>Preencha os campos a seguir para continuar.</strong></p>
      ) : (
        <p className="text-center text-sm text-gray-500 mb-6">Confira os dados extraidos da sua fatura e corrija se necessario.</p>
      )}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Unidade Consumidora (UC)</label>
        <div className="relative">
          <input type="text" value={confirmaForm.uc}
            onChange={(e) => setConfirmaForm((p) => ({ ...p, uc: e.target.value }))}
            placeholder="Ex: 123456"
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {confirmaForm.uc && <span className="absolute right-3 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Distribuidora</label>
        <div className="relative">
          <select value={confirmaForm.distribuidora}
            onChange={(e) => setConfirmaForm((p) => ({ ...p, distribuidora: e.target.value }))}
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white">
            <option value="">Selecione a distribuidora</option>
            {DISTRIBUIDORAS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {confirmaForm.distribuidora && <span className="absolute right-8 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor da Fatura - R$</label>
        <div className="relative">
          <input type="text" inputMode="decimal" value={confirmaForm.valor_fatura}
            onChange={(e) => setConfirmaForm((p) => ({ ...p, valor_fatura: e.target.value }))}
            placeholder="Ex: 320,00"
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {confirmaForm.valor_fatura && <span className="absolute right-3 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Consumo mes - kWh</label>
        <div className="relative">
          <input type="text" inputMode="numeric" value={confirmaForm.consumo_kwh}
            onChange={(e) => setConfirmaForm((p) => ({ ...p, consumo_kwh: e.target.value }))}
            placeholder="Ex: 250"
            className="w-full rounded-full border border-gray-300 px-5 py-3 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {confirmaForm.consumo_kwh && <span className="absolute right-3 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Voce utiliza algum equipamento essencial para a vida nesse endereco?
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="equipamento" value="sim"
              checked={confirmaForm.equipamento_essencial === "sim"}
              onChange={() => setConfirmaForm((p) => ({ ...p, equipamento_essencial: "sim" }))}
              className="accent-blue-500" />
            Sim
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="radio" name="equipamento" value="nao"
              checked={confirmaForm.equipamento_essencial === "nao"}
              onChange={() => setConfirmaForm((p) => ({ ...p, equipamento_essencial: "nao" }))}
              className="accent-blue-500" />
            Nao
          </label>
        </div>
      </div>
      {confirmaFeedback && <p className="text-sm text-red-500 font-semibold text-center mb-4">{confirmaFeedback}</p>}
      <button type="button" onClick={handleConfirmaDados} disabled={isSubmittingConfirma}
        className="w-full rounded-full bg-blue-500 py-3 font-bold text-white text-sm hover:bg-blue-600 transition-colors disabled:opacity-60">
        {isSubmittingConfirma ? "Salvando..." : "Continuar"}
      </button>
    </div>
  );

  const PlaceholderStep = ({ title }: { title: string }) => (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-10 shadow text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      <p className="text-gray-500 text-sm">Esta etapa sera carregada em breve.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <button type="button" onClick={() => navigate("/")} className="text-sm text-blue-500 font-semibold hover:underline">
          Voltar
        </button>
        <span className="text-xs text-gray-400">
          Vamos comecar?{" "}
          <strong className="text-blue-500">Anexe sua ultima fatura</strong> de energia e deixe o resto com a gente!
        </span>
      </div>
      <div className="max-w-3xl mx-auto">
        {Stepper()}
        {step === 1 && StepFatura()}
        {step === 2 && StepConfirma()}
        {step === 3 && PlaceholderStep({ title: "Proposta de economia" })}
        {step === 4 && PlaceholderStep({ title: "Termo de adesao" })}
      </div>
      {showUnreadModal && UnreadModal()}
    </div>
  );
}

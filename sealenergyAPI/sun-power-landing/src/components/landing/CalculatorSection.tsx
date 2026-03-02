import { useEffect, useRef, useState } from "react";
import { useFadeIn } from "@/hooks/useFadeIn";

type ParceiroData = {
  empresaParceiraId: number;
  razao_social: string;
  codigoInicialParceria: string;
  hash_parceiro?: string;
  temCodigoVendedor?: string;
  lpId?: string;
};

type GedisaResponse<T> = {
  status: string;
  message?: string;
  data?: T;
  personal_token?: string;
};

const CalculatorSection = () => {
  const ref = useFadeIn();
  const [value, setValue] = useState(300);
  const [code, setCode] = useState(["", "", "", "", "", "", ""]);
  const [parceiroData, setParceiroData] = useState<ParceiroData | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [validatedCode, setValidatedCode] = useState<string | null>(null);
  const [validatedSellerName, setValidatedSellerName] = useState("");
  const [leadForm, setLeadForm] = useState({ nome: "", email: "", celular: "" });
  const [isConfirmPhoneOpen, setIsConfirmPhoneOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenCode, setTokenCode] = useState(["", "", "", "", "", ""]);
  const [flowFeedback, setFlowFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  const [personalToken, setPersonalToken] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const tokenRefs = useRef<(HTMLInputElement | null)[]>([]);

  const GEDISA_API_BASE =
    import.meta.env.VITE_GEDISA_API_BASE ||
    (import.meta.env.DEV ? "/gedisa-api/interno/api/v1" : "/api/gedisa/interno/api/v1");
  const parceiroHashFromUrl = new URLSearchParams(window.location.search).get("parceiro");
  const HASH_PARCEIRO = parceiroHashFromUrl || import.meta.env.VITE_GEDISA_HASH_PARCEIRO || "89f0fd5c927d466d6ec9a21b9ac34ffa";

  const taxa = 0.13 - (11 / value);
  const economia_mensal = value * taxa;
  const economia_anual = economia_mensal * 12;
  const faturas = economia_anual / value;

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const loadParceiroData = async () => {
    try {
      const response = await fetch(`${GEDISA_API_BASE}/informacoes-parceiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashParceiro: HASH_PARCEIRO }),
      });

      const result: GedisaResponse<ParceiroData> = await response.json();
      if (!response.ok || result.status !== "success" || !result.data) {
        return null;
      }

      const parsedData = result.data;
      const prefix = (parsedData.codigoInicialParceria || "").toUpperCase().slice(0, 3);

      setParceiroData(parsedData);
      setCode((currentCode) => {
        if (prefix.length !== 3) return currentCode;
        return [
          prefix[0],
          prefix[1],
          prefix[2],
          currentCode[3] || "",
          currentCode[4] || "",
          currentCode[5] || "",
          currentCode[6] || "",
        ];
      });

      return parsedData;
    } catch {
      setParceiroData(null);
      return null;
    }
  };

  useEffect(() => {
    loadParceiroData();
  }, [HASH_PARCEIRO]);

  const handleCodeChange = (index: number, val: string) => {
    if (index < 3 && parceiroData?.codigoInicialParceria) return;
    if (val.length > 1) val = val.slice(-1);
    if (!/^[A-Z0-9]?$/.test(val.toUpperCase())) return;

    const newCode = [...code];
    newCode[index] = val.toUpperCase();
    setCode(newCode);
    setCodeFeedback(null);
    setValidatedCode(null);
    setValidatedSellerName("");
    if (val && index < 6) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (index < 3 && parceiroData?.codigoInicialParceria) return;
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getComposedCode = () => code.join("").toUpperCase();

  const resetCode = () => {
    if (parceiroData?.codigoInicialParceria) {
      const prefix = parceiroData.codigoInicialParceria.toUpperCase().slice(0, 3);
      setCode([prefix[0] || "", prefix[1] || "", prefix[2] || "", "", "", "", ""]);
    } else {
      setCode(["", "", "", "", "", "", ""]);
    }
    setCodeFeedback(null);
    setValidatedCode(null);
    setValidatedSellerName("");
    setFlowFeedback(null);
    setLeadCreated(false);
    setPersonalToken(null);
    setLeadForm((prev) => ({ ...prev, nome: "", email: "", celular: "" }));
  };

  const isLeadFormValid =
    leadForm.nome.trim().length > 1 && /\S+@\S+\.\S+/.test(leadForm.email) && leadForm.celular.replace(/\D/g, "").length >= 10;

  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "").slice(0, 11);
    setLeadForm((prev) => ({ ...prev, celular: digits }));
  };

  const getTokenCode = () => tokenCode.join("");

  const handleTokenChange = (index: number, value: string) => {
    const parsed = value.replace(/\D/g, "").slice(-1);
    const next = [...tokenCode];
    next[index] = parsed;
    setTokenCode(next);
    if (parsed && index < 5) tokenRefs.current[index + 1]?.focus();
  };

  const handleTokenKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !tokenCode[index] && index > 0) {
      tokenRefs.current[index - 1]?.focus();
    }
  };

  const extractPersonalToken = (result: GedisaResponse<any>) => {
    return result.personal_token || result.data?.personal_token;
  };

  const sendPhoneVerificationSms = async () => {
    if (!validatedCode || !isLeadFormValid) return;

    setIsSendingSms(true);
    setFlowFeedback(null);

    try {
      const response = await fetch(`${GEDISA_API_BASE}/sms-token/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: leadForm.celular,
          nome: leadForm.nome,
          codigoVendedor: validatedCode,
          hashParceiro: HASH_PARCEIRO,
        }),
      });

      const result: GedisaResponse<{ personal_token?: string }> = await response.json();
      if (!response.ok || result.status !== "success") {
        setFlowFeedback({ type: "error", message: result.message || "Não foi possível enviar o SMS." });
        return;
      }

      const tokenFromVerify = extractPersonalToken(result);
      if (tokenFromVerify) {
        setPersonalToken(tokenFromVerify);
      }

      setIsConfirmPhoneOpen(false);
      setIsTokenModalOpen(true);
      setTokenCode(["", "", "", "", "", ""]);
      setFlowFeedback({ type: "success", message: "Código enviado por SMS. Digite o token para continuar." });
      setTimeout(() => tokenRefs.current[0]?.focus(), 0);
    } catch {
      setFlowFeedback({ type: "error", message: "Falha ao enviar SMS. Tente novamente." });
    } finally {
      setIsSendingSms(false);
    }
  };

  const submitLead = async (authToken?: string) => {
    const tokenToUse = authToken || personalToken;

    if (!tokenToUse) {
      setFlowFeedback({ type: "error", message: "Token de autenticação não encontrado. Valide o telefone novamente." });
      return;
    }

    setIsSubmittingLead(true);
    try {
      const response = await fetch(`${GEDISA_API_BASE}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({
          nome: leadForm.nome,
          celular: leadForm.celular,
          email: leadForm.email,
          codigoVendedor: validatedCode,
          preencheu_codigo_vendedor: true,
          parceiro: "contratacao_digital_seal_energy",
        }),
      });

      const result: GedisaResponse<{ leadId?: string | number }> = await response.json();
      if (!response.ok || result.status !== "success") {
        setFlowFeedback({ type: "error", message: result.message || "Não foi possível cadastrar o lead." });
        return;
      }

      setLeadCreated(true);
      setIsTokenModalOpen(false);
      setFlowFeedback({ type: "success", message: "Cadastro concluído com sucesso!" });
    } catch {
      setFlowFeedback({ type: "error", message: "Falha ao cadastrar lead. Tente novamente." });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const validateSmsToken = async () => {
    const token = getTokenCode();
    if (!/^\d{6}$/.test(token)) {
      setFlowFeedback({ type: "error", message: "Preencha os 6 dígitos do token." });
      return;
    }

    setIsValidatingToken(true);

    try {
      const response = await fetch(`${GEDISA_API_BASE}/sms-token/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: leadForm.nome,
          number: leadForm.celular,
          code: token,
        }),
      });

      const result: GedisaResponse<{ personal_token?: string }> = await response.json();
      const receivedToken = extractPersonalToken(result);
      if (!response.ok || !receivedToken) {
        setFlowFeedback({ type: "error", message: result.message || "Token inválido. Verifique e tente novamente." });
        return;
      }

      setPersonalToken(receivedToken);

      await submitLead(receivedToken);
    } catch {
      setFlowFeedback({ type: "error", message: "Falha ao validar token. Tente novamente." });
    } finally {
      setIsValidatingToken(false);
    }
  };

  const validateCodeWithGedisa = async () => {
    const fullCode = getComposedCode().replace(/[^A-Z0-9]/g, "");
    const isCodeComplete = /^[A-Z0-9]{7}$/.test(fullCode);

    if (!isCodeComplete) {
      setCodeFeedback({ type: "error", message: "Preencha os 7 caracteres do código." });
      return;
    }

    setIsValidatingCode(true);
    setCodeFeedback(null);

    try {
      const resolvedParceiroData = parceiroData || (await loadParceiroData());
      if (!resolvedParceiroData?.empresaParceiraId) {
        setCodeFeedback({ type: "error", message: "Não foi possível carregar o parceiro para validar o código." });
        return;
      }

      const response = await fetch(`${GEDISA_API_BASE}/valida-codigo-vendedor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaParceiraId: resolvedParceiroData.empresaParceiraId,
          codigoVendedor: fullCode,
        }),
      });

      const result: GedisaResponse<{ message?: string; nomeVendedor?: string }> = await response.json();
      const apiMessage = result.data?.message || result.message || "Código inválido. Por favor, verifique e tente novamente.";

      if (response.ok && apiMessage === "Código de indicação validado com sucesso!") {
        const sellerName = result.data?.nomeVendedor || "";
        setValidatedCode(fullCode);
        setValidatedSellerName(sellerName);
        setCodeFeedback({ type: "success", message: "Código validado com sucesso!" });
        return;
      }

      setValidatedCode(null);
      setValidatedSellerName("");
      setCodeFeedback({ type: "error", message: apiMessage });
    } catch {
      setValidatedCode(null);
      setValidatedSellerName("");
      setCodeFeedback({ type: "error", message: "Não foi possível validar o código agora. Tente novamente." });
    } finally {
      setIsValidatingCode(false);
    }
  };

  const pct = ((value - 300) / (5000 - 300)) * 100;

  return (
    <section id="calculadora" className="py-16 md:py-24">
      <div ref={ref} className="container fade-in-section">

        {/* Outer card — dark like the others */}
        <div className="bg-black/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10 overflow-hidden">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground text-center font-bold mb-10">
            Calcule a sua <span className="text-gradient">economia</span>
          </h2>

          {/* 3-column layout: code | slider | result card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

            {/* Col 1: Code input */}
            <div className="flex flex-col justify-center gap-6 min-w-0 h-full">
              {validatedCode && (
                <p className="text-sm font-semibold text-yellow-300 text-center">
                  Código de Indicação: {validatedCode}
                  {validatedSellerName ? ` - ${validatedSellerName}` : ""}
                </p>
              )}

              <div className="space-y-4">
                <label className="text-sm md:text-base font-bold text-foreground block text-center">
                  Adicione o código de indicação
                </label>
                <div className="flex justify-center gap-2 md:gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      className="w-9 h-10 md:w-10 md:h-11 rounded-lg bg-white/10 border border-white/20 text-center font-bold text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:text-muted-foreground"
                      value={code[i]}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      maxLength={1}
                      readOnly={i < 3 && !!parceiroData?.codigoInicialParceria}
                      placeholder={i === 0 ? "V" : i === 1 ? "L" : i === 2 ? "E" : "-"}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={validateCodeWithGedisa}
                  disabled={isValidatingCode}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isValidatingCode ? "Validando..." : "Validar código"}
                </button>
                {codeFeedback && (
                  <p className={`text-sm text-center font-semibold ${codeFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {codeFeedback.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={resetCode}
                  className="text-muted-foreground text-sm font-semibold hover:text-primary hover:underline underline-offset-4 text-center transition-colors"
                >
                  Não tenho código
                </button>
              </div>

              {validatedCode && (
                <div className="space-y-3 mt-2">
                  <input
                    type="text"
                    value={leadForm.nome}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite seu nome"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite seu e-mail"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <input
                    type="tel"
                    value={leadForm.celular}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Digite seu celular"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLeadFormValid) return;
                      setFlowFeedback(null);
                      setIsConfirmPhoneOpen(true);
                    }}
                    disabled={!isLeadFormValid || leadCreated}
                    className="w-full py-3 rounded-xl bg-white/20 text-foreground font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {leadCreated ? "Cadastro concluído" : "Quero economizar"}
                  </button>
                  {flowFeedback && (
                    <p className={`text-sm text-center font-semibold ${flowFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                      {flowFeedback.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Col 2: Slider — middle column */}
            <div className="flex flex-col items-center justify-center gap-5 min-w-0 h-full">
              <p className="text-sm md:text-base font-bold text-foreground uppercase text-center leading-snug">
                QUANTO VOCÊ GASTA<br />COM LUZ POR MÊS?
              </p>

              {/* Slider */}
              <div className="w-full relative">
                <div className="relative h-3 bg-white/10 rounded-full">
                  {/* Filled track */}
                  <div
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                  <input
                    type="range"
                    min={300}
                    max={5000}
                    step={50}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer z-10
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-white
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:bg-primary
                      [&::-moz-range-thumb]:border-none
                      [&::-moz-range-thumb]:rounded-full"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl md:text-4xl font-sans font-bold text-foreground tracking-tight" key={value}>
                  {formatCurrency(value)}
                </p>
                <p className="text-muted-foreground text-xs font-medium mt-1">Seu gasto atual</p>
              </div>
            </div>

            {/* Col 3: Result card — stays white */}
            <div className="w-full bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col justify-between min-w-0 overflow-hidden h-full">
              <h3 className="text-primary text-xl font-heading text-center mb-8">
                Seu gasto por mês
              </h3>

              <div className="flex divide-x divide-gray-200 w-full whitespace-nowrap">
                <div className="flex-1 flex flex-col items-center px-1 text-center justify-start h-16">
                  <span className="font-bold text-gray-900 text-[15px] animate-count" key={`m-${value}`}>{formatCurrency(economia_mensal)}</span>
                  <span className="text-[11px] text-gray-500 leading-tight mt-1">Sua economia<br />em um mês</span>
                </div>
                <div className="flex-1 flex flex-col items-center px-1 text-center justify-start h-16">
                  <span className="font-bold text-gray-900 text-[15px] animate-count" key={`y-${value}`}>{formatCurrency(economia_anual)}</span>
                  <span className="text-[11px] text-gray-500 leading-tight mt-1">Sua economia<br />em um ano</span>
                </div>
                <div className="flex-1 flex flex-col items-center px-1 text-center justify-start h-16">
                  <span className="font-bold text-gray-900 text-[15px] animate-count" key={`f-${value}`}>{faturas.toFixed(2).replace('.', ',')} Faturas</span>
                  <span className="text-[11px] text-gray-500 leading-tight mt-1">Em um ano</span>
                </div>
              </div>

              <div className="mt-auto pt-6 text-center flex flex-col gap-4">
                <p className="text-[10px] text-gray-400 font-medium leading-snug max-w-[280px] mx-auto">
                  Simulação calculada com base no consumo atual,<br />com bandeira tarifária na cor: verde
                </p>
                <p className="text-gray-900 font-bold text-sm">
                  Parceiro: {parceiroData?.razao_social || "SEAL ENERGY"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {isConfirmPhoneOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-center text-xl font-bold text-gray-900">Confirme seu telefone</h4>
            <p className="mt-4 text-center text-gray-700">Enviaremos um código por SMS para validar este número.</p>
            <p className="mt-2 text-center text-2xl font-bold text-primary">{formatPhoneDisplay(leadForm.celular)}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmPhoneOpen(false)}
                className="rounded-xl border border-gray-300 py-2.5 font-semibold text-gray-700"
              >
                Não está correto
              </button>
              <button
                type="button"
                onClick={sendPhoneVerificationSms}
                disabled={isSendingSms}
                className="rounded-xl bg-primary py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {isSendingSms ? "Enviando..." : "Sim, está certo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTokenModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="text-center text-2xl font-bold text-gray-900">Valide seu telefone</h4>
            <p className="mt-3 text-center text-gray-600">
              Para continuar, insira o token que enviamos via SMS para <strong>{formatPhoneDisplay(leadForm.celular)}</strong>
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (tokenRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={tokenCode[index]}
                  onChange={(event) => handleTokenChange(index, event.target.value)}
                  onKeyDown={(event) => handleTokenKeyDown(index, event)}
                  className="h-12 w-11 rounded-xl border border-gray-300 text-center text-xl font-bold text-gray-900 focus:border-primary focus:outline-none"
                />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(false)}
                className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={validateSmsToken}
                disabled={isValidatingToken || isSubmittingLead}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-60"
              >
                {isValidatingToken || isSubmittingLead ? "Validando..." : "Validar código"}
              </button>
            </div>

            <button
              type="button"
              onClick={sendPhoneVerificationSms}
              disabled={isSendingSms}
              className="mt-4 w-full text-center text-sm font-semibold text-primary underline underline-offset-4"
            >
              {isSendingSms ? "Reenviando..." : "Reenviar código"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CalculatorSection;

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Mail, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useSelection } from "@/contexts/SelectionContext";
import { defaultInquiryMessage, services } from "@/lib/famu-data";
import { trpc } from "@/lib/trpc";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

type FormState = { name: string; company: string; phone: string; email: string; service: string; projectType: string; deadline: string; budget: string; description: string; preferredContact: string };

const initialForm: FormState = { name: "", company: "", phone: "", email: "", service: "", projectType: "", deadline: "", budget: "", description: "", preferredContact: "whatsapp" };

export default function BriefingDialog({ open, onOpenChange }: Props) {
  const { selected, clear } = useSelection();
  const submitBriefing = trpc.briefing.submit.useMutation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubmitted(false);
    setForm((current) => ({ ...current, service: current.service || selected[0] || "" }));
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onOpenChange(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const requestedItems = useMemo(() => selected.length ? selected : form.service ? [form.service] : [], [selected, form.service]);
  const message = useMemo(() => [`Olá, FAMU STUDIO!`, ``, `Gostaria de solicitar informações sobre:`, ...(requestedItems.length ? requestedItems.map((item, index) => `${index + 1}. ${item}`) : ["Ainda estou a explorar as soluções."]), ``, `Nome: ${form.name || "A preencher"}`, `Empresa: ${form.company || "—"}`, `Contacto: ${form.phone || form.email || "—"}`, ``, form.description || defaultInquiryMessage].join("\n"), [form, requestedItems]);

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    submitBriefing.mutate({
      name: form.name,
      company: form.company,
      phone: form.phone,
      email: form.email,
      services: requestedItems,
      projectType: form.projectType,
      deadline: form.deadline,
      budget: form.budget,
      description: form.description,
      preferredContact: form.preferredContact as "whatsapp" | "email" | "phone",
    }, {
      onSuccess: () => { setSubmitted(true); clear(); toast.success("Recebemos o seu pedido."); },
      onError: () => toast.error("Não foi possível registar o pedido. Tente novamente."),
    });
  };

  const close = () => { onOpenChange(false); setTimeout(() => setSubmitted(false), 200); };

  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <section className="briefing-dialog" role="dialog" aria-modal="true" aria-labelledby="briefing-title">
      <button className="dialog-close" onClick={close} aria-label="Fechar briefing"><X size={20} /></button>
      {submitted ? <div className="dialog-success"><span className="success-icon"><Check size={25} /></span><span className="eyebrow">Pedido preparado</span><h2 id="briefing-title">Recebemos o seu pedido.</h2><p>Obrigado por entrar em contacto com a FAMU STUDIO. Vamos analisar as informações enviadas.</p><div className="dialog-actions"><button className="button button-outline" onClick={() => { setSubmitted(false); setStep(1); }}>Editar briefing</button><button className="button button-primary" onClick={close}>Concluir <ArrowUpRight size={16} /></button></div></div> : <>
        <div className="dialog-header"><div><span className="eyebrow">Briefing inteligente · 0{step} / 02</span><h2 id="briefing-title">Começar um projecto.</h2></div><div className="dialog-progress"><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /></div></div>
        <form onSubmit={submit}>
          {step === 1 ? <div className="briefing-step"><p className="dialog-intro">Conte-nos o suficiente para começarmos uma conversa com contexto.</p><div className="form-grid"><label>Nome *<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Como devemos tratar-lhe?" /></label><label>Empresa <input value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Nome da empresa, se aplicável" /></label><label>Telefone <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Contacto preferencial" /></label><label>Email <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="nome@empresa.com" /></label></div><div className="dialog-actions"><button type="button" className="button button-primary button-wide" onClick={() => setStep(2)}>Continuar <ArrowUpRight size={16} /></button></div></div> : <div className="briefing-step"><button type="button" className="back-link" onClick={() => setStep(1)}><ArrowLeft size={15} /> Voltar</button><div className="form-grid"><label>Serviço principal<select value={form.service} onChange={(event) => update("service", event.target.value)}><option value="">Escolher depois</option>{services.map((service) => <option key={service.slug} value={service.shortTitle}>{service.shortTitle}</option>)}</select></label><label>Tipo de projecto<input value={form.projectType} onChange={(event) => update("projectType", event.target.value)} placeholder="Ex.: identidade, dashboard, website…" /></label><label>Prazo pretendido<select value={form.deadline} onChange={(event) => update("deadline", event.target.value)}><option value="">Ainda não definido</option><option>O mais breve possível</option><option>Nas próximas 2 semanas</option><option>Este mês</option><option>Sem urgência</option></select></label><label>Orçamento estimado <span className="optional">opcional</span><input value={form.budget} onChange={(event) => update("budget", event.target.value)} placeholder="Se já tiver uma referência" /></label></div><label className="full-label">Descreva o que pretende<textarea rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Objectivo, referências, quantidade ou qualquer detalhe útil…" /></label><label className="full-label">Contacto preferencial<div className="contact-choice"><button type="button" className={form.preferredContact === "whatsapp" ? "choice active" : "choice"} onClick={() => update("preferredContact", "whatsapp")}><MessageCircle size={16} /> WhatsApp</button><button type="button" className={form.preferredContact === "email" ? "choice active" : "choice"} onClick={() => update("preferredContact", "email")}><Mail size={16} /> Email</button></div></label><div className="briefing-selection">{requestedItems.length ? <><span className="eyebrow">Na sua selecção</span><div>{requestedItems.map((item) => <span key={item}>{item}</span>)}</div></> : <span className="muted-text">Pode enviar o pedido mesmo sem seleccionar um serviço.</span>}</div><div className="dialog-actions"><button type="submit" disabled={submitBriefing.isPending} className="button button-primary button-wide">{submitBriefing.isPending ? "A enviar…" : "Enviar pedido"} {!submitBriefing.isPending && <ArrowUpRight size={16} />}</button></div><p className="dialog-note">O pedido fica registado na estrutura interna. WhatsApp e email serão activados quando os contactos oficiais forem configurados.</p></div>}
        </form>
      </>}
    </section>
  </div>;
}

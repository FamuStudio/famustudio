import { useState } from "react";
import { Bot, ChevronDown, Loader2, Send, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

type ChatMessage = { role: "user" | "assistant"; content: string };

const starter: ChatMessage[] = [{ role: "assistant", content: "Olá. Sou o assistente da FAMU. Conte-me o que precisa e ajudo a encontrar o serviço mais indicado para si." }];
const quickPrompts = ["Preciso de uma identidade visual", "Quero organizar os dados da minha empresa", "Quero criar um website"];

export default function FamuAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starter);
  const recommendation = trpc.assistant.recommend.useMutation();

  const send = (value = input) => {
    const message = value.trim();
    if (!message || recommendation.isPending) return;
    const next = [...messages, { role: "user" as const, content: message }];
    setMessages(next);
    setInput("");
    recommendation.mutate({ message, history: next.slice(-8) }, {
      onSuccess: (result) => setMessages((current) => [...current, { role: "assistant", content: result.answer }]),
      onError: () => setMessages((current) => [...current, { role: "assistant", content: "Não consegui responder neste momento. Pode descrever a sua necessidade no briefing e a equipa FAMU continuará a conversa." }]),
    });
  };

  return <div className={`famu-assistant ${open ? "is-open" : ""}`}>
    {open && <section className="assistant-panel" aria-label="Assistente virtual FAMU">
      <header className="assistant-header"><div><span className="assistant-kicker"><Sparkles size={12} /> FAMU AI</span><strong>Encontrar o serviço ideal.</strong></div><button onClick={() => setOpen(false)} aria-label="Fechar assistente"><X size={17} /></button></header>
      <div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>{message.role === "assistant" && <Bot size={14} /> }<p>{message.content}</p></div>)}{recommendation.isPending && <div className="assistant-message assistant"><Loader2 size={14} className="spin" /><p>A analisar as suas necessidades…</p></div>}</div>
      {messages.length === 1 && <div className="assistant-prompts">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>}
      <form className="assistant-form" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Explique o que precisa…" aria-label="Mensagem para o assistente" /><button disabled={recommendation.isPending || !input.trim()} aria-label="Enviar mensagem"><Send size={15} /></button></form>
      <small className="assistant-disclaimer">Sugestões iniciais — a recomendação final é alinhada no briefing.</small>
    </section>}
    <button className="assistant-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Fechar assistente virtual" : "Abrir assistente virtual"}>{open ? <ChevronDown size={20} /> : <><Bot size={19} /><span>Ajuda a escolher</span></>}</button>
  </div>;
}

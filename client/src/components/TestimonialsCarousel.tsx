import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/famu-data";

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % testimonials.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return <section className="testimonials-section section-pad" aria-label="Testemunhos de clientes">
    <div className="container"><div className="testimonials-head"><div><span className="eyebrow"><Quote size={13} /> Confiança em construção</span><h2>O que fica depois da forma.</h2></div><div className="testimonial-controls"><button onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)} aria-label="Testemunho anterior"><ArrowLeft size={16} /></button><span>{String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span><button onClick={() => setActive((active + 1) % testimonials.length)} aria-label="Próximo testemunho"><ArrowRight size={16} /></button></div></div>
      <div className="testimonial-stage"><div className="testimonial-quote-mark">“</div><blockquote key={current.quote}>{current.quote}</blockquote><div className="testimonial-author"><span className="testimonial-avatar">{current.name.charAt(0)}</span><div><strong>{current.name}</strong><span>{current.role}</span></div><span className="testimonial-context">{current.context}</span></div></div>
      <div className="testimonial-dots">{testimonials.map((item, index) => <button key={item.name} onClick={() => setActive(index)} className={index === active ? "active" : ""} aria-label={`Ver testemunho ${index + 1}`} />)}</div>
      <p className="editorial-note">Testemunhos demonstrativos preparados para serem substituídos por feedback autorizado de clientes FAMU.</p>
    </div>
  </section>;
}

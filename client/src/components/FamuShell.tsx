import { useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronRight, Heart, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSelection } from "@/contexts/SelectionContext";
import { brand, footerLinks, navLinks, quoteCta } from "@/lib/famu-data";
import BriefingDialog from "@/components/BriefingDialog";
import FamuAssistant from "@/components/FamuAssistant";

export default function FamuShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [location] = useLocation();
  const { count, selected } = useSelection();

  const openBriefing = () => {
    setMobileOpen(false);
    setBriefingOpen(true);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand-lockup" onClick={() => setMobileOpen(false)} aria-label="FAMU STUDIO — início">
            <span className="brand-mark">F</span>
            <span className="brand-name">FAMU<span>STUDIO</span></span>
          </Link>

          <nav className={`desktop-nav ${mobileOpen ? "mobile-nav-open" : ""}`} aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={location === link.href ? "nav-link active" : "nav-link"} onClick={() => setMobileOpen(false)}>{link.label}</Link>
            ))}
            <Link href="/selecao" className="nav-selection" onClick={() => setMobileOpen(false)}>
              <Heart size={15} strokeWidth={1.8} />
              <span>Selecção</span>
              {count > 0 && <b>{count}</b>}
            </Link>
            <button className="button button-primary button-small nav-cta" onClick={openBriefing}>{quoteCta}<ArrowUpRight size={15} /></button>
          </nav>

          <div className="header-actions">
            <Link href="/selecao" className="mobile-selection" aria-label={`Ver selecção, ${count} itens`}><Heart size={18} />{count > 0 && <b>{count}</b>}</Link>
            <button className="menu-toggle" aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((current) => !current)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>

      <main key={location} className="page-transition">{children}</main>

      {count > 0 && (
        <div className="selection-tray">
          <div className="selection-tray-inner container">
            <div className="selection-tray-copy"><span className="tray-dot" /> <strong>{count} {count === 1 ? "serviço seleccionado" : "serviços seleccionados"}</strong><span className="tray-preview">{selected.slice(0, 2).join(" · ")}{selected.length > 2 ? " …" : ""}</span></div>
            <div className="selection-tray-actions"><Link href="/selecao" className="button button-ghost button-small">Ver selecção <ChevronRight size={14} /></Link><button className="button button-primary button-small" onClick={openBriefing}>Solicitar orçamento <ArrowUpRight size={14} /></button></div>
          </div>
        </div>
      )}

      <FamuAssistant />
      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand"><Link href="/" className="brand-lockup"><span className="brand-mark">F</span><span className="brand-name">FAMU<span>STUDIO</span></span></Link><p>{brand.description}</p></div>
          <div className="footer-statement"><span>01 / 01</span><p>Da ideia à forma.<br /><em>Com intenção.</em></p></div>
          <div className="footer-links"><span className="eyebrow">Explorar</span>{footerLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
          <div className="footer-contact"><span className="eyebrow">Começar</span><button onClick={() => setBriefingOpen(true)}>{quoteCta} <ArrowUpRight size={16} /></button><small>{brand.whatsapp} · {brand.email}</small></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} FAMU STUDIO</span><span>Ideias que ganham forma.</span><span>Conteúdo demonstrativo pronto para actualização.</span></div>
      </footer>
      <BriefingDialog open={briefingOpen} onOpenChange={setBriefingOpen} />
    </div>
  );
}

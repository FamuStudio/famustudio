import { ArrowUpRight, Heart, Plus, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { useSelection } from "@/contexts/SelectionContext";
import type { Project, Service } from "@/lib/famu-data";
import { getAccentClass } from "@/lib/famu-data";
import ProjectVisual from "@/components/ProjectVisual";

export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const { toggle, isSelected } = useSelection();
  const selected = isSelected(service.shortTitle);
  return <article className={`service-card ${featured ? "featured" : ""} ${getAccentClass(service.accent)}`}>
    <div className="service-card-top"><span className="service-number">{service.number} / {service.category}</span><button className={`favorite-button ${selected ? "selected" : ""}`} onClick={() => toggle(service.shortTitle)} aria-label={selected ? `Remover ${service.shortTitle} da selecção` : `Adicionar ${service.shortTitle} à selecção`}><Heart size={17} fill={selected ? "currentColor" : "none"} /></button></div>
    <div className="service-card-body"><span className="service-glyph">{service.number === "04" ? "↗" : service.number === "02" ? "◒" : service.number === "08" ? "⌁" : "✳"}</span><h3>{service.shortTitle}</h3><p>{service.description}</p></div>
    <div className="service-card-bottom"><Link href={`/servicos/${service.slug}`} className="text-link">Explorar serviço <ArrowUpRight size={15} /></Link><button className={`select-service ${selected ? "selected" : ""}`} onClick={() => toggle(service.shortTitle)}>{selected ? "Seleccionado" : "Tenho interesse"}<Plus size={14} /></button></div>
  </article>;
}

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return <Link href={`/portfolio/${project.slug}`} className={`project-card project-card-${index + 1}`}><div className={`project-card-art ${getAccentClass(project.accent)}`}><ProjectVisual project={project} compact /></div><div className="project-card-info"><span>{project.category} <i>↗</i></span><h3>{project.title}</h3><small>{project.type}</small></div></Link>;
}

export function SectionIntro({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) {
  return <div className="section-intro"><div><span className="eyebrow"><Sparkles size={13} /> {eyebrow}</span><h2>{title}</h2></div>{text && <p>{text}</p>}{action}</div>;
}

import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Link } from "wouter";
import { ProjectCard } from "@/components/FamuCards";
import { categories, projects } from "@/lib/famu-data";

const portfolioCategories = categories.filter((category, index) => index === 0 || category !== "Design");

export default function Portfolio() {
  const [active, setActive] = useState("Todos");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.filter((project) => (active === "Todos" || project.category === active) && `${project.title} ${project.category} ${project.type} ${project.description}`.toLowerCase().includes(query.toLowerCase())), [active, query]);
  return <div className="inner-page portfolio-page"><section className="inner-hero portfolio-hero"><div className="container inner-hero-grid"><div><span className="eyebrow">Portfólio / 02</span><h1>O visual é só o começo.</h1><p>Composições, sistemas e interfaces que mostram como transformamos informação, intenção e contexto em algo que se pode usar.</p></div><div className="inner-hero-index">{projects.length.toString().padStart(2, "0")}<br /><small>projectos<br />em destaque</small></div></div></section><section className="portfolio-catalog section-pad"><div className="container"><div className="portfolio-toolbar"><div className="category-tabs portfolio-tabs">{portfolioCategories.map((category) => <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)}>{category}</button>)}</div><div className="search-field search-small"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar projecto" />{query && <button onClick={() => setQuery("")} aria-label="Limpar pesquisa"><X size={14} /></button>}</div></div>{filtered.length ? <div className="portfolio-mosaic portfolio-page-mosaic">{filtered.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div> : <div className="empty-state"><h2>Nenhum projecto nesta combinação.</h2><button className="button button-outline" onClick={() => { setActive("Todos"); setQuery(""); }}>Limpar filtros</button></div>}<div className="portfolio-note"><span className="eyebrow">Nota editorial</span><p>Esta primeira colecção é uma demonstração da linguagem e dos tipos de solução da FAMU STUDIO. Os trabalhos reais podem ser adicionados e transformados em case studies através do CMS.</p><Link href="/contacto" className="text-link">Adicionar um projecto <ArrowUpRight size={15} /></Link></div></div></section></div>;
}

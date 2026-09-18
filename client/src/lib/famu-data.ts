export type Service = {
  slug: string;
  number: string;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  deliverables: string[];
  accent: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  type: string;
  description: string;
  accent: string;
  visual: "dashboard" | "brand" | "slides" | "portfolio" | "website" | "social";
};

export const brand = {
  name: "FAMU STUDIO",
  slogan: "Ideias que ganham forma.",
  description: "Design, dados e soluções digitais para pessoas e empresas.",
  whatsapp: "",
  email: "",
};

export const services: Service[] = [
  {
    slug: "design-grafico",
    number: "01",
    category: "Design",
    title: "Design gráfico que organiza a atenção.",
    shortTitle: "Design gráfico",
    description: "Materiais visuais profissionais para comunicar melhor, vender com clareza e dar consistência à sua presença.",
    deliverables: ["Flyers e cartazes", "Banners e brochuras", "Artes para redes sociais", "Catálogos e materiais de impressão"],
    accent: "lime",
  },
  {
    slug: "identidade-visual",
    number: "02",
    category: "Branding",
    title: "Uma identidade que se reconhece antes de se explicar.",
    shortTitle: "Identidade visual",
    description: "Construímos sistemas visuais coerentes para marcas que querem parecer tão profissionais quanto são.",
    deliverables: ["Logotipo e assinaturas", "Paleta e tipografia", "Aplicações da marca", "Manual de identidade"],
    accent: "violet",
  },
  {
    slug: "portfolios",
    number: "03",
    category: "Portfólios",
    title: "A sua experiência, apresentada com intenção.",
    shortTitle: "Portfólios profissionais",
    description: "Portfólios, CVs e apresentações profissionais pensados para tornar o seu percurso mais claro e memorável.",
    deliverables: ["Portfólio PDF ou digital", "CV profissional", "Apresentação institucional", "Perfil e personal branding"],
    accent: "blue",
  },
  {
    slug: "excel-dashboards",
    number: "04",
    category: "Excel & Dados",
    title: "Transformamos Excel numa ferramenta de gestão.",
    shortTitle: "Excel & dashboards",
    description: "Estruturamos dados dispersos em ferramentas que ajudam a acompanhar, decidir e trabalhar com menos fricção.",
    deliverables: ["Dashboards e KPIs", "Planilhas profissionais", "Automatização de processos", "Mapas de controlo e relatórios"],
    accent: "orange",
  },
  {
    slug: "apresentacoes",
    number: "05",
    category: "Apresentações",
    title: "Informação importante merece uma narrativa clara.",
    shortTitle: "Apresentações profissionais",
    description: "Apresentações corporativas, comerciais, académicas e de formação que tornam a informação mais fácil de seguir.",
    deliverables: ["Apresentações institucionais", "Propostas comerciais", "Relatórios e projectos", "Materiais para formação"],
    accent: "pink",
  },
  {
    slug: "social-media",
    number: "06",
    category: "Social Media",
    title: "Presença consistente para cada ponto de contacto.",
    shortTitle: "Social media design",
    description: "Sistemas visuais e conteúdos para redes sociais, com direção suficiente para manter a marca reconhecível.",
    deliverables: ["Posts e stories", "Carrosséis e capas", "Kits visuais", "Campanhas e calendários"],
    accent: "cyan",
  },
  {
    slug: "materiais-formacao",
    number: "07",
    category: "Formação",
    title: "Informação complexa também pode ser simples de entender.",
    shortTitle: "Materiais de formação",
    description: "Apostilas, manuais e infográficos que tornam conhecimento mais acessível, organizado e utilizável.",
    deliverables: ["Apostilas e manuais", "Fichas e certificados", "Infográficos", "Templates didácticos"],
    accent: "yellow",
  },
  {
    slug: "websites",
    number: "08",
    category: "Digital",
    title: "A sua presença digital começa antes do primeiro contacto.",
    shortTitle: "Websites & presença digital",
    description: "Websites, landing pages e catálogos digitais com estrutura, personalidade e espaço para crescer.",
    deliverables: ["Websites institucionais", "Landing pages", "Portfólios digitais", "Catálogos e páginas de serviços"],
    accent: "green",
  },
];

export const projects: Project[] = [
  { slug: "sistema-de-controlo", title: "Sistema de controlo", category: "Excel & Dashboards", type: "Direcção de interface", description: "Uma demonstração de como indicadores, filtros e estados podem transformar dados numa ferramenta de decisão.", accent: "lime", visual: "dashboard" },
  { slug: "brand-board", title: "Brand board", category: "Branding", type: "Sistema visual", description: "Composição demonstrativa de paleta, tipografia e aplicações para uma identidade com presença.", accent: "violet", visual: "brand" },
  { slug: "apresentacao-institucional", title: "Apresentação institucional", category: "Apresentações", type: "Narrativa visual", description: "Uma estrutura editorial para apresentar uma organização com ritmo, hierarquia e clareza.", accent: "orange", visual: "slides" },
  { slug: "portfolio-profissional", title: "Portfólio profissional", category: "Portfólios", type: "Posicionamento", description: "Exemplo de uma apresentação profissional que transforma percurso em argumento visual.", accent: "blue", visual: "portfolio" },
  { slug: "presenca-digital", title: "Presença digital", category: "Websites", type: "Experiência web", description: "Uma interface digital com foco em descoberta, confiança e contacto sem ruído.", accent: "cyan", visual: "website" },
  { slug: "kit-social-media", title: "Kit social media", category: "Social Media", type: "Sistema de conteúdo", description: "Um conjunto demonstrativo de peças que mantém consistência entre formatos e momentos.", accent: "pink", visual: "social" },
];

export const categories = ["Todos", "Design", "Branding", "Excel & Dashboards", "Apresentações", "Portfólios", "Websites", "Social Media"];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function buildInquiryMessage(items: string[]) {
  const list = items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Ainda estou a explorar as soluções.";
  return `Olá, FAMU STUDIO!\n\nGostaria de solicitar informações sobre:\n${list}\n\nGostaria de receber informações sobre disponibilidade, prazo e orçamento.`;
}

export function getVisualClass(visual: Project["visual"]) {
  return `project-visual project-visual--${visual}`;
}

export function getAccentClass(accent: string) {
  return `accent-${accent}`;
}

export type { Project as FamuProject };

export default services;

// Conteúdo demonstrativo preparado para ser substituído/gerido por CMS.
// Nenhuma estatística, cliente, preço ou resultado comercial é assumido como real.

export const commercialPrinciples = [
  { label: "Explorar", text: "Descubra o que pode resolver." },
  { label: "Seleccionar", text: "Guarde o que faz sentido." },
  { label: "Combinar", text: "Construa a sua solução." },
  { label: "Solicitar", text: "Envie um briefing claro." },
];

export const processSteps = [
  { number: "01", title: "Conversa", text: "Entendemos a necessidade antes de propor qualquer forma." },
  { number: "02", title: "Briefing", text: "Definimos objectivos, referências e entregáveis." },
  { number: "03", title: "Concepção", text: "Desenvolvemos uma solução com intenção." },
  { number: "04", title: "Revisão", text: "Apresentamos, ajustamos e afinamos." },
  { number: "05", title: "Entrega", text: "Organizamos os ficheiros finais para serem usados." },
];

export const b2bServices = ["Apresentações institucionais", "Dashboards e relatórios", "Ferramentas Excel", "Materiais de formação", "Templates e documentos", "Websites e catálogos"];

export const professionalServices = ["CV profissional", "Portfólio", "Apresentação profissional", "Perfil visual", "Cartão digital", "Personal branding"];

export const faqs = [
  { question: "Trabalham apenas com empresas?", answer: "Não. A FAMU STUDIO cria soluções para empresas, profissionais, empreendedores, estudantes e projectos que precisam de comunicar melhor." },
  { question: "Existe uma tabela de preços?", answer: "Algumas soluções podem ter preço definido. Projectos personalizados são avaliados a partir do briefing, para que o orçamento corresponda ao que realmente precisa." },
  { question: "Posso combinar vários serviços?", answer: "Sim. Pode guardar serviços na sua selecção e enviar um único pedido com tudo o que pretende explorar." },
];

export const contactConfig = {
  whatsapp: brand.whatsapp,
  email: brand.email,
  instagram: "",
  facebook: "",
  linkedin: "",
  location: "",
};

export const suggestedCombinations = [
  { title: "Quero melhorar a minha marca", items: ["Identidade visual", "Kit social media", "Website"] },
  { title: "Preciso de uma solução para a empresa", items: ["Apresentação institucional", "Dashboard Excel", "Portfólio empresarial"] },
  { title: "Quero apresentar melhor o meu trabalho", items: ["CV profissional", "Portfólio profissional", "Apresentação profissional"] },
];

export const serviceAliases: Record<string, string> = {
  excel: "excel-dashboards",
  dashboard: "excel-dashboards",
  design: "design-grafico",
  branding: "identidade-visual",
  website: "websites",
};

export function findServiceByTerm(term: string) {
  const normalized = term.toLowerCase().trim();
  const alias = serviceAliases[normalized];
  return services.find((service) => service.slug === alias || service.title.toLowerCase().includes(normalized) || service.category.toLowerCase().includes(normalized));
}

export const pageMeta = {
  title: "FAMU STUDIO | Design, Dados e Soluções Digitais",
  description: "Design gráfico, identidade visual, portfólios, apresentações, Excel, dashboards, automação e soluções digitais para profissionais e empresas.",
};

export const emptyContentNote = "Conteúdo preparado para actualização pela FAMU STUDIO.";

export const allServiceNames = services.map((service) => service.shortTitle);

export const allProjectNames = projects.map((project) => project.title);

export const serviceCount = services.length;

export const projectCount = projects.length;

export const isConfiguredContact = Boolean(brand.whatsapp || brand.email);

export const legalLinks = ["Política de privacidade", "Termos"];

export const footerLinks = [
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Sobre", href: "/sobre" },
  { label: "Processo", href: "/#processo" },
  { label: "Contacto", href: "/contacto" },
];

export const navLinks = [
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Soluções", href: "/#solucoes" },
  { label: "Sobre", href: "/sobre" },
];

export const serviceCategories = Array.from(new Set(services.map((service) => service.category)));

export const projectCategories = Array.from(new Set(projects.map((project) => project.category)));

export const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service]));

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));

export const appVersion = "MVP 01";

export const contentStatus = "Conteúdo demonstrativo — pronto para substituição.";

export const noPriceMessage = "Sob consulta";

export const defaultInquirySubject = "Pedido de orçamento — FAMU STUDIO";

export const defaultInquiryMessage = "Explique-nos o que pretende criar, melhorar ou organizar.";

export const maxSelectionSize = 12;

export const serviceSearchPlaceholder = "O que procura?";

export const catalogTitle = "Encontre a peça certa para o próximo passo.";

export const catalogDescription = "Explore serviços como quem monta uma solução: guarde, combine e envie o seu pedido quando estiver pronto.";

export const selectionTitle = "A sua selecção";

export const selectionEmpty = "Ainda não guardou nenhum serviço. Explore o catálogo e marque o que faz sentido para o seu projecto.";

export const quoteCta = "Começar um projecto";

export const mainCta = "Solicitar orçamento";

export const secondaryCta = "Explorar trabalhos";

export const brandPill = "ESTÚDIO CRIATIVO + SOLUÇÕES DIGITAIS";

export const heroHeadline = "Ideias que ganham forma.";

export const heroDescription = "Transformamos ideias em design, dados em soluções e negócios em presença — com clareza, intenção e espaço para crescer.";

export const credibilityLine = "Design que comunica. Dados que explicam. Soluções que simplificam.";

export const b2bTitle = "Soluções para empresas que precisam de mais do que um design.";

export const professionalTitle = "A sua imagem profissional também comunica.";

export const aboutTitle = "Por trás de cada solução existe uma forma de pensar.";

export const finalCtaTitle = "Tem uma ideia a meio caminho?";

export const finalCtaText = "Conte-nos o que precisa. A primeira conversa serve para pôr ordem, descobrir possibilidades e dar forma ao próximo passo.";

export const sourceNote = "Base editorial criada a partir do Prompt Master FAMU STUDIO.";

import { Facebook } from "lucide-react";
import { contactConfig } from "@/lib/famu-data";

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M15.6 3c.3 1.8 1.3 3 3.1 3.3v2.7a8 8 0 0 1-3.1-1v6.4a5.6 5.6 0 1 1-4.8-5.5v2.8a2.8 2.8 0 1 0 2 2.7V3h2.8Z" /></svg>;
}

export default function SocialLinks() {
  return <div className="social-links" aria-label="Redes sociais FAMU STUDIO">
    <a href={contactConfig.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok FAMU STUDIO" title="TikTok"><TikTokIcon /></a>
    <a href={contactConfig.facebook} target="_blank" rel="noreferrer" aria-label="Facebook FAMU STUDIO" title="Facebook"><Facebook size={17} strokeWidth={1.8} /></a>
  </div>;
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/lib/brand";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="wordmark">
          VALETTO
        </Link>
        <p>{brand.signature}</p>
      </div>
      <div className="footer-links">
        <a href={brand.instagram} target="_blank" rel="noreferrer">
          Instagram <ArrowUpRight size={14} />
        </a>
        <Link href="/privacidade">Privacidade</Link>
        <span>Belo Horizonte · MG</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VALETTO</span>
        <span>Feita para quem valoriza o caminho.</span>
      </div>
    </footer>
  );
}

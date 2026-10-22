"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  { href: "/#essencia", text: "A essência" },
  { href: "/#como-funciona", text: "Como funciona" },
  { href: "/#servicos", text: "A experiência" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 601px)");
    const onLayout = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onLayout);
    return () => desktop.removeEventListener("change", onLayout);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <>
      <header className="site-header">
        <Link
          className="wordmark"
          href="/"
          aria-label="VALETTO Motorcycle Concierge, início"
        >
          VALETTO<span> MOTORCYCLE CONCIERGE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.text}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/#lancamento">
          O próximo capítulo <ArrowUpRight size={15} />
        </Link>
        <button
          ref={menuButton}
          className="menu-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Navegação móvel"
          hidden={!open}
        >
          {[
            ...links,
            { href: "/#lancamento", text: "Acompanhe o lançamento" },
          ].map((l) => (
            <Link onClick={() => setOpen(false)} key={l.href} href={l.href}>
              {l.text}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      </header>
      <noscript>
        <style>{`.menu-button { display: none !important; }`}</style>
        <nav className="no-js-nav" aria-label="Navegação sem JavaScript">
          {[
            ...links,
            { href: "/#lancamento", text: "Acompanhe o lançamento" },
          ].map((link) => (
            <a key={link.href} href={link.href}>
              {link.text}
            </a>
          ))}
        </nav>
      </noscript>
    </>
  );
}

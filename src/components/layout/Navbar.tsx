import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../devops/brand-icons';
import { useLocale, type Locale } from '../../lib/i18n';

const navLinks: Record<Locale, { label: string; href: string }[]> = {
  en: [
    { label: 'Projects', href: '#projects' },
    { label: 'Stack', href: '#stack' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Contact', href: '#contact' },
  ],
  pt: [
    { label: 'Projetos', href: '#projects' },
    { label: 'Stack', href: '#stack' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Contato', href: '#contact' },
  ],
};

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/lucasgpadilha', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucasgpadilha/', icon: LinkedinIcon },
  { label: 'Email', href: 'mailto:lucasgpadilhatec@gmail.com', icon: Mail },
];

function useActiveSection() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = navLinks.en
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(`#${entry.target.id}`, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = '';
        let bestRatio = 0;
        for (const [href, ratio] of visible) {
          if (ratio > bestRatio) {
            best = href;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.2, 0.5, 0.8] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const active = useActiveSection();
  const menuLabel = locale === 'pt' ? (open ? 'Fechar menu' : 'Abrir menu') : open ? 'Close menu' : 'Open menu';

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 right-0 top-6 z-50 px-4 sm:top-8 md:px-8"
    >
      <nav className="nav-glass mx-auto flex h-12 max-w-7xl items-center justify-between rounded-xl px-4 text-sm text-white/80 sm:px-6">
        <a href="#" className="text-[13px] font-semibold tracking-tight text-white">
          Lucas Padilha
        </a>

        <div className="hidden items-center gap-1 md:flex lg:gap-3">
          {navLinks[locale].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative rounded-md px-2.5 py-1 text-[13px] transition hover:text-white ${
                active === link.href ? 'text-white' : 'text-white/55'
              }`}
            >
              {link.label}
              {active === link.href && (
                <span className="absolute -bottom-0.5 left-2.5 right-2.5 h-px bg-[var(--signal)]" />
              )}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <div className="mr-1 flex rounded-md border border-white/10 bg-white/[0.025] p-0.5">
            {(['en', 'pt'] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                  locale === item ? 'bg-white text-[#0a0b0d]' : 'text-white/50 hover:text-white'
                }`}
                aria-pressed={locale === item}
              >
                {item}
              </button>
            ))}
          </div>
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              aria-label={label}
              className="grid h-8 w-8 place-items-center rounded-full text-white/72 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/[0.08] md:hidden"
          aria-label={menuLabel}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="nav-glass mx-auto mt-2 flex max-w-7xl flex-col rounded-2xl p-2 text-sm text-white/80 md:hidden"
          >
            {navLinks[locale].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-white/10 px-2 pt-2">
              <div className="flex items-center gap-1 rounded-xl py-2">
                {(['en', 'pt'] as Locale[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLocale(item)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition ${
                      locale === item ? 'bg-white text-[#061018]' : 'bg-white/[0.04] text-white/58'
                    }`}
                    aria-pressed={locale === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full text-white/72 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

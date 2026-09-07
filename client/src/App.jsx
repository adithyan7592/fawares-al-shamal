import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Headphones,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scale,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import QuoteForm from "./QuoteForm.jsx";
import { copy } from "./copy.js";

const PHONE = import.meta.env.VITE_PHONE || "+966 54 361 3464";
const PHONE_2 = import.meta.env.VITE_PHONE_2 || "+966 535133064";
const EMAIL = import.meta.env.VITE_EMAIL || "infofawares@gmail.com";
const WHATSAPP = import.meta.env.VITE_WHATSAPP || "966543613464";

const MATERIAL_IMAGES = {
  ferrous: "/images/ferrous.jpg",
  copper: "/images/copper.jpg",
  aluminium: "/images/aluminium.jpg",
  cables: "/images/cables.jpg",
  industrial: "/images/industrial.jpg",
  mixed: "/images/mixed.jpg",
};
const GALLERY_SRC = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14].map(
  (i) => `/images/gallery/gallery-${String(i).padStart(2, "0")}.jpg?v=1`
);

const STEP_ICONS = [MessageCircle, FileText, Scale, Truck, Wallet];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("fas-lang") || "en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const t = copy[lang];
  const rtl = lang === "ar";

  useEffect(() => {
    localStorage.setItem("fas-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.body.classList.toggle("rtl", rtl);
  }, [lang, rtl, t.dir]);
  useEffect(() => {
  const el = document.getElementById("about");
  if (!el) return;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) el.classList.add("about-in");
    },
    { threshold: 0.18 }
  );
  io.observe(el);
  return () => io.disconnect();
}, []);
useEffect(() => {
  if (galleryIndex === null) return;
  function onKey(e) {
    if (e.key === "Escape") setGalleryIndex(null);
    if (e.key === "ArrowRight") setGalleryIndex((i) => (i + 1) % GALLERY_SRC.length);
    if (e.key === "ArrowLeft") setGalleryIndex((i) => (i - 1 + GALLERY_SRC.length) % GALLERY_SRC.length);
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [galleryIndex]);

  const nav = useMemo(
    () => [
      { href: "#home", label: t.nav.home },
      { href: "#about", label: t.nav.about },
      { href: "#materials", label: t.nav.materials },
      { href: "#process", label: t.nav.process },
      { href: "#areas", label: t.nav.areas },
      { href: "#contact", label: t.nav.contact },
      { href: "#gallery", label: t.nav.gallery },
    ],
    [t]
  );

  function openQuote() {
    setQuoteOpen(true);
    setMenuOpen(false);
  }

  return (
    <div className={rtl ? "font-arabic" : ""}>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-forest-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2.5 text-white">
            <img
              src="/logo.png"
              alt="Fawares Al Shamal Environmental Services"
              className="h-11 w-11 rounded-md bg-cream-50 object-contain p-0.5"
            />
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-wide">FAWARES AL SHAMAL</span>
              <span className="block text-[11px] text-cream-200/80">Environmental Services</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-cream-100 lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-moss-300">
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold"
            >
              {lang === "en" ? "AR" : "EN"}
            </button>
            <button
              type="button"
              onClick={openQuote}
              className="rounded-full bg-moss-400 px-4 py-2 font-semibold text-forest-950 hover:bg-moss-300"
            >
              {t.nav.contact}
            </button>
          </nav>
          <button
            type="button"
            className="text-white lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen ? (
          <div className="space-y-3 border-t border-white/10 bg-forest-950 px-4 py-4 lg:hidden">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-cream-100"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-full border border-white/20 px-3 py-2 text-sm text-white"
              >
                {lang === "en" ? "العربية" : "English"}
              </button>
              <button
                type="button"
                onClick={openQuote}
                className="rounded-full bg-moss-400 px-4 py-2 text-sm font-semibold text-forest-950"
              >
                {t.hero.quote}
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <section id="home" className="relative min-h-[100svh] pt-20">
        <img
          src="/images/hero.jpg"
          alt="Scrap yard operations"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-moss-300">{t.hero.eyebrow}</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{t.hero.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-100/90">{t.hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-md bg-moss-400 px-4 py-2.5 text-sm font-bold text-forest-950 hover:bg-moss-300"
              >
                <Phone size={16} /> {PHONE}
              </a>
              <button
                type="button"
                onClick={openQuote}
                className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
              >
                {t.hero.quote} <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="quote-panel rounded-2xl p-5 shadow-2xl sm:p-6">
            <h2 className="mb-4 font-display text-2xl text-white">{t.hero.quote}</h2>
            <QuoteForm t={t} />
          </div>
        </div>
      </section>
<section id="about" className="about-board">
  <div className="about-copy-cell">
    <p className="about-kicker">{t.about.eyebrow}</p>
    <h2 className="about-heading">{t.about.title}</h2>
    <p className="about-body">{t.about.p1}</p>
    <p className="about-body">{t.about.p2}</p>
  </div>
  <figure className="about-photo">
    <img src="/images/about.jpg?v=2" alt="Fleet truck used for scrap collection" />
  </figure>

  <figure className="about-photo">
    <img src="/images/industrial.jpg" alt="Industrial scrap handling" />
  </figure>
  <div className="about-copy-cell">
    <p className="about-kicker">{t.about.commitment}</p>
    <h3 className="about-sub">{t.about.points[0].title}</h3>
    <p className="about-body">{t.about.points[0].text}</p>
    <h3 className="about-sub">{t.about.points[1].title}</h3>
    <p className="about-body">{t.about.points[1].text}</p>
  </div>

  <div className="about-copy-cell">
    <h3 className="about-sub">{t.about.points[2].title}</h3>
    <p className="about-body">{t.about.points[2].text}</p>
    <h3 className="about-sub">{t.about.points[3].title}</h3>
    <p className="about-body">{t.about.points[3].text}</p>
  </div>
  <figure className="about-photo">
    <img src="/images/ferrous.jpg" alt="Ferrous metal collection" />
  </figure>

  <figure className="about-photo">
    <img src="/images/aluminium.jpg" alt="Material transport and handling" />
  </figure>
  <div className="about-copy-cell">
    <h3 className="about-sub">{t.about.points[4].title}</h3>
    <p className="about-body">{t.about.points[4].text}</p>
    <p className="about-body">{t.areas.text}</p>
  </div>
</section>

      <section id="materials" className="bg-cream-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-moss-500">
            {t.materials.eyebrow}
          </p>
          <h2 className="mt-2 text-center font-display text-3xl text-forest-800 sm:text-4xl">{t.materials.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-stone-600">{t.materials.intro}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.materials.items.map((item) => (
              <article key={item.key} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200/70">
                <img src={MATERIAL_IMAGES[item.key]} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-xl text-forest-800">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
                  <button
                    type="button"
                    onClick={openQuote}
                    className="mt-4 text-sm font-semibold text-forest-700 hover:text-moss-500"
                  >
                    {t.materials.more} →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="soft-grid bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-moss-500">
            {t.process.eyebrow}
          </p>
          <h2 className="mt-2 text-center font-display text-3xl text-forest-800 sm:text-4xl">{t.process.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-stone-600">{t.process.intro}</p>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {t.process.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={step.title} className="step-line relative text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-moss-400/20 text-forest-800">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-forest-800">{step.title}</h3>
                  <p className="mt-2 text-sm text-stone-600">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-wrap">
  <div className="mx-auto max-w-6xl px-4">
    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-moss-500">
      {t.gallery.eyebrow}
    </p>
    <h2 className="mt-2 text-center font-display text-3xl text-forest-800 sm:text-4xl">{t.gallery.title}</h2>
    <p className="mx-auto mt-4 max-w-3xl text-center text-stone-600">{t.gallery.intro}</p>
    <div className="gallery-grid">
      {GALLERY_SRC.map((src, i) => (
        <button key={src} type="button" className="gallery-item" onClick={() => setGalleryIndex(i)}>
          <img src={src} alt={t.gallery.items[i]} />
        </button>
      ))}
    </div>
  </div>
</section>

      <section id="areas" className="areas-split">
        <figure className="areas-photo">
          <img src="/images/gallery/gallery-11.jpg" alt={t.gallery.items[9]} />
        </figure>
        <div className="areas-copy">
          <p className="about-kicker">{t.areas.eyebrow}</p>
          <h2 className="about-heading">{t.areas.title}</h2>
          <p className="about-body">{t.areas.text}</p>
          <ul className="areas-points">
            {t.areas.points.map((point) => (
              <li key={point.title}>
                <BadgeCheck size={18} />
                <span>
                  <strong>{point.title}</strong>
                  {point.text}
                </span>
              </li>
            ))}
          </ul>
          <p className="areas-pin">
            <MapPin size={16} />
            {t.contact.locationValue}
          </p>
          <button type="button" className="areas-cta" onClick={openQuote}>
            {t.areas.quote} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section id="contact" className="bg-forest-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-white/10 bg-forest-800/60 p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-moss-400 text-forest-950">
                <Headphones size={22} />
              </span>
              <div>
                <h2 className="font-display text-3xl">{t.cta.title}</h2>
                <p className="mt-2 max-w-xl text-cream-100/85">{t.cta.text}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
              <button
                type="button"
                onClick={openQuote}
                className="rounded-md bg-moss-400 px-5 py-2.5 text-sm font-bold text-forest-950 hover:bg-moss-300"
              >
                {t.cta.quote} →
              </button>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                {t.cta.contact} →
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/5 p-4">
              <p className="flex items-center gap-2 text-sm text-moss-300">
                <Phone size={16} /> {t.contact.call}
              </p>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="mt-1 block font-semibold hover:text-moss-300">
                {PHONE}
              </a>
              <a href={`tel:${PHONE_2.replace(/\s/g, "")}`} className="mt-1 block font-semibold hover:text-moss-300">
                {PHONE_2}
              </a>
            </div>
            <a href={`mailto:${EMAIL}`} className="rounded-xl bg-white/5 p-4 hover:bg-white/10">
              <p className="flex items-center gap-2 text-sm text-moss-300">
                <Mail size={16} /> {t.contact.email}
              </p>
              <p className="mt-1 font-semibold">{EMAIL}</p>
            </a>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="flex items-center gap-2 text-sm text-moss-300">
                <MapPin size={16} /> {t.contact.location}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug">{t.contact.locationValue}</p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/5 p-4 hover:bg-white/10"
            >
              <p className="flex items-center gap-2 text-sm text-moss-300">
                <MessageCircle size={16} /> {t.contact.whatsapp}
              </p>
              <p className="mt-1 font-semibold">{t.contact.chat} →</p>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-forest-950 px-4 py-6 text-sm text-cream-200/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Fawares Al Shamal Environmental Services Co. {t.footer.rights}</p>
          <a href="/admin" className="hover:text-white">
            {t.footer.admin}
          </a>
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
        aria-label="WhatsApp"
      >
        <MessageCircle />
      </a>

      {quoteOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4" onClick={() => setQuoteOpen(false)}>
          <div
            className="quote-panel w-full max-w-md rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between text-white">
              <h3 className="font-display text-2xl">{t.modal.title}</h3>
              <button type="button" onClick={() => setQuoteOpen(false)} aria-label={t.modal.close}>
                <X />
              </button>
            </div>
            <QuoteForm t={t} compact onSuccess={() => setTimeout(() => setQuoteOpen(false), 1200)} />
          </div>
        </div>
      ) : null}

      {galleryIndex !== null ? (
  <div className="gallery-lightbox" onClick={() => setGalleryIndex(null)}>
    <button type="button" className="gallery-lightbox-close" aria-label={t.gallery.close}>
      <X />
    </button>
    <button
      type="button"
      className="gallery-nav gallery-nav-prev"
      aria-label={t.gallery.prev}
      onClick={(e) => {
        e.stopPropagation();
        setGalleryIndex((i) => (i - 1 + GALLERY_SRC.length) % GALLERY_SRC.length);
      }}
    >
      ‹
    </button>
    <img
      src={GALLERY_SRC[galleryIndex]}
      alt={t.gallery.items[galleryIndex]}
      onClick={(e) => e.stopPropagation()}
    />
    <button
      type="button"
      className="gallery-nav gallery-nav-next"
      aria-label={t.gallery.next}
      onClick={(e) => {
        e.stopPropagation();
        setGalleryIndex((i) => (i + 1) % GALLERY_SRC.length);
      }}
    >
      ›
    </button>
  </div>
) : null}

    </div>
  );
}

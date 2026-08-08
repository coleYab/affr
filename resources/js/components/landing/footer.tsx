import { Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import React from 'react';
import { TRANSLATIONS } from '@/constants';
import type { Language } from '@/types/app';

interface FooterProps {
  language?: Language;
}

const Footer: React.FC<FooterProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language].footer;

  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <img
                  src="/logo-square.png"
                  alt="Afro Equb Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                Afro<span className="text-royal">Equb</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/60">
              {t.desc}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/18DsEfM8fc/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-royal"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/blessedekub?igsh=NmZhZDFncncwbmVu&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-royal"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://t.me/Blessedekub"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-royal"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@blessedekubb?_r=1&_t=ZS-94829cq6xq1"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-royal"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
              {t.contact}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-royal">
                  <Phone className="h-4 w-4" />
                </span>
                +251 907 525 801
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-royal">
                  <MapPin className="h-4 w-4" />
                </span>
                Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-royal">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#lucky-numbers" className="transition-colors hover:text-royal">
                  Lucky Numbers
                </a>
              </li>
              <li>
                <Link href="/terms" prefetch className="transition-colors hover:text-royal">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" prefetch className="transition-colors hover:text-royal">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">Get Started</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#tickets" className="inline-flex items-center gap-1 transition-colors hover:text-royal">
                  Join Today
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <img
            src="/afroequb logo 3.png"
            alt="AfroEqub"
            className="mx-auto h-auto w-full max-w-6xl object-contain select-none"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

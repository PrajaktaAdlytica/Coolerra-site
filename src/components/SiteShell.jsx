import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { productLinks, solutionLinks } from "../data.js";

export function Brand({ reversed = false }) {
  return (
    <a className="brand" href="/" aria-label="Coolerra home">
      <img
        src={reversed ? "/assets/brand/coolerra-logo-horizontal-reversed.svg" : "/assets/brand/coolerra-logo-horizontal.svg"}
        alt="Coolerra"
      />
    </a>
  );
}

function Dropdown({ label, links, open, onToggle, onClose }) {
  const id = `${label.toLowerCase()}-menu`;
  return (
    <div className={`nav-dropdown ${open ? "is-open" : ""}`}>
      <button
        className="nav-link nav-link--trigger"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        {label}
        <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <div className="nav-menu" id={id} role="menu">
        <span className="nav-menu__label">{label}</span>
        {links.map((link, index) => (
          <a key={link.href} href={link.href} role="menuitem" onClick={onClose}>
            <span className={`nav-menu__accent nav-menu__accent--${index}`} />
            <span>
              <strong>{link.label}</strong>
              <small>{link.detail}</small>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({ dark = false }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header ref={headerRef} className={`site-header ${dark ? "site-header--dark" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <Brand reversed={dark} />
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((value) => !value)}
      >
        {mobileOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className="site-nav" aria-label="Primary navigation">
        <Dropdown
          label="Product"
          links={productLinks}
          open={openMenu === "product"}
          onToggle={() => setOpenMenu(openMenu === "product" ? null : "product")}
          onClose={closeAll}
        />
        <Dropdown
          label="Solutions"
          links={solutionLinks}
          open={openMenu === "solutions"}
          onToggle={() => setOpenMenu(openMenu === "solutions" ? null : "solutions")}
          onClose={closeAll}
        />
        <a className="nav-link" href="/technology">Technology</a>
        <a className="nav-link" href="/pricing">Pricing</a>
        <a className="nav-link" href="/company">Company</a>
        <a className="nav-link" href="/news/tiphub-allocation">News</a>
        <a className="nav-link nav-link--signin" href="/sign-in">Sign In</a>
        <a className="button button--small" href="/demo">Request a Demo</a>
      </nav>
    </header>
  );
}

export function ButtonLink({ href, children, secondary = false, light = false, className = "" }) {
  return (
    <a className={`button ${secondary ? "button--secondary" : ""} ${light ? "button--light" : ""} ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}

export function SectionIntro({ index, eyebrow, title, body, dark = false }) {
  return (
    <div className={`section-intro ${dark ? "section-intro--dark" : ""}`}>
      <p className="eyebrow">{index ? `${index} / ` : ""}{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p className="section-intro__body">{body}</p>}
    </div>
  );
}

export function ClaimTag({ children, dark = false }) {
  return <span className={`claim-tag ${dark ? "claim-tag--dark" : ""}`}>{children}</span>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top shell">
        <div className="footer-brand">
          <Brand />
          <p>Thermal intelligence for dense compute.</p>
          <span className="brand-rule" />
        </div>
        <div className="footer-links">
          <FooterGroup title="Product" links={productLinks} />
          <FooterGroup title="Solutions" links={solutionLinks} />
          <FooterGroup title="Company" links={[
            { label: "Company", href: "/company" },
            { label: "News", href: "/news/tiphub-allocation" },
            { label: "Resources", href: "/resources" },
            { label: "Contact", href: "/contact" },
            { label: "Security", href: "/security" },
          ]} />
          <FooterGroup title="Legal" links={[
            { label: "Privacy", href: "/legal/privacy" },
            { label: "Terms", href: "/legal/terms" },
            { label: "Sign In", href: "/sign-in" },
            { label: "Request a Demo", href: "/demo" },
          ]} />
        </div>
      </div>
      <div className="footer-statement shell">
        <h2>Infrastructure gets denser.<br />Cooling decisions get clearer.</h2>
        <Newsletter />
      </div>
      <div className="footer-bottom shell">
        <div className="footer-office">
          <strong>Coolerra</strong>
          <address>Warsaw, Poland<br />European Union</address>
        </div>
        <div className="footer-socials" aria-label="Coolerra social media">
          <SocialLink href="https://www.linkedin.com/company/coolerra/" label="LinkedIn"><SocialIcon type="linkedin" /></SocialLink>
          <SocialLink href="https://www.instagram.com/coolerra/" label="Instagram"><SocialIcon type="instagram" /></SocialLink>
          <SocialLink href="https://www.youtube.com/@coolerra" label="YouTube"><SocialIcon type="youtube" /></SocialLink>
        </div>
        <span className="footer-copyright">© 2026 Coolerra. Product concept presented without fabricated claims.</span>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }) {
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>{children}</a>;
}

function SocialIcon({ type }) {
  if (type === "linkedin") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.3 8.1H3.1V21h3.2V8.1ZM4.7 3A1.9 1.9 0 1 0 4.7 6.8 1.9 1.9 0 0 0 4.7 3ZM21 13.6c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.8 2.1V8.1H9.1V21h3.2v-6.4c0-1.7.3-3.4 2.5-3.4 2.1 0 2.1 2 2.1 3.5V21H21v-7.4Z" /></svg>;
  }
  if (type === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle className="social-icon-dot" cx="17.4" cy="6.8" r="1" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 6.3c-.2-1-1-1.8-2-2C17.7 3.8 12 3.8 12 3.8s-5.7 0-7.4.5c-1 .2-1.8 1-2 2C2.1 8 2.1 12 2.1 12s0 4 .5 5.7c.2 1 1 1.8 2 2 1.7.5 7.4.5 7.4.5s5.7 0 7.4-.5c1-.2 1.8-1 2-2 .5-1.7.5-5.7.5-5.7s0-4-.5-5.7ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>;
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <h3>{title}</h3>
      {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
    </div>
  );
}

function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="newsletter"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="newsletter-email">Product updates</label>
      <div>
        <input id="newsletter-email" name="email" type="email" required placeholder="Work email" />
        <button type="submit" aria-label="Subscribe">
          {submitted ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
      <small aria-live="polite">{submitted ? "Thanks. Your interest has been recorded." : "Occasional engineering and product notes."}</small>
    </form>
  );
}

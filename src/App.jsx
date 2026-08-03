import { HomePage } from "./pages/HomePage.jsx";
import {
  CompanyPage,
  ContactPage,
  DemoPage,
  LegalPage,
  TipHubAnnouncementPage,
  PlatformPage,
  PricingPage,
  ProductPage,
  ResourcesPage,
  SecurityPage,
  SignInPage,
  SolutionPage,
  TechnologyPage,
} from "./pages/Pages.jsx";

function RouteNotFound() {
  return (
    <main className="not-found">
      <img src="/assets/brand/coolerra-mark-color.svg" alt="" />
      <p className="eyebrow">404 / Outside the model</p>
      <h1>This thermal state is not mapped.</h1>
      <a className="button" href="/">Return to Coolerra</a>
    </main>
  );
}

function getPageTitle(path) {
  const titles = {
    "/": "Coolerra | Thermal intelligence for AI infrastructure",
    "/platform": "Platform | Coolerra",
    "/technology": "Technology | Coolerra",
    "/security": "Security | Coolerra",
    "/pricing": "Pricing | Coolerra",
    "/company": "Company | Coolerra",
    "/resources": "Resources | Coolerra",
    "/contact": "Contact | Coolerra",
    "/demo": "Request a Demo | Coolerra",
    "/sign-in": "Sign In | Coolerra",
    "/legal/privacy": "Privacy | Coolerra",
    "/legal/terms": "Terms | Coolerra",
    "/news/tiphub-allocation": "Coolerra joins the TipHub portfolio",
  };

  if (path.startsWith("/products/")) {
    const product = path.split("/").pop();
    return `Coolerra ${product.charAt(0).toUpperCase()}${product.slice(1)} | Thermal intelligence`;
  }
  if (path.startsWith("/solutions/")) {
    const solution = path.split("/").pop().split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return `${solution} | Coolerra`;
  }
  return titles[path] || "Page not found | Coolerra";
}

function updatePageMetadata(path) {
  const isAnnouncement = path === "/news/tiphub-allocation";
  const defaultDescription = "Coolerra thermal intelligence for GPU-heavy data centers, GPU cloud, colocation, and enterprise server rooms.";
  const description = isAnnouncement
    ? "TipHub announces a $550K portfolio allocation to Coolerra, supporting its work across AI infrastructure for data centres."
    : defaultDescription;
  const title = getPageTitle(path);

  const setMeta = (selector, attribute, value) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      const [name, key] = attribute;
      element.setAttribute(name, key);
      document.head.appendChild(element);
    }
    element.setAttribute("content", value);
  };

  document.title = title;
  setMeta('meta[name="description"]', ["name", "description"], description);
  setMeta('meta[property="og:title"]', ["property", "og:title"], title);
  setMeta('meta[property="og:description"]', ["property", "og:description"], description);
  setMeta('meta[property="og:type"]', ["property", "og:type"], isAnnouncement ? "article" : "website");
  setMeta('meta[property="og:image"]', ["property", "og:image"], "https://www.coolerra.com/assets/visual/coolerra-entry-thermal-boundary.png");

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (isAnnouncement) {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.coolerra.com/news/tiphub-allocation";
    setMeta('meta[property="og:url"]', ["property", "og:url"], canonical.href);
  } else {
    canonical?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
  }
}

export function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  updatePageMetadata(path);
  if (path === "/") return <HomePage />;
  if (path === "/platform") return <PlatformPage />;
  if (path.startsWith("/products/")) return <ProductPage productKey={path.split("/").pop()} />;
  if (path.startsWith("/solutions/")) return <SolutionPage solutionKey={path.split("/").pop()} />;
  if (path === "/technology") return <TechnologyPage />;
  if (path === "/security") return <SecurityPage />;
  if (path === "/pricing") return <PricingPage />;
  if (path === "/company") return <CompanyPage />;
  if (path === "/resources") return <ResourcesPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/demo") return <DemoPage />;
  if (path === "/sign-in") return <SignInPage />;
  if (path === "/legal/privacy") return <LegalPage type="privacy" />;
  if (path === "/legal/terms") return <LegalPage type="terms" />;
  if (path === "/news/tiphub-allocation") return <TipHubAnnouncementPage />;
  return <RouteNotFound />;
}

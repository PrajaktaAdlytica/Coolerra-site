import { HomePage } from "./pages/HomePage.jsx";
import {
  CompanyPage,
  ContactPage,
  DemoPage,
  LegalPage,
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

export function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.title = getPageTitle(path);
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
  return <RouteNotFound />;
}

import HeroSection from '@/components/ui/glassmorphism-trust-hero';
import { NavBarDemo } from '@/app/demo';
import PricingSection from '@/components/ui/pricing-section-3';

export default function HeroDemo() {
  return (
    <div className="w-full bg-zinc-950">
      <NavBarDemo />
      <HeroSection />

      {/* ── Pricing — pricing.png background ── */}
      <section
        id="pricing"
        className="relative scroll-mt-20 overflow-hidden bg-zinc-950"
      >
        {/* pricing.png background — full cover, same masking style as hero */}
        <div
          className="absolute inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-50"
          style={{
            maskImage: 'linear-gradient(180deg, black 0%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 80%, transparent 100%)',
          }}
        />
        {/* Dark overlay so text stays legible */}
        <div className="absolute inset-0 z-0 bg-zinc-950/60" />

        <div className="relative z-10">
          <PricingSection />
        </div>
      </section>
    </div>
  );
}

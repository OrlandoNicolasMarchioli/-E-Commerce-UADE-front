import '../../ui.css';

/** Full-width homepage hero section with a headline, subtitle, CTA button, and an optional image slot. */
const HeroBanner = ({ title, subtitle, ctaLabel = 'Shop Now', onCta, imagePlaceholder }) => (
  <section className="ui-hero">
    <div className="ui-hero-content">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button className="ui-hero-cta" onClick={onCta}>{ctaLabel}</button>
    </div>
    <div className="ui-hero-image">
      {imagePlaceholder ?? '🖼 Product image'}
    </div>
  </section>
);

export default HeroBanner;

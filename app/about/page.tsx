import Link from "next/link";
import styles from "./about.module.css";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* HERO */}
        <section className={`${styles.hero} border-blueprint`}>
          <div className={styles.heroContent}>
            <div className={styles.avatarWrap}>
              {/* replace src with your portrait or logo */}
              <Image
                src="/AnaliseFaceShot.JPG"
                alt="Photographer portrait"
                width={140}
                height={140}
                className={styles.avatar}
                priority
              />
            </div>

            <div className={styles.heroText}>
              <h1 className={styles.title}>About Me</h1>
              <p className={styles.lead}>
                Photographer & visual storyteller working in film, digital, and
                motion. I create cinematic images with an old-paper, blueprint
                feel — blending classic composition with modern techniques.
              </p>

              <div className={styles.ctaRow}>
                <Link href="/portfolio" className={styles.ctaButton}>
                  View Portfolio
                </Link>
                <Link href="/contact" className={styles.ctaSecondary}>
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BIO */}
        <section className={`${styles.section} ${styles.bio} border-blueprint`}>
          <h2 className={styles.sectionTitle}>Bio</h2>
          <p className={styles.paragraph}>
            {/* Boilerplate — replace with your actual bio */}
            I began photographing landscapes and portraits as a way to slow
            down and study light. Over the years I’ve worked with clients on
            editorial shoots, weddings, and commercial campaigns. My practice is
            built around patience, natural light, and a strong attention to
            texture and tone.
          </p>

          <p className={styles.paragraph}>
            I shoot on both film and digital, and I enjoy the process of
            combining analogue and digital workflows to achieve a timeless
            aesthetic. When I’m not on a shoot you’ll find me exploring coastal
            roads, brewing coffee, or sketching composition ideas in a notebook.
          </p>
        </section>

        {/* SERVICES & SKILLS */}
        <section className={`${styles.section} ${styles.grid}`}>
          <div className={`${styles.card} border-blueprint`}>
            <h3 className={styles.cardTitle}>Services</h3>
            <ul className={styles.list}>
              <li>Editorial & Commercial Photography</li>
              <li>Portraits & Headshots</li>
              <li>Weddings & Events</li>
              <li>Video & Short-form Content</li>
            </ul>
          </div>

          <div className={`${styles.card} border-blueprint`}>
            <h3 className={styles.cardTitle}>Skills & Tools</h3>
            <ul className={styles.list}>
              <li>Film (35mm, medium format) & Digital</li>
              <li>Lighting: Natural, Strobes, Modifiers</li>
              <li>Post: Lightroom, Capture One, DaVinci Resolve</li>
              <li>Retouching & Color Grading</li>
            </ul>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className={`${styles.section} ${styles.testimonials} border-blueprint`}>
          <h2 className={styles.sectionTitle}>Testimonials</h2>
          <div className={styles.testList}>
            <blockquote className={styles.quote}>
              “A consummate professional — the images were timeless and felt
              carefully composed.” <span className={styles.credit}>— Client A</span>
            </blockquote>

            <blockquote className={styles.quote}>
              “Quick, calm on set, and creative — highly recommended.”{" "}
              <span className={styles.credit}>— Client B</span>
            </blockquote>
          </div>
        </section>

        {/* QUICK CONTACT CTA */}
        <section className={`${styles.section} ${styles.contactStrip} border-blueprint`}>
          <h3 className={styles.stripTitle}>Ready to work together?</h3>
          <p className={styles.stripText}>
            For bookings, rates, or general enquiries — I reply within 48 hours.
          </p>
          <Link href="/contact" className={styles.stripButton}>
            Contact Me
          </Link>
        </section>
      </main>
    </div>
  );
}


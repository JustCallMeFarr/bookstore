import { profile } from '../data/profile'
import useReveal from './useReveal'

// Dua baris bergantian:
//   baris 1 -> foto di KIRI, teks di KANAN
//   baris 2 -> teks di KIRI, foto di KANAN
// Setiap sisi meluncur masuk (slide) dari arahnya saat di-scroll.
export default function AboutSection() {
  const ref = useReveal()
  const { about1, about2 } = profile

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-row">
        <div className="about-photo reveal from-left">
          <img src={profile.photoLeft} alt={profile.name} />
        </div>
        <div className="about-text reveal from-right">
          <p className="eyebrow">{profile.role}</p>
          <h1>{about1.title}</h1>
          <p className="tagline">{profile.tagline}</p>
          {about1.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>

      <div className="about-row row-reverse">
        <div className="about-text reveal from-left">
          <h2>{about2.title}</h2>
          {about2.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          <div className="chips">
            {about2.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="about-photo reveal from-right">
          <img src={profile.photoRight} alt={profile.name} />
        </div>
      </div>
    </section>
  )
}

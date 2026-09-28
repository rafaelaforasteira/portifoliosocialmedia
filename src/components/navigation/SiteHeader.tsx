import Image from "next/image";
import styles from "./SiteHeader.module.css";

const navigation = [
  { label: "SOBRE", href: "#sobre" },
  { label: "CASES", href: "#cases" },
  { label: "PROCESSO", href: "#processo" },
  { label: "EXPERIÊNCIA", href: "#experiencia" },
] as const;

/** Future sections can select the matching glass treatment through `tone`. */
export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <header className={styles.header} data-tone={tone}>
      <nav className={styles.inner} aria-label="Navegação principal">
        <a className={styles.logo} href="#" aria-label="Início">
          <Image src="/icon.svg" alt="" width={32} height={32} className={styles.mark} />
        </a>
        <ul className={styles.links}>
          {navigation.map(({ label, href }) => (
            <li key={href}><a className={styles.link} href={href}>{label}</a></li>
          ))}
        </ul>
        <a className={styles.contact} href="#contato">FALAR COMIGO</a>
      </nav>
    </header>
  );
}

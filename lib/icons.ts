import {
  siApachemaven,
  siClaude,
  siDocker,
  siGit,
  siGithub,
  siGithubcopilot,
  siGitlab,
  siGooglecloud,
  siIntellijidea,
  siJenkins,
  siJira,
  siJunit5,
  siMysql,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPython,
  siRabbitmq,
  siRedis,
  siSonarqubeserver,
  siSpringboot,
} from "simple-icons";

export type Mark = {
  name: string;
  /** simple-icons path (24×24 viewBox). Absent → render a text wordmark tile. */
  path?: string;
  hex?: string;
  note?: string;
};

const m = (name: string, icon?: { path: string; hex: string }, note?: string): Mark => ({
  name,
  path: icon?.path,
  hex: icon ? `#${icon.hex}` : undefined,
  note,
});

// AWS, Azure and VS Code marks are not in simple-icons (removed after brand requests),
// so they render as text wordmarks. No third-party logo files are copied in.
export const marks: Record<string, Mark> = {
  Java: m("Java", siOpenjdk, "OpenJDK mark"),
  "Spring Boot": m("Spring Boot", siSpringboot),
  Python: m("Python", siPython),
  PostgreSQL: m("PostgreSQL", siPostgresql),
  MySQL: m("MySQL", siMysql),
  Redis: m("Redis", siRedis),
  RabbitMQ: m("RabbitMQ", siRabbitmq),
  Docker: m("Docker", siDocker),
  AWS: m("AWS"),
  Azure: m("Azure"),
  GCP: m("GCP", siGooglecloud, "Google Cloud"),
  Jenkins: m("Jenkins", siJenkins),
  Git: m("Git", siGit),
  GitHub: m("GitHub", siGithub),
  GitLab: m("GitLab", siGitlab),
  Maven: m("Maven", siApachemaven),
  JUnit: m("JUnit", siJunit5),
  SonarQube: m("SonarQube", siSonarqubeserver),
  Postman: m("Postman", siPostman),
  Jira: m("Jira", siJira),
  "IntelliJ IDEA": m("IntelliJ IDEA", siIntellijidea),
  "VS Code": m("VS Code"),
  "GitHub Copilot": m("GitHub Copilot", siGithubcopilot),
  Claude: m("Claude", siClaude),
};

/** Brand colours that are near-black disappear on the dark canvas; those fall back to ink. */
export function isDarkBrand(hex?: string) {
  if (!hex) return true;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.05;
}

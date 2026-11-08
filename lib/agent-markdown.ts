import { profile, projects, resumeHref, SITE_URL } from "./profile";

/** The whole page as Markdown for AI agents and copy-paste. Generated from profile.json. */
export function agentMarkdown(): string {
  const p = profile.person;
  const exp = profile.experience[0];
  const edu = profile.education[0];
  const lines: string[] = [
    "---",
    `title: ${p.name} — ${p.title}`,
    `url: ${SITE_URL}/`,
    `email: ${profile.links.email}`,
    `linkedin: ${profile.links.linkedin}`,
    `github: ${profile.links.github}`,
    "---",
    "",
    `# ${p.name}`,
    "",
    `${p.title} · ${p.yearsExperience} years · ${p.location} · ${profile.faq.relocation} Notice period: ${profile.faq.noticePeriod}`,
    "",
    p.summary,
    "",
    p.aiSummary,
    "",
    "## Experience",
    "",
    `### ${exp.role}, ${exp.company} (${exp.start.slice(0, 4)} – ${exp.endLabel})`,
    "",
    ...exp.highlights.map((h) => `- ${h}`),
    "",
    "## Work",
    "",
  ];
  for (const pr of projects) {
    lines.push(`### ${pr.title}`, "", `${pr.headline}`, "", `- Type: ${pr.type}`, `- Year: ${pr.year}`, `- Role: ${pr.role}`, `- Tags: ${pr.tags.join(", ")}`, "", pr.summary, "");
    lines.push(`- **Problem:** ${pr.caseStudy.problem}`, `- **Approach:** ${pr.caseStudy.approach}`, `- **Architecture:** ${pr.caseStudy.architecture}`, `- **Outcome:** ${pr.caseStudy.outcome}`, "");
  }
  lines.push("## Experiments", "");
  for (const e of profile.experiments) lines.push(`- **${e.title}:** ${e.body}`);
  lines.push("", "## Skills", "");
  for (const g of profile.skills) lines.push(`- **${g.group}:** ${g.items.join(", ")}`);
  lines.push(
    "",
    "## Education",
    "",
    `${edu.degree}, ${edu.school}, ${edu.city} (${edu.end}). CGPA ${edu.cgpa}.`,
    "",
    "## Languages",
    "",
    p.languages.items.join(", "),
    "",
    "## Contact",
    "",
    `- Email: ${profile.links.email}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- GitHub: ${profile.links.github}`,
    ...(resumeHref ? [`- CV: https://itshashi7.github.io${resumeHref}`] : []),
    "",
  );
  return lines.join("\n");
}

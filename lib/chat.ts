import { profile, projects, resumeHref } from "./profile";

export type Answer = { text: string; links?: { label: string; href: string }[]; matched: boolean };

const exp = profile.experience[0];
const edu = profile.education[0];
const group = (name: string) => profile.skills.find((g) => g.group === name)?.items.join(", ") ?? "";
const email = { label: "Email Hashim", href: `mailto:${profile.links.email}?subject=${encodeURIComponent("Question from your portfolio")}` };

type Intent = { id: string; keys: string[]; answer: () => Omit<Answer, "matched"> };

// Client-side intent matching over profile.json. No network, no model.
const INTENTS: Intent[] = [
  {
    id: "relocation",
    keys: ["relocat", "move to", "dubai", "uae", "emirates", "saudi", "ksa", "riyadh", "jeddah", "abu dhabi", "onsite", "on-site", "remote", "visa", "based", "location"],
    answer: () => ({ text: `${profile.faq.relocation} I'm based in ${profile.person.location} today.` }),
  },
  {
    id: "notice",
    keys: ["notice", "join", "start date", "when can", "available", "availability", "how soon"],
    answer: () => ({ text: `My notice period is ${profile.faq.noticePeriod.replace(/\.$/, "")}.`, links: [email] }),
  },
  {
    id: "izo",
    keys: ["izo", "tata", "multi cloud", "multi-cloud", "multicloud", "current role", "current job", "employer", "day job", "what do you do", "work on"],
    answer: () => ({
      text: `I'm an ${exp.role} at ${exp.company} (since July 2024). I build cloud-native backend services for ${exp.product}, ${exp.productDescription.charAt(0).toLowerCase()}${exp.productDescription.slice(1)} That means REST APIs and service-to-service integrations in Java and Spring Boot, RabbitMQ-based event-driven processing, PostgreSQL/MySQL data models and Redis caching, shipped through Jenkins CI/CD.`,
      links: [{ label: "Read the case study", href: "#case-izo-multi-cloud-connect" }],
    }),
  },
  {
    id: "stack",
    keys: ["stack", "tech", "technolog", "skill", "programming", "java", "spring", "framework", "database", "tools", "what do you use"],
    answer: () => ({
      text: `Backend: ${group("Programming Languages")}; ${group("Backend & APIs")}. Messaging: RabbitMQ. Data: ${group("Databases")}. Cloud: ${group("Cloud & Containers")}. Quality and delivery: JUnit, Mockito, SonarQube, Jenkins, Git, GitLab, Maven.`,
      links: [{ label: "See the full stack", href: "#stack" }],
    }),
  },
  {
    id: "experience",
    keys: ["experience", "years", "senior", "how long", "background"],
    answer: () => ({ text: `${profile.person.yearsExperience} years building backend services, all at ${exp.company} (July 2024 – present). ${profile.person.summary.split(". ").slice(1, 2).join("")}.` }),
  },
  {
    id: "ai",
    keys: ["ai", "llm", "copilot", "claude", "agent", "prompt", "gpt"],
    answer: () => ({ text: profile.person.aiSummary }),
  },
  {
    id: "projects",
    keys: ["project", "wikipedia", "summar", "rag", "mcp", "portfolio", "side"],
    answer: () => ({
      text: `Besides IZO: ${projects
        .filter((p) => p.id !== "izo-multi-cloud-connect")
        .map((p) => `${p.title} (${p.summary.split(" – ")[0].split(", ")[0]})`)
        .join("; ")}.`,
      links: [{ label: "Browse the work", href: "#work" }],
    }),
  },
  {
    id: "testing",
    keys: ["test", "junit", "mockito", "quality", "sonar", "ci/cd", "cicd", "jenkins", "deploy", "pipeline", "debug"],
    answer: () => ({ text: `I own features end to end: implementation, automated unit and integration tests with JUnit and Mockito, SonarQube quality gates, and deployment through Jenkins CI/CD. I debug Dockerized services from container logs and config down to the root cause.` }),
  },
  {
    id: "education",
    keys: ["education", "degree", "college", "university", "study", "studied", "cgpa", "gpa", "graduat"],
    answer: () => ({ text: `${edu.degree}, ${edu.school}, ${edu.city} (${edu.end}). CGPA ${edu.cgpa}.` }),
  },
  {
    id: "languages",
    keys: ["speak", "spoken", "tamil", "hindi", "english", "arabic"],
    answer: () => ({ text: `I speak ${profile.person.languages.items.join(", ")}.` }),
  },
  {
    id: "contact",
    keys: ["contact", "email", "reach", "hire", "linkedin", "github", "cv", "resume", "call"],
    answer: () => ({
      text: `Email is quickest: ${profile.links.email}. You can also find me on LinkedIn and GitHub${resumeHref ? ", or download my CV" : ""}.`,
      links: [email, { label: "LinkedIn", href: profile.links.linkedin }, ...(resumeHref ? [{ label: "Download CV", href: resumeHref }] : [])],
    }),
  },
  {
    id: "greeting",
    keys: ["hello", "hey", "hi ", "hi!", "salam", "good morning"],
    answer: () => ({ text: "Hi. Ask me about my stack, my work at Tata Communications, relocation or notice period." }),
  },
];

export const STARTERS = ["What's your stack?", "Tell me about IZO", "Are you open to relocation?", "Notice period?"];

export function ask(question: string): Answer {
  const q = ` ${question.toLowerCase().replace(/[’']/g, "'")} `;
  let best: Intent | null = null;
  let score = 0;
  for (const intent of INTENTS) {
    const s = intent.keys.reduce((n, k) => {
      const key = k.length <= 3 ? ` ${k.trim()} ` : k; // short keys must be whole words
      return n + (q.includes(key) || (k.length <= 3 && new RegExp(`\\b${k.trim()}\\b`).test(q)) ? 1 : 0);
    }, 0);
    if (s > score) {
      score = s;
      best = intent;
    }
  }
  if (!best) {
    return { text: "I don't have that in my notes. Email me and I'll answer directly.", links: [email], matched: false };
  }
  return { ...best.answer(), matched: true };
}

import { marks } from "@/lib/icons";

export const symbolId = (name: string) => `si-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Each simple-icons path is defined once here; glyphs reference it with <use>. Keeps the HTML small. */
export function IconSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {Object.values(marks)
          .filter((m) => m.path)
          .map((m) => (
            <symbol key={m.name} id={symbolId(m.name)} viewBox="0 0 24 24">
              <path d={m.path} />
            </symbol>
          ))}
      </defs>
    </svg>
  );
}

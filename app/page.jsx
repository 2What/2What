import fs from "fs";
import path from "path";
import Link from "next/link";

const CONTENT_DIR = path.join(process.cwd(), "content");

export default function Home() {
  const files = fs.readdirSync(CONTENT_DIR);
  const slugs = files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>2What Writeups</h1>
      <ul>
        {slugs.map((slug) => (
          <li key={slug}>
            <Link href={`/docs/${slug}`}>
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
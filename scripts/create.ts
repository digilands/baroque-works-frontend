#!/usr/bin/env node

// just run npm run make and select what you want to create
import fs from "fs";
import path from "path";
import { select, input, confirm } from "@inquirer/prompts";

const projectRoot = process.cwd();

function createFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n", "utf-8");
  console.log(`✅ Created: ${path.relative(projectRoot, filePath)}`);
}

const templates = {
  ui: (name: string) => `
import React from "react";

export default function ${name}() {
  return <div>${name} component</div>;
}
`,
  utils: (name: string) => `
export function ${name}() {
  // TODO: implement ${name}
}
`,
  page: (name: string) => `
export default function ${name[0].toUpperCase() + name.slice(1)}Page() {
  return <div>${name} page</div>;
}
`,
};

async function main() {
  console.log("🛠️  Next.js File Creator\n");

  const type = await select({
    message: "What would you like to create?",
    choices: [
      { name: "UI Component", value: "ui" },
      { name: "Utility Function", value: "utils" },
      { name: "Page", value: "page" },
    ],
  });

  const nameInput = await input({
    message: "Enter one or more names (comma-separated):",
  });

  const names = nameInput
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  if (!names.length) {
    console.log("❌ No valid names provided.");
    process.exit(1);
  }

  const confirmCreate = await confirm({
    message: `Generate ${names.length} ${type} file(s)?`,
    default: true,
  });

  if (!confirmCreate) {
    console.log("❌ Operation cancelled.");
    process.exit(0);
  }

  for (const name of names) {
    const Name = name.charAt(0).toUpperCase() + name.slice(1);

    if (type === "ui") {
      const filePath = path.join(projectRoot, "src/app/ui", `${Name}.tsx`);
      createFile(filePath, templates.ui(Name));
    } else if (type === "utils") {
      const filePath = path.join(projectRoot, "src/utils", `${name}.ts`);
      createFile(filePath, templates.utils(name));
    } else if (type === "page") {
      const dir = path.join(projectRoot, "src/app", name);
      const filePath = path.join(dir, "page.tsx");
      createFile(filePath, templates.page(name));
    }
  }

  console.log("\n🎉 All files created successfully!");
}

main();

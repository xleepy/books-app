/**
 * Post-codegen fixes.
 * With flattenArg: true, body-only endpoints generate flat args natively.
 * This script only handles remaining renames that cannot be expressed via codegen config.
 */

const fs = require("fs");
const path = require("path");

const apiDir = path.join(__dirname, "../src/shared/api");

function patch(file, patches) {
  const filePath = path.join(apiDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  [skip] ${file} not found`);
    return;
  }
  let c = fs.readFileSync(filePath, "utf8");
  for (const [search, replace] of patches) {
    if (c.includes(search)) {
      c = c.split(search).join(replace);
    }
  }
  fs.writeFileSync(filePath, c);
  console.log(`  patched ${file}`);
}

console.log("Post-codegen fixes...");

// No patches currently needed — operationId-based filtering handles all endpoints.
// Keep this script for future renames or fixes that codegen config cannot express.

console.log("Done.");

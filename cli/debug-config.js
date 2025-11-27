import Conf from "conf";

const config = new Conf({ projectName: "resync-cli" });

console.log("Current CLI Configuration:");
console.log("========================");
console.log("API URL:", config.get("apiUrl") || "Not set (using default)");
console.log("Has Token:", !!config.get("token"));
console.log("Has User:", !!config.get("user"));
console.log("");
console.log("Environment:");
console.log("API_URL env var:", process.env.API_URL || "Not set");
console.log("");
console.log("Effective API URL:");
console.log(
  process.env.API_URL || config.get("apiUrl") || "http://localhost:8000/api"
);
console.log("");
console.log("Config file location:");
console.log(config.path);

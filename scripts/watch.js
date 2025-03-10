import chokidar from "chokidar";
import { exec } from "child_process";

// Initialize watcher.
const watcher = chokidar.watch("./src", {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

// Define the function to run the script.
const runScript = () => {
  exec("node ./scripts/index.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
};

// Add event listeners.
watcher.on("add", runScript).on("change", runScript).on("unlink", runScript);

console.log("Watching for changes in the src directory...");

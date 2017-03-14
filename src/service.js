import path from "path";
import { Service } from "node-windows";

const svc = new Service({
  name: "MemeBot",
  description: "Source for all memes.",
  script: path.join(__dirname, "app.js")
});

switch (process.argv[2]) {
    case "--install": 
        svc.on("install", () => svc.start());
        svc.install();
        break;

    case "--uninstall":
        svc.on("uninstall",() => {
            console.log("Uninstall complete.");
            console.log("The service exists: ", svc.exists);
        });
        svc.uninstall();
        break;
}
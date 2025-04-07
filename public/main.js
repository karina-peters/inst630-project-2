import { getData } from "./helpers/getData.js";

const main = () => {
  getData("/api/routes");
  getData("/api/trains");
};

document.addEventListener("DOMContentLoaded", async () => main());

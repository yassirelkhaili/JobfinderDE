import puppeteer from "puppeteer";
import { jobSuchKonfiguration } from "./config/config";
import dotenv from 'dotenv';
import type { Job, JobSuchKonfiguration } from "./types/types";

dotenv.config();

/**
 * Extrahiert Jobdaten von einer angegebenen URL.
 * @param config - Das Konfigurationsobjekt, das Suchkriterien und die URL enthält.
 * @returns Promise<void> - Führt die Scrape-Aktion aus und gibt nichts zurück.
 */
async function scrapeJobs(config: JobSuchKonfiguration): Promise<void> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Öffnet die URL und wartet, bis die Seite vollständig geladen ist
  await page.goto(config.url, { waitUntil: 'networkidle2' });

  // Führt die Evaluierungsfunktion auf der Seite aus
  const jobs = await page.evaluate(() => {
    const cookieButton = document.querySelector('.ba-btn-contrast') as HTMLButtonElement;
    const anchorTag = document.getElementById('meine-vormerkungen-link') as HTMLAnchorElement;
    console.log(cookieButton);
  });

  await browser.close();
}

/**
 * Zeigt Jobdaten in einem Konsolentabellenformat an.
 * @param jobs - Die anzuzeigenden Jobdaten.
 */
const displayJobs = (jobs: Job[]) => console.table(jobs);

(async () => {
  // Führt die Job-Scrape-Funktion aus und zeigt die Ergebnisse an
  const anchorTagText = await scrapeJobs(jobSuchKonfiguration);
})();

import puppeteer from "puppeteer";
import { jobSuchKonfiguration } from "./config/config";
import dotenv from "dotenv";
import helperService from "./services/helperService";
import type { Job, JobSuchKonfiguration } from "./types/types";
import type { Page } from "puppeteer";

dotenv.config();

/**
 * Extrahiert Jobdaten von einer angegebenen URL.
 * @param config - Das Konfigurationsobjekt, das Suchkriterien und die URL enthält.
 * @returns Promise<Job[]> - Führt die Scrape-Aktion aus und gibt nichts zurück.
 */
async function scrapeJobs(config: JobSuchKonfiguration): Promise<void> {
  let browser; // intiate browser instance
  let userResponse;
  const chalk = (await import('chalk')).default;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Öffnet die URL und wartet, bis die Seite vollständig geladen ist
    await page.goto(config.url, { waitUntil: "networkidle2" });

    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);
    await page.reload();

    // Parse the values for arbeitsBezeichnungen and ort
    const arbeitsBezeichnungen = helperService.parseArbeitsBezeichnungen(
      config["arbeitsBezeichnungen"]
    );
    const ort = config["ort"];

    // Führt die Evaluierungsfunktion auf der Seite aus
    /**
     * Sucht nach dem `bahf-cookie-disclaimer-dpl3`-Element, greift auf sein `shadowRoot` zu,
     * und klickt auf den Button `.ba-btn-contrast`, um die Cookie-Bestätigung abzuschließen, falls vorhanden.
     */
    await page.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const rootElement = document.querySelector("bahf-cookie-disclaimer-dpl3");
      if (rootElement && rootElement.shadowRoot) {
        const cookieButton = rootElement.shadowRoot.querySelector(
          ".ba-btn-contrast"
        ) as HTMLButtonElement | null;
        if (cookieButton) {
          cookieButton.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    });

    /**
     * Füllt das erste Eingabefeld mit der Arbeitsbezeichnung und das zweite mit dem Ort aus,
     * und klickt anschließend auf den Submit-Button.
     */
    await page.type("#was-input", arbeitsBezeichnungen);
    await page.type("#wo-input", ort);
    await page.click("#btn-stellen-finden");

    await page.waitForSelector("#ergebnis-container", { timeout: 10000 });

    await page.click("#filter-toggle");

    await new Promise((resolve: (value?: unknown) => void) =>
      setTimeout(resolve, 1000)
    );

    const jobSuchKonfigurationsArray = Object.entries(jobSuchKonfiguration) as [
      keyof JobSuchKonfiguration,
      JobSuchKonfiguration[keyof JobSuchKonfiguration]
    ][];

    for (const [key] of jobSuchKonfigurationsArray.slice(3)) {
      try {
        const dropDownButtonSelector: string = `button[id="${key}-accordion-heading-link"]`;
        const isCollapsed: boolean = await page.$eval(
          dropDownButtonSelector,
          (dropDownButton) => dropDownButton.classList.contains("collapsed")
        );
        if (isCollapsed) await page.click(dropDownButtonSelector);
      } catch (error: any) {
        console.warn(`Error has occurred: ${error.message}`);
      }
    }

    await new Promise((resolve: (value?: unknown) => void) =>
      setTimeout(resolve, 1000)
    );

    for (const [key, value] of jobSuchKonfigurationsArray.slice(3)) {
      const bezeichnungen = helperService.parseInputIdSelector(value);
      if (bezeichnungen && Array.isArray(bezeichnungen)) {
        for (const bezeichnung of bezeichnungen) {
          try {
            await page.click(`input[id="${key}-${bezeichnung}"]`);
          } catch (error: any) {
            console.warn(`Error has occured: ${error.message}`);
          }
        }
      } else {
        console.warn("Value parsing failed or value missing in config.");
      }
    }

    await page.click("#footer-button-modales-slide-in-filter");

    await new Promise((resolve: (value?: unknown) => void) =>
      setTimeout(resolve, 100)
    );

    async function clickButtonUntilGone(page: Page, iterations = 2) {
      const button = await page.$("#ergebnisliste-ladeweitere-button");
      if (button === null) return;
      await new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, 500));
      await button.click();
      await page.waitForSelector(`#divider-${iterations}`, { timeout: 5000 });
      await clickButtonUntilGone(page, ++iterations);
    }

    await clickButtonUntilGone(page);

    const offerNavigationElements = await page.$$('.ergebnisliste-item');

    const scrapeJobs = async (): Promise<string[]> => {
      let jobOffers: string[] = [];
      if (offerNavigationElements) {
        for (const jobOfferNavigationLink of offerNavigationElements) {
          try {
            await jobOfferNavigationLink.click();
            await new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, 500));
            const offerDescriptionContainer = await page.waitForSelector(`#detail-beschreibung-beschreibung`, { timeout: 1000 });
            const descriptionText = offerDescriptionContainer && await offerDescriptionContainer.evaluate(el => (el as HTMLElement).innerText);
            descriptionText && jobOffers.push(descriptionText);
            const exitButton = await page.$('#close-modales-slide-in-detailansicht');
            if (exitButton) {
              exitButton.click();
              await new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, 500));
            }
          } catch (error: any) {
            const exitButton = await page.$('#close-modales-slide-in-detailansicht');
            if (exitButton) {
              exitButton.click();
              await new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, 500));
            } else {
              console.warn(`Error has occured: ${error.message}`);
            }
          }
        }
      } else {
        console.warn('Error has occured: no job offers detected');
      }
      return jobOffers;
    }

    const scrappingResults = await scrapeJobs();
    userResponse = await helperService.logScrappingResults(scrappingResults);
  } catch (error: any) {
    console.warn(`Error has occured: ${error.message}`);
  } finally {
    console.log(chalk.green('Job scrapping finished'));
    if (userResponse && userResponse.startsWith('Error')) {
      console.log(chalk.red(userResponse));
    } else {
      console.log(chalk.green(userResponse));
    }
    if (browser) await browser.close();
  }
}

(async () => {
  // Führt die Job-Scrape-Funktion aus und zeigt die Ergebnisse an
  await scrapeJobs(jobSuchKonfiguration);
})();
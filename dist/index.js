"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_1 = require("./config/config");
const dotenv_1 = __importDefault(require("dotenv"));
const helperService_1 = __importDefault(require("./services/helperService"));
dotenv_1.default.config();
/**
 * Extrahiert Jobdaten von einer angegebenen URL.
 * @param config - Das Konfigurationsobjekt, das Suchkriterien und die URL enthält.
 * @returns Promise<Job[]> - Führt die Scrape-Aktion aus und gibt nichts zurück.
 */
async function scrapeJobs(config) {
    const browser = await puppeteer_1.default.launch({ headless: false });
    const page = await browser.newPage();
    // Öffnet die URL und wartet, bis die Seite vollständig geladen ist
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    // Parse the values for arbeitsBezeichnungen and ort
    const arbeitsBezeichnungen = helperService_1.default.parseArbeitsBezeichnungen(config['arbeitsBezeichnungen']);
    const ort = config['ort'];
    // Führt die Evaluierungsfunktion auf der Seite aus
    /**
    * Sucht nach dem `bahf-cookie-disclaimer-dpl3`-Element, greift auf sein `shadowRoot` zu,
    * und klickt auf den Button `.ba-btn-contrast`, um die Cookie-Bestätigung abzuschließen, falls vorhanden.
    */
    await page.evaluate(async (arbeitsBezeichnungen, ort) => {
        const rootElement = document.querySelector('bahf-cookie-disclaimer-dpl3');
        if (rootElement && rootElement.shadowRoot) {
            const cookieButton = rootElement.shadowRoot.querySelector('.ba-btn-contrast');
            if (cookieButton) {
                cookieButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        /**
       * Füllt das erste Eingabefeld mit der Arbeitsbezeichnung und das zweite mit dem Ort aus,
       * und klickt anschließend auf den Submit-Button.
       */
        await page.type('#was-input', arbeitsBezeichnungen, { delay: 100 });
        await page.type('#wo-input', ort, { delay: 100 });
    }, arbeitsBezeichnungen, ort);
    // await browser.close();
}
/**
 * Zeigt Jobdaten in einem Konsolentabellenformat an.
 * @param jobs - Die anzuzeigenden Jobdaten.
 */
const displayJobs = (jobs) => console.table(jobs);
(async () => {
    // Führt die Job-Scrape-Funktion aus und zeigt die Ergebnisse an
    const anchorTagText = await scrapeJobs(config_1.jobSuchKonfiguration);
})();

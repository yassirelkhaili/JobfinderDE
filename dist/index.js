"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function scrapeJobs(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: false });
        const page = yield browser.newPage();
        // Öffnet die URL und wartet, bis die Seite vollständig geladen ist
        yield page.goto(config.url, { waitUntil: 'networkidle2' });
        // Parse the values for arbeitsBezeichnungen and ort
        const arbeitsBezeichnungen = helperService_1.default.parseArbeitsBezeichnungen(config['arbeitsBezeichnungen']);
        const ort = config['ort'];
        // Führt die Evaluierungsfunktion auf der Seite aus
        const jobs = yield page.evaluate((arbeitsBezeichnungen, ort) => {
            /**
             * Sucht nach dem `bahf-cookie-disclaimer-dpl3`-Element, greift auf sein `shadowRoot` zu,
             * und klickt auf den Button `.ba-btn-contrast`, um die Cookie-Bestätigung abzuschließen, falls vorhanden.
             */
            const rootElement = document.querySelector('bahf-cookie-disclaimer-dpl3');
            let cookieButton = null;
            if (rootElement && rootElement.shadowRoot) {
                cookieButton = rootElement.shadowRoot.querySelector('.ba-btn-contrast');
                cookieButton && cookieButton.click();
            }
            /**
             * Füllt das erste Eingabefeld mit der Arbeitsbezeichnung und das zweite mit dem Ort aus,
             * und klickt anschließend auf den Submit-Button.
             */
            const searchformInputs = document.querySelectorAll('.form_control');
            const searchformButton = document.getElementById('btn-stellen-finden');
            searchformInputs.forEach((formInput) => {
                if (formInput.id === "was-input")
                    formInput.value = arbeitsBezeichnungen;
                if (formInput.id === "wo-input")
                    formInput.value = ort;
                formInput.dispatchEvent(new Event('input'));
            });
            searchformButton && searchformButton.click();
        }, arbeitsBezeichnungen, ort);
        // await browser.close();
    });
}
/**
 * Zeigt Jobdaten in einem Konsolentabellenformat an.
 * @param jobs - Die anzuzeigenden Jobdaten.
 */
const displayJobs = (jobs) => console.table(jobs);
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Führt die Job-Scrape-Funktion aus und zeigt die Ergebnisse an
    const anchorTagText = yield scrapeJobs(config_1.jobSuchKonfiguration);
}))();

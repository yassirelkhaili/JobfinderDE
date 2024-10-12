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
dotenv_1.default.config();
/**
 * Extrahiert Jobdaten von einer angegebenen URL.
 * @param config - Das Konfigurationsobjekt, das Suchkriterien und die URL enthält.
 * @returns Promise<void> - Führt die Scrape-Aktion aus und gibt nichts zurück.
 */
function scrapeJobs(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: false });
        const page = yield browser.newPage();
        // Öffnet die URL und wartet, bis die Seite vollständig geladen ist
        yield page.goto(config.url, { waitUntil: 'networkidle2' });
        // Führt die Evaluierungsfunktion auf der Seite aus
        const jobs = yield page.evaluate(() => {
            const anchorTag = document.getElementById('meine-vormerkungen-link');
            const cookieButton = document.querySelector('bahf-cookie-disclaimer-dpl3.hydrated');
            return cookieButton === null || cookieButton === void 0 ? void 0 : cookieButton.tagName;
        });
        console.log(jobs);
        yield browser.close();
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

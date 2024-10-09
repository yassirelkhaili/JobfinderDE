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
 * Scrapes job data from a specified URL.
 * @param config - The configuration object containing search criteria and URL.
 * @returns Promise<string | null> - The text content of the anchor tag or null if not found.
 */
function scrapeJobs(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.goto(config.url, { waitUntil: 'networkidle2' });
        const jobs = yield page.evaluate(() => {
            const cookieButton = document.querySelector('ba-btn-contrast');
            const anchorTag = document.getElementById('meine-vormerkungen-link');
            console.log(cookieButton);
        });
        yield browser.close();
    });
}
/**
 * Displays job data in a console table format.
 * @param jobs - The job data to display.
 */
const displayJobs = (jobs) => console.table(jobs);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const anchorTagText = yield scrapeJobs(config_1.jobSuchKonfiguration);
}))();

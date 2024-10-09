import puppeteer from "puppeteer";
import { jobSuchKonfiguration } from "./config/config";
import dotenv from 'dotenv';
import type { Job, JobSuchKonfiguration} from "./types/types";

dotenv.config();

async function scrapeJobs(arbeitsBezeichnungen: JobSuchKonfiguration): Promise<Job[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    await page.goto(arbeitsBezeichnungen.url, { waitUntil: 'networkidle2' });

    const jobs = await page.evaluate(() => {
        
    });
  
    await browser.close();
    return jobs;
  }

  const displayJobs = (jobs: Job[]) => console.table(jobs);

  (async () => {
    const jobs = await scrapeJobs(jobSuchKonfiguration);
    displayJobs(jobs);
  })();
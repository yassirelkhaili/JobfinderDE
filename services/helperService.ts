import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { JobSuchKonfiguration } from "../types/types";

class HelperService {
    /**
    * Konvertiert den Eingabewert `bezeichnungen` in einen einzelnen String.
    * 
    * @param bezeichnungen - Entweder ein String oder ein Array von Strings.
    * 
    * - Wenn `bezeichnungen` ein String ist, wird dieser direkt zurückgegeben.
    * - Wenn `bezeichnungen` ein Array von Strings ist, werden die Elemente zu einem String mit Leerzeichen als Trennzeichen zusammengefügt und zurückgegeben.
    * 
    * @returns Der zusammengefügte String oder, falls kein gültiger Wert vorliegt, ein leerer String.
    */
    public parseArbeitsBezeichnungen(bezeichnungen: string | string[]): string {
        if (typeof bezeichnungen === 'string') {
            return bezeichnungen;
        } else if (Array.isArray(bezeichnungen)) {
            return bezeichnungen.join(' ');
        }
        return '';
    }

    /**
     * Formatiert `Veröffentlichkeit`-Strings für HTML-IDs.
     *
     * Diese Methode konvertiert ein Array von `Veröffentlichkeit`-Werten (z.B. 'Gestern', '1 Woche') 
     * in kleingeschriebene, mit Bindestrichen getrennte Strings. Diese Ausgabe ist nützlich, um HTML-Elemente 
     * mit IDs wie `veroeffentlichkeit-1-woche` im Browser zu finden.
     *
     * @param {Veröffentlichkeit[]} bezeichnungen - Ein Array von Veröffentlichungszeitpunkt-Strings.
     * @returns {string[] | null} - Ein Array von formatierten Strings oder `null`, wenn das Array leer ist.
     *
     * Beispiel:
     * ```typescript
     * const parsedIds = parseInputIdSelector(['Heute', '1 Woche']);
     * // Ausgabe: ['heute', '1-woche']
     * ```
     */
    public parseInputIdSelector(bezeichnungen: JobSuchKonfiguration[keyof JobSuchKonfiguration]): string[] {
        let parsedBezeichnungen: string[] = [];
        const placeholder = '__HYPHEN_PLACEHOLDER__';
        const parseBezeichnung = (bezeichnung: string): string => {
            let modifiedBezeichnung = bezeichnung.replace(/ - /g, placeholder);
            modifiedBezeichnung = modifiedBezeichnung.replace(/[\s/]/g, '-');
            modifiedBezeichnung = modifiedBezeichnung.replace(new RegExp(placeholder, 'g'), '-');
            modifiedBezeichnung = modifiedBezeichnung.toLowerCase();
            return modifiedBezeichnung;
        };
        if (Array.isArray(bezeichnungen)) parsedBezeichnungen = bezeichnungen.map(parseBezeichnung); else bezeichnungen && parsedBezeichnungen.push(parseBezeichnung(bezeichnungen));
        return parsedBezeichnungen;
    }

    public async logScrappingResults(scrappingResults: string[]): Promise<string> {
        let response: string = '';
        try {
          const now = new Date();
          const folderPath = './dump';
          await mkdir(folderPath, { recursive: true });
          const fileName = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.log`;
          const filePath = join(folderPath, fileName);
          const timestamp = now.toISOString();
          const logEntries = scrappingResults.map((result, index) => `${timestamp} - Job Offer ${index + 1}: ${result}\n`).join('');
          await writeFile(filePath, logEntries);
          response = `Scraping results written to ${filePath}`;
          return response;
        } catch (error) {
          throw new Error(`Error writing to log file: ${error}`);
        }
      }
      
}

const helperService = new HelperService();

export default helperService;
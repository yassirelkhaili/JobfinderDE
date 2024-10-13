import { mkdir, writeFile } from 'fs/promises';
import OpenAI from 'openai';
import { join } from 'path';
import type { JobSuchKonfiguration, Jobanzeige } from "../types/types";

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

    public async logScrappingResults(logEntries: string): Promise<string> {
        let response: string = '';
        try {
          const now = new Date();
          const folderPath = './logs';
          await mkdir(folderPath, { recursive: true });
          const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
          const fileName = `${timestamp}.log`;
          const filePath = join(folderPath, fileName);
          await writeFile(filePath, logEntries);
          response = `Scraping results written to ${filePath}`;
        } catch (error) {
          response = `Error writing to log file: ${error}`;
        }
        return response;
      }

      public prepareAIPrompt = (prompt: string, userProfile: string, jobAds: string): string => prompt.replace('__USERPROFILE_PLACEHOLDER__', userProfile).replace('__JOBADS_PLACEHOLDER__', jobAds);

      /**
      * @param {string} orgID organisationID
      * @param {string} projId projectID
      */
      public async getOpenAIResponse(prompt: string, orgID: string, projId: string): Promise<string> {
        try {
          const openai = new OpenAI({
            organization: orgID,
            project: projId,
        });
      
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          });
      
          if (response.choices && response.choices.length > 0) {
            return response.choices[0].message.content || "";
          } else {
            throw new Error("No response from OpenAI API");
          }
        } catch (error) {
          console.error("Error calling OpenAI API:", error);
          throw error;
        }
      }

      // customizing previous log results method to adds complexity so decided to change it and repaste it here
      public async logOpenAIResults(aiResponse: string): Promise<string> {
        let response: string = '';
        try {
          const now = new Date();
          const folderPath = './dump';
          await mkdir(folderPath, { recursive: true });
          const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
          const fileName = `${timestamp}.txt`;
          const filePath = join(folderPath, fileName);
          await writeFile(filePath, aiResponse);
          response = `Final Result written to ${filePath}`;
        } catch (error) {
          response = `Error writing to txt file: ${error}`;
        }
        return response;
      }
}

const helperService = new HelperService();

export default helperService;
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
    public parseInputIdSelector(bezeichnungen: JobSuchKonfiguration[keyof JobSuchKonfiguration]): string[] | null {
        let parsedBezeichnungen: string[] | null = [];
        const placeholder = '__HYPHEN_PLACEHOLDER__';
        if (Array.isArray(bezeichnungen)) {
            bezeichnungen.forEach((bezeichnung) => {
            let modifiedBezeichnung = bezeichnung.replace(/ - /g, placeholder);
            modifiedBezeichnung = modifiedBezeichnung.toLowerCase().replace(/[\s/]/g, '-');
            modifiedBezeichnung = modifiedBezeichnung.replace(new RegExp(placeholder, 'g'), ' - ');
            parsedBezeichnungen.push(modifiedBezeichnung);
            });
        } else {
            let modifiedBezeichnung = bezeichnungen.replace(/ - /g, placeholder);
            modifiedBezeichnung = modifiedBezeichnung.toLowerCase().replace(/[\s/]/g, '-');
            modifiedBezeichnung = modifiedBezeichnung.replace(new RegExp(placeholder, 'g'), ' - ');
            parsedBezeichnungen.push(modifiedBezeichnung);
        }
        return parsedBezeichnungen;
    }
}

const helperService = new HelperService();

export default helperService;
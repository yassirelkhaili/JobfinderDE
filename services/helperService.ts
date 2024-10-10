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
}

const helperService = new HelperService();

export default helperService;
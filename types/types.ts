export type Job = {
    title: string;
    location: string;
    company: string;
    salary: string;
  };

export interface JobSuchKonfiguration {
    url: string;
    arbeitsBezeichnungen: string[];
    ort: string;
    arbeitsZeit: ('Vollzeit' | 'Teilzeit' | 'Homeoffice' | 'Alle')[];
    befristung: ('Befristet' | 'Unbefristet' | 'Alle')[];
    veröffentlichkeit: ('Heute' | 'Gestern' | '1 Woche' | '2 Wochen' | '4 Wochen' | 'Alle')[];
    berufsfeld: string[];
    beruf: string[];
    branche: string[];
}
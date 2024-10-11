export type Job = {
    title: string;
    location: string;
    company: string;
    salary: string;
  };

export type Veröffentlichkeit = 'Heute' | 'Gestern' | '1 Woche' | '2 Wochen' | '4 Wochen' | 'Alle anzeigen';

export type ArbeitsZeit = 'Vollzeit' | 'Teilzeit' | 'Homeoffice' | 'Alle anzeigen';

export type Befristung = 'Befristet' | 'Unbefristet' | 'Alle anzeigen';

export interface JobSuchKonfiguration {
    url: string;
    arbeitsBezeichnungen: string[];
    ort: string;
    arbeitszeit?: ArbeitsZeit[];
    befristung?: Befristung[];
    veroeffentlichtseit?: Veröffentlichkeit[];
    berufsfeld?: string[];
    beruf?: string[];
    branche?: string[];
}
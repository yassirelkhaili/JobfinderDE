import type { JobSuchKonfiguration } from "../types/types";

/**
* Konfigurationsobjekt für die Jobsuche auf der Bundesagentur für Arbeit Webseite.
*/
export const jobSuchKonfiguration: JobSuchKonfiguration = {
	/**
	* Die URL der Bundesagentur für Arbeit Jobbörse.
	*/
	url: 'https://www.arbeitsagentur.de/jobsuche',
	/**
	 * arbeitsBezeichnungen: Liste von Berufsbezeichnungen, nach denen gesucht werden soll.
	 * Beispiele: Beruf, Stichwort, Referenznummer
	 */
	arbeitsBezeichnungen: [
	'Fachinformatiker/in Anwendungsentwicklung', 
	'Webentwickler', 
	'Webentwickler Backend', 
	'Full-Stack Web-Entwickler/in'
	],
	/**
	 * ort: Ort oder Region, in der nach Arbeitsplätzen gesucht werden soll.
	 * Beispiele: Stadt, PLZ, Bundesland, Land
	 */
	ort: 'Deutschland (Land)',
	/**
	 * arbeitsZeit: Arbeitszeitoptionen für die Suche.
	 * Mögliche Werte: 'Vollzeit', 'Teilzeit', 'Homeoffice', 'Alle'
	 */
	arbeitsZeit: ['Vollzeit'],
	/**
	 * befristung: Art des Arbeitsvertrags.
	 * Mögliche Werte: 'Befristet', 'Unbefristet', 'Alle'
	 */
	befristung: ['Unbefristet'],
	/**
	 * veröffentlichkeit: Zeitrahmen, in dem die Stellenanzeigen veröffentlicht wurden.
	 * Mögliche Werte: 'Heute', 'Gestern', '1 Woche', '2 Wochen', '4 Wochen', 'Alle'
	 */
	veröffentlichkeit: ['Alle'],
	/**
	 * berufsfeld: Übergeordnete Berufsfelder, in denen gesucht wird.
	 * Beispiele finden Sie auf der Seite der Bundesagentur für Arbeit.
	 */
	berufsfeld: [
	'Softwareentwicklung und Programmierung', 
	'Informatik'
	],
	/**
	 * beruf: Spezifische Berufe, nach denen gesucht wird.
	 * Beispiele finden Sie auf der Seite der Bundesagentur für Arbeit.
	 */
	beruf: [
	'Softwareentwickler/in', 
	'Web Developer', 
	'Fachinformatiker/in - Anwendungsentwicklung'
	],
	 /**
	 * Branche, in der nach Arbeitsplätzen gesucht wird.
	 * Beispiele: IT-Computer-Telekommunikation
	 * Siehe die Seite der Bundesagentur für Arbeit für mögliche Branchen.
	 */
	 branche: [
			'IT-Computer-Telekommunikation'
	]
};
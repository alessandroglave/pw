export const roomTypes = {
	Single: "Camera singola",
	Double: "Camera doppia",
	"Deluxe Double": "Camera doppia Deluxe",
	Suite: "Suite",
	"Presidential Suite": "Suite Presidenziale",
};

export const roomTypesMap = new Map<string, string>([
	["Single", "Camera singola"],
	["Double", "Camera doppia"],
	["Deluxe Double", "Camera doppia Deluxe"],
	["Suite", "Suite"],
	["Presidential Suite", "Suite Presidenziale"],
]);

// Map of mock descriptions (created with ChatGPT) by roomType
export const descriptionsByTypesMap = new Map<string, string>([
	[
		"Single",
		"La camera singola è pensata per offrire comfort e funzionalità a chi viaggia da solo, garantendo un soggiorno tranquillo e accogliente. Dotata di un letto singolo comodo, bagno privato con doccia e prodotti di cortesia, rappresenta una soluzione ideale per brevi o lunghi soggiorni. La connessione Wi-Fi gratuita consente di restare connessi per lavoro o svago, mentre la climatizzazione regolabile assicura il massimo benessere in ogni stagione. La presenza di una scrivania rende la stanza adatta anche ai viaggiatori business. Ogni camera è inoltre dotata di TV a schermo piatto con canali nazionali e internazionali. Il servizio di pulizia giornaliero e l’accesso alle aree comuni dell’hotel completano l’esperienza, assicurando comodità e praticità per ogni esigenza. Grazie alla posizione strategica dell’hotel, la camera singola rappresenta un punto di partenza ideale per scoprire la città o raggiungere i principali luoghi di interesse.",
	],
	[
		"Double",
		"La camera doppia è progettata per garantire comfort e spazio a due ospiti, ideale per coppie, amici o colleghi in viaggio. Arredata con cura, offre la scelta tra un letto matrimoniale ampio o due letti singoli separati, adattandosi alle diverse esigenze. Dispone di bagno privato con doccia, asciugacapelli e prodotti di cortesia per un soggiorno senza pensieri. Gli ospiti possono usufruire della connessione Wi-Fi gratuita, della TV a schermo piatto con canali internazionali e di un sistema di climatizzazione regolabile per il massimo relax in ogni momento. La camera è inoltre dotata di scrivania e guardaroba spazioso, per assicurare praticità durante il soggiorno. Il servizio di pulizia giornaliero mantiene l’ambiente sempre accogliente, mentre l’accesso alle aree comuni dell’hotel completa l’esperienza. Perfetta per chi cerca un ambiente elegante e funzionale, la camera doppia garantisce un soggiorno piacevole in ogni occasione.",
	],
	[
		"Deluxe Double",
		"La camera doppia Deluxe è una scelta esclusiva per chi desidera un soggiorno di livello superiore, unendo eleganza e comfort. Spaziosa e finemente arredata, offre un letto matrimoniale king-size o due letti singoli di alta qualità, garantendo un riposo perfetto. Il bagno privato, completo di materiali pregiati, include una doccia a pioggia, set di cortesia di lusso e asciugamani morbidi. Tra i comfort moderni, la camera dispone di Wi-Fi ad alta velocità, TV a schermo piatto con canali premium, climatizzazione regolabile e minibar assortito. Un angolo relax con poltrone e tavolino aggiunge un tocco di classe, ideale per godersi un momento di tranquillità. La vista panoramica dalla finestra o dal balcone privato arricchisce l’esperienza, rendendo questa camera perfetta per coppie o viaggiatori esigenti. Il servizio in camera e la pulizia giornaliera completano un soggiorno pensato per il massimo piacere.",
	],
	[
		"Suite",
		"La Suite è l’opzione ideale per chi cerca lusso e spazio senza compromessi, pensata per offrire un soggiorno esclusivo e indimenticabile. L’ambiente ampio e raffinato è composto da una zona living separata, arredata con divano, poltrone e un elegante tavolino, e una camera da letto con un confortevole letto king-size. Il bagno, spazioso e rivestito con materiali di pregio, include una vasca da bagno, una doccia a pioggia, accappatoi soffici e un set di cortesia di alta gamma. Ogni dettaglio è curato per garantire il massimo del comfort, con dotazioni moderne come una TV a schermo piatto in entrambe le aree, Wi-Fi ad alta velocità, climatizzazione regolabile e un minibar di qualità. Alcune suite offrono un balcone o una terrazza privata con vista panoramica, perfette per rilassarsi in completa privacy. Il servizio in camera premium e una pulizia impeccabile quotidiana assicurano un’esperienza di soggiorno senza paragoni.",
	],
	[
		"Presidential Suite",
		"La Suite Presidenziale rappresenta il massimo dell’eleganza e dell’esclusività, progettata per ospitare fino a otto persone in un ambiente di assoluto prestigio. Gli spazi ampi e luminosi comprendono più camere da letto arredate con letti king-size e queen-size, ognuna dotata di biancheria di alta qualità e dettagli ricercati. La zona living, arredata con divani, poltrone e un grande tavolo da pranzo, offre un luogo ideale per momenti di relax o riunioni private. I bagni, rivestiti con materiali pregiati, dispongono di vasche idromassaggio, docce spaziose, accappatoi e set di cortesia di lusso. Tra i comfort esclusivi ci sono una cucina completamente attrezzata, un minibar fornito con prodotti di alta gamma e un servizio di concierge personalizzato. La suite dispone anche di terrazze o balconi privati con viste mozzafiato, ideali per rilassarsi in totale privacy. Ogni dettaglio è pensato per offrire un’esperienza unica e indimenticabile.",
	],
]);

export const roomMocksHeaderImagesMap = new Map<string, string>([
	["Single", "/mocks/header-05.jpg"],
	["Double", "/mocks/header-04.jpg"],
	["Deluxe Double", "/mocks/header-03.jpg"],
	["Suite", "/mocks/header-02.jpg"],
	["Presidential Suite", "/mocks/header-01.jpg"],
])

export const roomMocksGalleryImages = [
	"/mocks/pic-01.jpg",
	"/mocks/pic-02.jpg",
	"/mocks/pic-03.jpg",
	"/mocks/pic-04.jpg",
	"/mocks/pic-05.jpg",
	"/mocks/pic-06.jpg",
	"/mocks/pic-07.jpg",
	"/mocks/pic-08.jpg",
	"/mocks/pic-09.jpg",
	"/mocks/pic-10.jpg",
	"/mocks/pic-11.jpg",
	"/mocks/pic-12.jpg",
];

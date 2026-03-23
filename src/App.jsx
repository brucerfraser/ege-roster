import { useState, useMemo, useEffect } from "react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  nl: {
    appName: "EGE Dienstrooster",
    nav: { calendar: "Kalender", roster: "Rooster", myDuties: "Mijn Diensten", admin: "Beheer" },
    roles: { admin: "Beheerder", user: "Vrijwilliger" },
    testMode: "Testmodus",
    switchTo: "Wissel naar",
    lang: "EN",
    search: "Zoeken op naam of taak…",
    noResults: "Geen resultaten gevonden.",
    published: "Gepubliceerd",
    unpublished: "Concept",
    locked: "Vergrendeld",
    green: "Volledig ingevuld",
    orange: "Gedeeltelijk ingevuld",
    red: "Niet ingevuld",
    duties: "Taken",
    people: "Personen",
    availability: "Beschikbaarheid",
    available: "Beschikbaar",
    unavailable: "Niet beschikbaar",
    conditional: "Onder voorbehoud",
    notSet: "Niet ingesteld",
    mySchedule: "Mijn rooster",
    upcomingDuties: "Aankomende diensten",
    noDuties: "Geen diensten gepland.",
    serviceDate: "Dienst datum",
    duty: "Taak",
    assignedTo: "Toegewezen aan",
    addPerson: "Persoon toevoegen",
    editDuty: "Taak bewerken",
    saveChanges: "Opslaan",
    cancel: "Annuleren",
    publish: "Publiceren",
    lock: "Vergrendelen",
    unlock: "Ontgrendelen",
    addDate: "Datum toevoegen",
    deleteDate: "Datum verwijderen",
    manageDuties: "Taken beheren",
    managePeople: "Personen beheren",
    manageDates: "Datums beheren",
    week: "Week",
    allDates: "Alle datums",
    filterByGroup: "Filter op groep",
    allGroups: "Alle groepen",
    close: "Sluiten",
    notes: "Notities",
    speaker: "Spreker",
    group: "Groep",
    slots: "Plaatsen",
    name: "Naam",
    email: "E-mail",
    role: "Rol",
    actions: "Acties",
    edit: "Bewerken",
    delete: "Verwijderen",
    add: "Toevoegen",
    selectPerson: "Selecteer persoon",
    snippet: "Snippet bekijken",
    snippetTitle: "Openbare snippet (volgende dienst)",
    copySnippet: "Kopiëren",
    copied: "Gekopieerd!",
    loginAs: "Inloggen als",
    myProfile: "Mijn profiel",
    weekPref: "Voorkeur weken",
    evenWeeks: "Even weken",
    oddWeeks: "Oneven weken",
    bothWeeks: "Beide",
    searchResults: "Zoekresultaten",
    dutiesTab: "Taken",
    datesTab: "Datums",
    peopleTab: "Personen",
    signOut: "Afmelden",
    mandatory: "Verplicht",
    mandatoryHint: "Dag wordt groen als alle verplichte taken zijn ingevuld",
    addDuty: "Taak toevoegen",
    editPerson: "Persoon bewerken",
    editDate: "Datum bewerken",
    editDutyAdmin: "Taak bewerken",
    nameNl: "Naam (NL)",
    nameEn: "Naam (EN)",
    extraService: "Extra dienst",
  },
  en: {
    appName: "EGE Service Roster",
    nav: { calendar: "Calendar", roster: "Roster", myDuties: "My Duties", admin: "Admin" },
    roles: { admin: "Admin", user: "Volunteer" },
    testMode: "Test Mode",
    switchTo: "Switch to",
    lang: "NL",
    search: "Search by name or duty…",
    noResults: "No results found.",
    published: "Published",
    unpublished: "Draft",
    locked: "Locked",
    green: "Fully staffed",
    orange: "Partially staffed",
    red: "No one assigned",
    duties: "Duties",
    people: "People",
    availability: "Availability",
    available: "Available",
    unavailable: "Not available",
    conditional: "Conditional",
    notSet: "Not set",
    mySchedule: "My schedule",
    upcomingDuties: "Upcoming duties",
    noDuties: "No duties scheduled.",
    serviceDate: "Service date",
    duty: "Duty",
    assignedTo: "Assigned to",
    addPerson: "Add person",
    editDuty: "Edit duty",
    saveChanges: "Save",
    cancel: "Cancel",
    publish: "Publish",
    lock: "Lock",
    unlock: "Unlock",
    addDate: "Add date",
    deleteDate: "Delete date",
    manageDuties: "Manage duties",
    managePeople: "Manage people",
    manageDates: "Manage dates",
    week: "Week",
    allDates: "All dates",
    filterByGroup: "Filter by group",
    allGroups: "All groups",
    close: "Close",
    notes: "Notes",
    speaker: "Speaker",
    group: "Group",
    slots: "Slots",
    name: "Name",
    email: "Email",
    role: "Role",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    selectPerson: "Select person",
    snippet: "View snippet",
    snippetTitle: "Public snippet (next service)",
    copySnippet: "Copy",
    copied: "Copied!",
    loginAs: "Log in as",
    myProfile: "My profile",
    weekPref: "Week preference",
    evenWeeks: "Even weeks",
    oddWeeks: "Odd weeks",
    bothWeeks: "Both",
    searchResults: "Search results",
    dutiesTab: "Duties",
    datesTab: "Dates",
    peopleTab: "People",
    signOut: "Sign out",
    mandatory: "Mandatory",
    mandatoryHint: "Day turns green when all mandatory duties are filled",
    addDuty: "Add duty",
    editPerson: "Edit person",
    editDate: "Edit date",
    editDutyAdmin: "Edit duty",
    nameNl: "Name (NL)",
    nameEn: "Name (EN)",
    extraService: "Extra service",
  },
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const DUTY_GROUPS = {
  nl: ["Leiding", "Worship Team", "Band", "Geluid & Media", "Kinderen", "Gastvrijheid"],
  en: ["Leadership", "Worship Team", "Band", "Sound & Media", "Children", "Hospitality"],
};

const DUTY_TYPES = [
  { id: "d1",  nl: "Spreker/ster",       en: "Speaker",           group: 0, slots: 1, mandatory: true  },
  { id: "d2",  nl: "Gastheer/vrouw 1",   en: "Host/Hostess 1",    group: 0, slots: 1, mandatory: true  },
  { id: "d3",  nl: "Gastheer/vrouw 2",   en: "Host/Hostess 2",    group: 0, slots: 1, mandatory: false },
  { id: "d4",  nl: "Worship Leader",     en: "Worship Leader",    group: 1, slots: 1, mandatory: true  },
  { id: "d5",  nl: "Zanger 1",           en: "Singer 1",          group: 1, slots: 1, mandatory: true  },
  { id: "d6",  nl: "Zanger 2",           en: "Singer 2",          group: 1, slots: 1, mandatory: false },
  { id: "d7",  nl: "Zanger 3",           en: "Singer 3",          group: 1, slots: 1, mandatory: false },
  { id: "d8",  nl: "Zanger 4",           en: "Singer 4",          group: 1, slots: 1, mandatory: false },
  { id: "d9",  nl: "Piano",              en: "Piano",             group: 2, slots: 1, mandatory: true  },
  { id: "d10", nl: "Gitaar",             en: "Guitar",            group: 2, slots: 1, mandatory: false },
  { id: "d11", nl: "Elektrische Gitaar", en: "Electric Guitar",   group: 2, slots: 1, mandatory: false },
  { id: "d12", nl: "Bas",                en: "Bass",              group: 2, slots: 1, mandatory: false },
  { id: "d13", nl: "Drum",               en: "Drums",             group: 2, slots: 1, mandatory: false },
  { id: "d14", nl: "Extra Instrument 1", en: "Extra Instrument 1",group: 2, slots: 1, mandatory: false },
  { id: "d15", nl: "Extra Instrument 2", en: "Extra Instrument 2",group: 2, slots: 1, mandatory: false },
  { id: "d16", nl: "Geluid 1",           en: "Sound 1",           group: 3, slots: 1, mandatory: true  },
  { id: "d17", nl: "Geluid 2",           en: "Sound 2",           group: 3, slots: 1, mandatory: false },
  { id: "d18", nl: "Beamer",             en: "Beamer",            group: 3, slots: 1, mandatory: true  },
  { id: "d19", nl: "Stream Mixer",       en: "Stream Mixer",      group: 3, slots: 1, mandatory: false },
  { id: "d20", nl: "Camera 1",           en: "Camera 1",          group: 3, slots: 1, mandatory: false },
  { id: "d21", nl: "Camera 2",           en: "Camera 2",          group: 3, slots: 1, mandatory: false },
  { id: "d22", nl: "Camera 3",           en: "Camera 3",          group: 3, slots: 1, mandatory: false },
  { id: "d23", nl: "Licht",              en: "Lights",            group: 3, slots: 1, mandatory: false },
  { id: "d24", nl: "Crèche 1",           en: "Crèche 1",          group: 4, slots: 1, mandatory: true  },
  { id: "d25", nl: "Crèche 2",           en: "Crèche 2",          group: 4, slots: 1, mandatory: false },
  { id: "d26", nl: "Zondagsschool 1",    en: "Sunday School 1",   group: 4, slots: 1, mandatory: true  },
  { id: "d27", nl: "Zondagsschool 2",    en: "Sunday School 2",   group: 4, slots: 1, mandatory: false },
  { id: "d28", nl: "Zondagsschool 3",    en: "Sunday School 3",   group: 4, slots: 1, mandatory: false },
  { id: "d29", nl: "Zondagsschool 4",    en: "Sunday School 4",   group: 4, slots: 1, mandatory: false },
  { id: "d30", nl: "Nazorg 1",           en: "Pastoral Care 1",   group: 5, slots: 1, mandatory: true  },
  { id: "d31", nl: "Nazorg 2",           en: "Pastoral Care 2",   group: 5, slots: 1, mandatory: false },
  { id: "d32", nl: "Keukenteam Leider",  en: "Kitchen Lead",      group: 5, slots: 1, mandatory: true  },
  { id: "d33", nl: "Keukenteam 1",       en: "Kitchen Team 1",    group: 5, slots: 1, mandatory: true  },
  { id: "d34", nl: "Keukenteam 2",       en: "Kitchen Team 2",    group: 5, slots: 1, mandatory: false },
  { id: "d35", nl: "Keukenteam 3",       en: "Kitchen Team 3",    group: 5, slots: 1, mandatory: false },
  { id: "d36", nl: "Keukenteam 4",       en: "Kitchen Team 4",    group: 5, slots: 1, mandatory: false },
  { id: "d37", nl: "Begroetingsdienst 1",en: "Greeting Team 1",   group: 5, slots: 1, mandatory: true  },
  { id: "d38", nl: "Begroetingsdienst 2",en: "Greeting Team 2",   group: 5, slots: 1, mandatory: false },
  { id: "d39", nl: "Begroetingsdienst 3",en: "Greeting Team 3",   group: 5, slots: 1, mandatory: false },
];

// Map old Excel duty names → new duty IDs
const DUTY_MAP = {
  "Spreker/ster": "d1", "Gastheer/vrw 1": "d2", "Gastheer/vrw 2": "d3",
  "Zang Leider": "d4", "Zanger 1": "d5", "Zanger 2": "d6", "Zanger 3": "d7", "Zanger 4": "d8",
  "Piano": "d9", "Gitaar": "d10", "Elek. Gitaar": "d11", "Bas": "d12", "Drum": "d13",
  "Ex Instrument 1": "d14", "Ex Instrument 2": "d15",
  "Geluid 1": "d16", "Geluid 2": "d17", "Beamer": "d18", "Stream Mixer": "d19",
  "Camera 1": "d20", "Camera 2": "d21", "Camera 3": "d22",
  "Crèche 1": "d24", "Crèche 2": "d25",
  "ZondagSchool 1": "d26", "ZondagSchool 2": "d27", "ZondagSchool 3": "d28", "ZondagSchool 4": "d29",
  "Nazorg1": "d30", "Nazorg2": "d31",
  "Koffie Leider": "d32", "Koffie en Thee 1": "d33", "Koffie en Thee 2": "d34",
  "Koffie en Thee 3": "d35", "Koffie en Thee 4": "d36",
  "Deur Welkom 1": "d37", "Deur Welkom 2": "d38", "Deur Welkom 3": "d39",
};

const SERVICE_DATES_RAW = [
  {date:"2026-01-04",notes:""},{date:"2026-01-11",notes:"Straat Present"},{date:"2026-01-18",notes:"8+ in de zaal"},
  {date:"2026-01-23",notes:"Praise & Prayer",extra:true},{date:"2026-01-25",notes:""},
  {date:"2026-02-01",notes:""},{date:"2026-02-08",notes:"Compassion generatiedienst"},{date:"2026-02-15",notes:""},
  {date:"2026-02-22",notes:"8+ in de zaal"},{date:"2026-03-01",notes:""},{date:"2026-03-08",notes:""},
  {date:"2026-03-15",notes:""},{date:"2026-03-22",notes:""},{date:"2026-03-29",notes:""},
  {date:"2026-04-03",notes:"Goede Vrijdag",extra:true},{date:"2026-04-05",notes:"Pasen"},
  {date:"2026-04-12",notes:""},{date:"2026-04-19",notes:""},{date:"2026-04-26",notes:""},
  {date:"2026-05-03",notes:"8+ in de zaal"},{date:"2026-05-10",notes:""},
  {date:"2026-05-13",notes:"Praise & Prayer",extra:true},{date:"2026-05-17",notes:""},
  {date:"2026-05-24",notes:"Pinksteren"},{date:"2026-05-31",notes:"Open Doors"},
  {date:"2026-06-07",notes:""},{date:"2026-06-14",notes:"Zondagsschool Kamp"},
  {date:"2026-06-21",notes:""},{date:"2026-06-28",notes:"Afscheid Groep 8"},
  {date:"2026-07-05",notes:""},{date:"2026-07-12",notes:""},{date:"2026-07-19",notes:""},
  {date:"2026-07-26",notes:""},{date:"2026-08-02",notes:""},{date:"2026-08-09",notes:""},
  {date:"2026-08-16",notes:""},{date:"2026-08-23",notes:""},
  {date:"2026-08-30",notes:"Startdag"},{date:"2026-09-06",notes:""},
  {date:"2026-09-13",notes:""},{date:"2026-09-20",notes:""},{date:"2026-09-27",notes:""},
  {date:"2026-10-04",notes:"Israëlzondag"},{date:"2026-10-11",notes:""},{date:"2026-10-18",notes:""},
  {date:"2026-10-25",notes:""},{date:"2026-11-01",notes:""},{date:"2026-11-08",notes:""},
  {date:"2026-11-15",notes:""},{date:"2026-11-22",notes:""},{date:"2026-11-29",notes:""},
  {date:"2026-12-06",notes:""},{date:"2026-12-13",notes:""},
  {date:"2026-12-20",notes:""},{date:"2026-12-24",notes:"Kerstavond",extra:true},
  {date:"2026-12-25",notes:"Kerst"},{date:"2026-12-27",notes:""},
  {date:"2027-01-03",notes:""},{date:"2027-01-10",notes:""},
];

const ASSIGNMENTS_RAW = [
  {date:"2026-01-04",duty:"Gastheer/vrw 1",person:"Saskia"},{date:"2026-01-04",duty:"Zang Leider",person:"Kirsty"},
  {date:"2026-01-04",duty:"Zanger 1",person:"Elsien"},{date:"2026-01-04",duty:"Zanger 2",person:"Joran"},
  {date:"2026-01-04",duty:"Piano",person:"Stephan Dor"},{date:"2026-01-04",duty:"Elek. Gitaar",person:"Jeroen vdM"},
  {date:"2026-01-04",duty:"Bas",person:"Andy"},{date:"2026-01-04",duty:"Drum",person:"Jeroen"},
  {date:"2026-01-04",duty:"Geluid 1",person:"Richard"},{date:"2026-01-04",duty:"Beamer",person:"Levi"},
  {date:"2026-01-04",duty:"ZondagSchool 1",person:"Mirthe"},{date:"2026-01-04",duty:"ZondagSchool 2",person:"Esther"},
  {date:"2026-01-04",duty:"ZondagSchool 3",person:"Marlon"},{date:"2026-01-04",duty:"ZondagSchool 4",person:"Annika"},
  {date:"2026-01-04",duty:"Nazorg1",person:"Harrie"},{date:"2026-01-04",duty:"Nazorg2",person:"Roelie"},
  {date:"2026-01-04",duty:"Koffie Leider",person:"Ittie"},{date:"2026-01-04",duty:"Koffie en Thee 1",person:"Harm"},
  {date:"2026-01-04",duty:"Koffie en Thee 2",person:"Marion"},
  {date:"2026-01-11",duty:"Spreker/ster",person:"Mark Hobers"},{date:"2026-01-11",duty:"Gastheer/vrw 1",person:"Esther L."},
  {date:"2026-01-11",duty:"Zang Leider",person:"Erwin"},{date:"2026-01-11",duty:"Zanger 1",person:"Anisa"},
  {date:"2026-01-11",duty:"Gitaar",person:"Erwin"},{date:"2026-01-11",duty:"Ex Instrument 1",person:"Bianca"},
  {date:"2026-01-11",duty:"Geluid 1",person:"Iwan"},{date:"2026-01-11",duty:"Beamer",person:"Roy"},
  {date:"2026-01-11",duty:"Crèche 1",person:"Nicole"},
  {date:"2026-01-11",duty:"ZondagSchool 1",person:"Jeanet"},{date:"2026-01-11",duty:"ZondagSchool 2",person:"Naomi"},
  {date:"2026-01-11",duty:"ZondagSchool 3",person:"Misael"},{date:"2026-01-11",duty:"ZondagSchool 4",person:"Elsien"},
  {date:"2026-01-11",duty:"Nazorg1",person:"BertJan"},{date:"2026-01-11",duty:"Nazorg2",person:"Julia"},
  {date:"2026-01-11",duty:"Koffie Leider",person:"Gealma"},{date:"2026-01-11",duty:"Koffie en Thee 1",person:"Bea"},
  {date:"2026-01-11",duty:"Koffie en Thee 2",person:"Janny M"},
  {date:"2026-01-18",duty:"Spreker/ster",person:"Jan Boelhouwers"},{date:"2026-01-18",duty:"Gastheer/vrw 1",person:"Gealma"},
  {date:"2026-01-18",duty:"Zang Leider",person:"Kirsty"},{date:"2026-01-18",duty:"Zanger 1",person:"Nanja"},
  {date:"2026-01-18",duty:"Zanger 2",person:"Joran"},{date:"2026-01-18",duty:"Piano",person:"Stephan Dor"},
  {date:"2026-01-18",duty:"Gitaar",person:"Erwin"},{date:"2026-01-18",duty:"Geluid 1",person:"Richard"},
  {date:"2026-01-18",duty:"Beamer",person:"Levi"},{date:"2026-01-18",duty:"Crèche 1",person:"Marjon"},
  {date:"2026-01-18",duty:"Crèche 2",person:"Ann"},
  {date:"2026-01-18",duty:"ZondagSchool 1",person:"Marieke"},{date:"2026-01-18",duty:"ZondagSchool 2",person:"Therèse"},
  {date:"2026-01-18",duty:"Nazorg1",person:"Gealma"},{date:"2026-01-18",duty:"Nazorg2",person:"Rob"},
  {date:"2026-01-18",duty:"Koffie Leider",person:"Dorethe"},{date:"2026-01-18",duty:"Koffie en Thee 1",person:"Hennie P."},
  {date:"2026-01-18",duty:"Koffie en Thee 2",person:"Betsie"},
  {date:"2026-01-25",duty:"Spreker/ster",person:"Charles Campbell"},{date:"2026-01-25",duty:"Gastheer/vrw 1",person:"Saskia"},
  {date:"2026-01-25",duty:"Zang Leider",person:"Esther dV"},{date:"2026-01-25",duty:"Zanger 1",person:"Saskia"},
  {date:"2026-01-25",duty:"Zanger 2",person:"Misael"},{date:"2026-01-25",duty:"Piano",person:"Julisa"},
  {date:"2026-01-25",duty:"Gitaar",person:"Wesley"},{date:"2026-01-25",duty:"Bas",person:"Roderik"},
  {date:"2026-01-25",duty:"Geluid 1",person:"Bastiaan"},{date:"2026-01-25",duty:"Beamer",person:"Stephan Dol"},
  {date:"2026-01-25",duty:"Crèche 1",person:"Linda"},
  {date:"2026-01-25",duty:"ZondagSchool 1",person:"Esther"},{date:"2026-01-25",duty:"ZondagSchool 2",person:"Manoah"},
  {date:"2026-01-25",duty:"ZondagSchool 3",person:"Marlon"},{date:"2026-01-25",duty:"ZondagSchool 4",person:"Mirthe"},
  {date:"2026-01-25",duty:"Nazorg1",person:"Mechtelien"},{date:"2026-01-25",duty:"Nazorg2",person:"Hermien"},
  {date:"2026-01-25",duty:"Koffie Leider",person:"Judith L."},{date:"2026-01-25",duty:"Koffie en Thee 1",person:"An"},
  {date:"2026-01-25",duty:"Koffie en Thee 2",person:"Grieta"},
  {date:"2026-02-01",duty:"Spreker/ster",person:"Edwin vd Zwaag"},{date:"2026-02-01",duty:"Gastheer/vrw 1",person:"Niels BvdB"},
  {date:"2026-02-01",duty:"Gastheer/vrw 2",person:"Bianca"},{date:"2026-02-01",duty:"Zang Leider",person:"Esther dV"},
  {date:"2026-02-01",duty:"Zanger 1",person:"Nanja"},{date:"2026-02-01",duty:"Zanger 2",person:"Elsien"},
  {date:"2026-02-01",duty:"Piano",person:"Stephan Dor"},{date:"2026-02-01",duty:"Elek. Gitaar",person:"Jeroen vdM"},
  {date:"2026-02-01",duty:"Bas",person:"Andy"},{date:"2026-02-01",duty:"Drum",person:"Stefan Sm"},
  {date:"2026-02-01",duty:"Geluid 1",person:"Richard"},{date:"2026-02-01",duty:"Beamer",person:"Levi"},
  {date:"2026-02-01",duty:"Crèche 1",person:"Ann"},
  {date:"2026-02-01",duty:"ZondagSchool 1",person:"Annika"},{date:"2026-02-01",duty:"ZondagSchool 2",person:"Tirzah"},
  {date:"2026-02-01",duty:"ZondagSchool 3",person:"Joris"},{date:"2026-02-01",duty:"ZondagSchool 4",person:"Ashwin"},
  {date:"2026-02-01",duty:"Nazorg1",person:"Gerrit B."},{date:"2026-02-01",duty:"Nazorg2",person:"Dineke B."},
  {date:"2026-02-01",duty:"Koffie Leider",person:"Addi"},{date:"2026-02-01",duty:"Koffie en Thee 1",person:"Eddy"},
  {date:"2026-02-01",duty:"Koffie en Thee 2",person:"Janneke"},
  {date:"2026-02-08",duty:"Spreker/ster",person:"Compassion"},{date:"2026-02-08",duty:"Gastheer/vrw 1",person:"Kirsty"},
  {date:"2026-02-08",duty:"Zang Leider",person:"Erwin"},{date:"2026-02-08",duty:"Zanger 1",person:"Elly"},
  {date:"2026-02-08",duty:"Zanger 2",person:"Saskia"},{date:"2026-02-08",duty:"Gitaar",person:"Erwin"},
  {date:"2026-02-08",duty:"Bas",person:"Rob"},{date:"2026-02-08",duty:"Geluid 1",person:"Iwan"},
  {date:"2026-02-08",duty:"Beamer",person:"Roy"},{date:"2026-02-08",duty:"Crèche 1",person:"Hendriët"},
  {date:"2026-02-08",duty:"ZondagSchool 1",person:"Marieke"},{date:"2026-02-08",duty:"ZondagSchool 2",person:"Therèse"},
  {date:"2026-02-08",duty:"ZondagSchool 3",person:"Misael"},{date:"2026-02-08",duty:"ZondagSchool 4",person:"Elsien"},
  {date:"2026-02-08",duty:"Nazorg1",person:"BertJan"},{date:"2026-02-08",duty:"Nazorg2",person:"Julia"},
  {date:"2026-02-08",duty:"Koffie Leider",person:"Harm"},{date:"2026-02-08",duty:"Koffie en Thee 1",person:"Ittie"},
  {date:"2026-02-08",duty:"Koffie en Thee 2",person:"Marion"},
  {date:"2026-02-15",duty:"Spreker/ster",person:"Rik van Boven"},{date:"2026-02-15",duty:"Gastheer/vrw 1",person:"Gealma"},
  {date:"2026-02-15",duty:"Zang Leider",person:"Kirsty"},{date:"2026-02-15",duty:"Zanger 1",person:"Anisa"},
  {date:"2026-02-15",duty:"Zanger 2",person:"Misael"},{date:"2026-02-15",duty:"Piano",person:"Stephan Dor"},
  {date:"2026-02-15",duty:"Drum",person:"Jeroen"},{date:"2026-02-15",duty:"Geluid 1",person:"Richard"},
  {date:"2026-02-15",duty:"Beamer",person:"Elly"},{date:"2026-02-15",duty:"Crèche 1",person:"Marjon"},
  {date:"2026-02-15",duty:"ZondagSchool 1",person:"Esther"},{date:"2026-02-15",duty:"ZondagSchool 2",person:"Mirthe"},
  {date:"2026-02-15",duty:"ZondagSchool 3",person:"Marlon"},
  {date:"2026-02-15",duty:"Nazorg1",person:"Gealma"},{date:"2026-02-15",duty:"Nazorg2",person:"Rob"},
  {date:"2026-02-15",duty:"Koffie Leider",person:"Gealma"},{date:"2026-02-15",duty:"Koffie en Thee 1",person:"Bea"},
  {date:"2026-02-15",duty:"Koffie en Thee 2",person:"Janny M"},
  {date:"2026-03-15",duty:"Spreker/ster",person:"Rob Berghout"},{date:"2026-03-15",duty:"Gastheer/vrw 1",person:"Niels BvdB"},
  {date:"2026-03-15",duty:"Gastheer/vrw 2",person:"Bianca"},{date:"2026-03-15",duty:"Zang Leider",person:"Esther dV"},
  {date:"2026-03-15",duty:"Zanger 1",person:"Nanja"},{date:"2026-03-15",duty:"Zanger 2",person:"Misael"},
  {date:"2026-03-15",duty:"Piano",person:"Stephan Dor"},{date:"2026-03-15",duty:"Drum",person:"Erwin"},
  {date:"2026-03-15",duty:"Geluid 1",person:"Bastiaan"},{date:"2026-03-15",duty:"Beamer",person:"Elly"},
  {date:"2026-03-15",duty:"Crèche 1",person:"Marjon"},
  {date:"2026-03-15",duty:"ZondagSchool 1",person:"Marieke"},{date:"2026-03-15",duty:"ZondagSchool 2",person:"Therèse"},
  {date:"2026-03-15",duty:"ZondagSchool 3",person:"Mirthe"},{date:"2026-03-15",duty:"ZondagSchool 4",person:"Marlon"},
  {date:"2026-03-15",duty:"Nazorg1",person:"BertJan"},{date:"2026-03-15",duty:"Nazorg2",person:"Julia"},
  {date:"2026-03-15",duty:"Koffie Leider",person:"Harm"},{date:"2026-03-15",duty:"Koffie en Thee 1",person:"Ittie"},
  {date:"2026-03-15",duty:"Koffie en Thee 2",person:"Marion"},
  {date:"2026-04-03",duty:"Gastheer/vrw 1",person:"Kirsty"},{date:"2026-04-03",duty:"Zang Leider",person:"Esther dV"},
  {date:"2026-04-03",duty:"Zanger 1",person:"Saskia"},{date:"2026-04-03",duty:"Zanger 2",person:"Misael"},
  {date:"2026-04-03",duty:"Bas",person:"Andy"},{date:"2026-04-03",duty:"Geluid 1",person:"Richard"},
  {date:"2026-04-03",duty:"Beamer",person:"Roy"},
  {date:"2026-04-05",duty:"Spreker/ster",person:"Anneke"},{date:"2026-04-05",duty:"Gastheer/vrw 1",person:"Saskia"},
  {date:"2026-04-05",duty:"Zang Leider",person:"Kirsty"},{date:"2026-04-05",duty:"Geluid 1",person:"Bastiaan"},
  {date:"2026-04-05",duty:"Beamer",person:"Roy"},{date:"2026-04-05",duty:"Crèche 1",person:"Hendriët"},
  {date:"2026-04-05",duty:"ZondagSchool 1",person:"Marieke"},{date:"2026-04-05",duty:"ZondagSchool 2",person:"Therèse"},
  {date:"2026-04-05",duty:"ZondagSchool 3",person:"Misael"},{date:"2026-04-05",duty:"ZondagSchool 4",person:"Elsien"},
  {date:"2026-04-05",duty:"Nazorg1",person:"Mechtelien"},{date:"2026-04-05",duty:"Nazorg2",person:"Hermien"},
  {date:"2026-04-05",duty:"Koffie Leider",person:"Judith L."},{date:"2026-04-05",duty:"Koffie en Thee 1",person:"An"},
  {date:"2026-04-05",duty:"Koffie en Thee 2",person:"Grieta"},
];

const PEOPLE_RAW = [
  "Addi","An","Andy","Anisa","Ann","Anna-Jane","Anneke","Annika","Ashwin",
  "Bastiaan","Bea","BertJan","Betsie","Bianca",
  "Dineke B.","Dorethe","Eddy","Elly","Elsien","Erwin","Esther","Esther L.","Esther dV",
  "Gealma","Gerrit B.","Grieta","Harm","Harrie","Hendriët","Hennie P.","Hermien",
  "Ittie","Iwan","Janneke","Janny M","Jeanet","Jeroen","Jeroen vdM","Joeri","Joran","Joris",
  "Judith L.","Julia","Julisa","Kirsty","Levi","Linda","Manoah","Marieke","Marion","Marjon",
  "Marlon","Mechtelien","Mirthe","Misael","Nanja","Naomi","Nicole","Niels BvdB",
  "Paul","Regina","Richard","Rick Hilb.","Roderik","Roelie","Rob","Roy",
  "Saskia","Sonja","Stefan Sm","Stephan","Stephan Dol","Stephan Dor","Therèse","Tirzah",
  "Wesley","Addi","Eddy","Janneke","Gerrit B.","Dineke B.","Harm","Ittie","Marion",
  "Bea","Janny M","Gealma","Dorethe","Judith L.","An","Grieta","Mechtelien","Hermien",
  "BertJan","Julia","Harrie","Roelie",
];
const UNIQUE_PEOPLE = [...new Set(PEOPLE_RAW)].sort();

function getWeekNumber(dateStr) {
  const d = new Date(dateStr);
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function buildInitialState() {
  const serviceDates = SERVICE_DATES_RAW.map((s, i) => ({
    id: `sd${i+1}`, date: s.date, notes: s.notes || "",
    extra: s.extra || false, published: i < 10, locked: i < 5,
    week: getWeekNumber(s.date),
  }));

  const people = UNIQUE_PEOPLE.map((name, i) => ({
    id: `p${i+1}`, name, email: `${name.toLowerCase().replace(/[^a-z]/g,"")}@ege.nl`,
    role: name === "Esther L." ? "admin" : "user", active: true,
    weekPref: "both",
  }));

  const personByName = {};
  people.forEach(p => { personByName[p.name] = p.id; });

  const assignments = [];
  ASSIGNMENTS_RAW.forEach((a, i) => {
    const dutyId = DUTY_MAP[a.duty];
    if (!dutyId) return;
    const sdMatch = serviceDates.find(s => s.date === a.date);
    if (!sdMatch) return;
    const personId = personByName[a.person] || `ext_${a.person}`;
    assignments.push({ id: `a${i+1}`, serviceDateId: sdMatch.id, dutyId, personId, personName: a.person });
  });

  return { serviceDates, people, dutyTypes: DUTY_TYPES, assignments };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getFillStatus(sdId, assignments, dutyTypes) {
  const sdAssign = assignments.filter(a => a.serviceDateId === sdId);
  const filledIds = new Set(sdAssign.map(a => a.dutyId));
  const mandatory = dutyTypes.filter(d => d.mandatory);
  if (mandatory.length === 0) {
    const filled = sdAssign.length;
    const total = dutyTypes.length;
    if (filled === 0) return "red";
    if (filled >= total * 0.8) return "green";
    return "orange";
  }
  const allMandatoryFilled = mandatory.every(d => filledIds.has(d.id));
  if (allMandatoryFilled) return "green";
  if (sdAssign.length === 0) return "red";
  return "orange";
}

const STATUS_COLORS = { green: "#22c55e", orange: "#f97316", red: "#ef4444" };
const STATUS_BG = { green: "#dcfce7", orange: "#ffedd5", red: "#fee2e2" };

function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
}

function formatDateShort(dateStr, lang) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day:"numeric", month:"short" });
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#f5f4f0;--surface:#ffffff;--surface2:#f0efe9;
    --border:#e2e1d8;--border2:#d4d3c8;
    --text:#1a1a18;--text2:#5a5a52;--text3:#9a9a90;
    --accent:#1a472a;--accent2:#2d6a4f;--accentLight:#e8f5e9;
    --red:#ef4444;--orange:#f97316;--green:#22c55e;
    --redbg:#fee2e2;--orangebg:#ffedd5;--greenbg:#dcfce7;
    --radius:10px;--radius-sm:6px;
    --font:'IBM Plex Sans',sans-serif;--mono:'IBM Plex Mono',monospace;
    --shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05);
    --shadow-md:0 4px 6px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.05);
  }
  body{font-family:var(--font);background:var(--bg);color:var(--text);font-size:14px;line-height:1.5}
  #root{min-height:100vh;display:flex;flex-direction:column}
  
  /* Layout */
  .app-shell{display:flex;flex-direction:column;min-height:100vh}
  .topbar{background:var(--accent);color:#fff;padding:0 20px;height:52px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.15)}
  .topbar-logo{font-size:15px;font-weight:600;letter-spacing:.3px;flex:1}
  .topbar-logo span{opacity:.6;font-weight:300;font-size:13px;margin-left:6px}
  .nav{display:flex;gap:2px;background:rgba(255,255,255,.12);border-radius:8px;padding:3px}
  .nav-btn{background:none;border:none;color:rgba(255,255,255,.75);padding:5px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-family:var(--font);font-weight:400;transition:all .15s}
  .nav-btn:hover{color:#fff;background:rgba(255,255,255,.15)}
  .nav-btn.active{color:#fff;background:rgba(255,255,255,.22);font-weight:500}
  .topbar-right{display:flex;align-items:center;gap:10px}
  .test-badge{background:rgba(255,193,7,.25);border:1px solid rgba(255,193,7,.5);color:#ffc107;font-size:11px;padding:2px 8px;border-radius:20px;font-family:var(--mono);letter-spacing:.3px}
  .role-switch{background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.8);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px;font-family:var(--font);transition:all .15s}
  .role-switch:hover{background:rgba(255,255,255,.2);color:#fff}
  .lang-btn{background:none;border:1px solid rgba(255,255,255,.3);color:rgba(255,255,255,.8);padding:3px 8px;border-radius:5px;cursor:pointer;font-size:12px;font-family:var(--mono);transition:all .15s}
  .lang-btn:hover{border-color:rgba(255,255,255,.6);color:#fff}
  
  .content{flex:1;padding:24px 20px;max-width:1200px;width:100%;margin:0 auto}
  
  /* Cards */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
  .card-header{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
  .card-title{font-size:14px;font-weight:600;color:var(--text)}
  .card-body{padding:18px}
  
  /* Buttons */
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius-sm);border:none;cursor:pointer;font-family:var(--font);font-size:13px;font-weight:500;transition:all .15s;line-height:1}
  .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent2)}
  .btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{background:var(--border)}
  .btn-ghost{background:none;color:var(--text2);border:1px solid transparent}.btn-ghost:hover{background:var(--surface2);border-color:var(--border)}
  .btn-danger{background:#fee2e2;color:#dc2626;border:1px solid #fca5a5}.btn-danger:hover{background:#fecaca}
  .btn-sm{padding:4px 10px;font-size:12px}
  .btn-icon{padding:6px;background:none;border:none;cursor:pointer;color:var(--text2);border-radius:var(--radius-sm);transition:all .15s}.btn-icon:hover{background:var(--surface2);color:var(--text)}
  
  /* Forms */
  .form-group{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
  .form-label{font-size:12px;font-weight:500;color:var(--text2);text-transform:uppercase;letter-spacing:.5px}
  .form-input{padding:8px 12px;border:1px solid var(--border2);border-radius:var(--radius-sm);font-family:var(--font);font-size:13px;color:var(--text);background:var(--surface);transition:border .15s;outline:none}
  .form-input:focus{border-color:var(--accent)}
  .form-select{padding:8px 12px;border:1px solid var(--border2);border-radius:var(--radius-sm);font-family:var(--font);font-size:13px;color:var(--text);background:var(--surface);outline:none}
  .form-select:focus{border-color:var(--accent)}
  
  /* Tags */
  .tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:.3px}
  .tag-green{background:var(--greenbg);color:#15803d}
  .tag-orange{background:var(--orangebg);color:#c2410c}
  .tag-red{background:var(--redbg);color:#dc2626}
  .tag-blue{background:#dbeafe;color:#1d4ed8}
  .tag-gray{background:var(--surface2);color:var(--text2);border:1px solid var(--border)}
  .tag-accent{background:var(--accentLight);color:var(--accent);border:1px solid #a7d7b5}
  
  /* Search */
  .search-wrap{position:relative}
  .search-wrap svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none}
  .search-input{width:100%;padding:9px 12px 9px 34px;border:1px solid var(--border2);border-radius:var(--radius-sm);font-family:var(--font);font-size:13px;color:var(--text);background:var(--surface);outline:none;transition:border .15s}
  .search-input:focus{border-color:var(--accent)}
  
  /* Calendar */
  .calendar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  .cal-cell{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .15s;background:var(--surface)}
  .cal-cell:hover{border-color:var(--accent);box-shadow:var(--shadow-md);transform:translateY(-1px)}
  .cal-cell-header{height:5px}
  .cal-cell-body{padding:10px 10px 8px}
  .cal-date{font-size:12px;font-weight:600;color:var(--text);margin-bottom:2px;font-family:var(--mono)}
  .cal-dow{font-size:11px;color:var(--text3);margin-bottom:6px}
  .cal-notes{font-size:10px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-style:italic}
  .cal-fill{font-size:11px;margin-top:4px;display:flex;align-items:center;gap:4px}
  .cal-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .cal-extra-badge{display:inline-block;background:#fef3c7;color:#92400e;font-size:9px;padding:1px 5px;border-radius:3px;border:1px solid #fde68a;margin-bottom:4px}
  .cal-lock{font-size:9px;color:var(--text3);display:flex;align-items:center;gap:2px;margin-top:3px}
  
  /* Roster detail */
  .service-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
  .service-title{font-size:20px;font-weight:600}
  .service-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
  .duty-group{margin-bottom:20px}
  .duty-group-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border)}
  .duty-row{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:var(--radius-sm);margin-bottom:2px;transition:background .1s}
  .duty-row:hover{background:var(--surface2)}
  .duty-name{width:200px;font-size:13px;color:var(--text2);flex-shrink:0}
  .duty-person{flex:1;font-size:13px;font-weight:500;color:var(--text)}
  .duty-empty{color:var(--text3);font-style:italic;font-weight:400}
  .duty-edit-btn{opacity:0;transition:opacity .15s}
  .duty-row:hover .duty-edit-btn{opacity:1}
  
  /* My Duties */
  .my-duties-list{display:flex;flex-direction:column;gap:10px}
  .my-duty-card{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
  .my-duty-date{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--text);min-width:90px}
  .my-duty-info{flex:1}
  .my-duty-name{font-size:13px;font-weight:500;color:var(--text)}
  .my-duty-duty{font-size:12px;color:var(--text2);margin-top:2px}
  .avail-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}
  .avail-row:last-child{border:none}
  
  /* Admin tabs */
  .tabs{display:flex;gap:2px;border-bottom:2px solid var(--border);margin-bottom:20px}
  .tab-btn{background:none;border:none;padding:8px 16px;font-family:var(--font);font-size:13px;color:var(--text2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s}
  .tab-btn:hover{color:var(--text)}
  .tab-btn.active{color:var(--accent);border-bottom-color:var(--accent);font-weight:500}
  
  /* Table */
  .table{width:100%;border-collapse:collapse}
  .table th{text-align:left;padding:10px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text2);border-bottom:2px solid var(--border);background:var(--surface2)}
  .table td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
  .table tr:hover td{background:var(--surface2)}
  .table tr:last-child td{border:none}
  
  /* Modal */
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:var(--surface);border-radius:var(--radius);box-shadow:0 20px 40px rgba(0,0,0,.15);width:100%;max-width:480px;max-height:80vh;overflow-y:auto}
  .modal-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .modal-title{font-size:15px;font-weight:600}
  .modal-body{padding:20px}
  .modal-footer{padding:14px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px}
  
  /* Snippet */
  .snippet-box{background:#1a1a18;border-radius:var(--radius-sm);padding:16px;font-family:var(--mono);font-size:11px;color:#a8e6cf;white-space:pre-wrap;word-break:break-all;line-height:1.7;max-height:300px;overflow-y:auto}
  
  /* Misc */
  .divider{height:1px;background:var(--border);margin:16px 0}
  .empty-state{text-align:center;padding:40px 20px;color:var(--text3)}
  .empty-state svg{margin-bottom:12px;opacity:.3}
  .section-title{font-size:16px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:10px}
  .row{display:flex;gap:16px;flex-wrap:wrap}
  .col{flex:1;min-width:200px}
  .avail-btn{padding:4px 10px;border-radius:20px;border:1px solid var(--border2);font-size:11px;font-family:var(--font);cursor:pointer;transition:all .15s;background:var(--surface)}
  .avail-btn.av{background:var(--greenbg);color:#15803d;border-color:#a7d7a7}
  .avail-btn.un{background:var(--redbg);color:#dc2626;border-color:#fca5a5}
  .avail-btn.co{background:#fef3c7;color:#92400e;border-color:#fde68a}
  .search-result-row{padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
  .search-result-row:last-child{border:none}
  .search-result-row:hover{background:var(--surface2)}
  .person-chip{background:var(--accentLight);color:var(--accent);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;display:inline-flex;align-items:center;gap:4px;border:1px solid #a7d7b5}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Calendar: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Roster: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  User: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Admin: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Code: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => {
    const bl = navigator.language || "nl";
    return bl.startsWith("nl") ? "nl" : "en";
  });
  const t = T[lang];

  const [tab, setTab] = useState("calendar");
  const [role, setRole] = useState("admin"); // test mode: toggle
  const [currentUser] = useState({ id: "p1", name: "Esther L.", role: "admin" });

  const [state, setState] = useState(() => buildInitialState());
  const { serviceDates, people, dutyTypes, assignments } = state;

  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [showSnippet, setShowSnippet] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAdmin = role === "admin";

  // Next unpublished service for snippet
  const today = new Date().toISOString().slice(0, 10);
  const nextService = serviceDates.find(s => s.date >= today && s.published);

  function getSnippetJSON() {
    if (!nextService) return "{}";
    const sdAssign = assignments.filter(a => a.serviceDateId === nextService.id);
    const grouped = {};
    sdAssign.forEach(a => {
      const dt = dutyTypes.find(d => d.id === a.dutyId);
      if (!dt) return;
      const gName = DUTY_GROUPS[lang][dt.group];
      if (!grouped[gName]) grouped[gName] = [];
      grouped[gName].push({ duty: dt[lang], person: a.personName });
    });
    return JSON.stringify({ date: nextService.date, notes: nextService.notes, duties: grouped }, null, 2);
  }

  return (
    <div className="app-shell">
      <style>{css}</style>

      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-logo">
          {t.appName}
          <span>EGE</span>
        </div>
        <nav className="nav">
          {[
            { id:"calendar", label: t.nav.calendar, icon: <Icon.Calendar /> },
            { id:"roster",   label: t.nav.roster,   icon: <Icon.Roster /> },
            { id:"myduties", label: t.nav.myDuties,  icon: <Icon.User /> },
            ...(isAdmin ? [{ id:"admin", label: t.nav.admin, icon: <Icon.Admin /> }] : []),
          ].map(n => (
            <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <span className="test-badge">{t.testMode}</span>
          <button className="role-switch" onClick={() => setRole(r => r==="admin"?"user":"admin")}>
            {t.switchTo}: {role==="admin" ? t.roles.user : t.roles.admin}
          </button>
          <button className="lang-btn" onClick={() => setLang(l => l==="nl"?"en":"nl")}>{t.lang}</button>
        </div>
      </header>

      <main className="content">
        {tab === "calendar" && (
          <CalendarView
            t={t} lang={lang} serviceDates={serviceDates} assignments={assignments}
            dutyTypes={dutyTypes} people={people} isAdmin={isAdmin}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            setState={setState} state={state}
            searchQ={searchQ} setSearchQ={setSearchQ}
            showSnippet={showSnippet} setShowSnippet={setShowSnippet}
            getSnippetJSON={getSnippetJSON} copied={copied} setCopied={setCopied}
            nextService={nextService}
          />
        )}
        {tab === "roster" && (
          <RosterView
            t={t} lang={lang} serviceDates={serviceDates} assignments={assignments}
            dutyTypes={dutyTypes} people={people} isAdmin={isAdmin}
            setState={setState} state={state}
          />
        )}
        {tab === "myduties" && (
          <MyDutiesView
            t={t} lang={lang} serviceDates={serviceDates} assignments={assignments}
            dutyTypes={dutyTypes} people={people} currentUser={currentUser}
            setState={setState} state={state}
          />
        )}
        {tab === "admin" && isAdmin && (
          <AdminView
            t={t} lang={lang} state={state} setState={setState}
          />
        )}
      </main>
    </div>
  );
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────
function CalendarView({ t, lang, serviceDates, assignments, dutyTypes, people, isAdmin,
  selectedDate, setSelectedDate, setState, state, searchQ, setSearchQ,
  showSnippet, setShowSnippet, getSnippetJSON, copied, setCopied, nextService }) {

  const [filterMonth, setFilterMonth] = useState("all");

  const months = useMemo(() => {
    const ms = [...new Set(serviceDates.map(s => s.date.slice(0,7)))];
    return ms.sort();
  }, [serviceDates]);

  const filtered = serviceDates.filter(s => filterMonth === "all" || s.date.startsWith(filterMonth));

  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    const results = [];
    serviceDates.forEach(sd => {
      const sdAssign = assignments.filter(a => a.serviceDateId === sd.id);
      sdAssign.forEach(a => {
        const dt = dutyTypes.find(d => d.id === a.dutyId);
        const personMatch = a.personName.toLowerCase().includes(q);
        const dutyMatch = dt && (dt.nl.toLowerCase().includes(q) || dt.en.toLowerCase().includes(q));
        if (personMatch || dutyMatch) {
          results.push({ sd, a, dt });
        }
      });
    });
    return results.slice(0, 30);
  }, [searchQ, serviceDates, assignments, dutyTypes]);

  function handleCopy() {
    navigator.clipboard.writeText(getSnippetJSON()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <h1 style={{fontSize:"20px",fontWeight:"600",marginBottom:"4px"}}>{t.nav.calendar}</h1>
          {nextService && (
            <div style={{fontSize:"12px",color:"var(--text2)"}}>
              {lang==="nl"?"Volgende dienst":"Next service"}: <strong>{formatDate(nextService.date, lang)}</strong>
              {nextService.notes && <span style={{marginLeft:6,fontStyle:"italic"}}>— {nextService.notes}</span>}
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowSnippet(true)}>
            <Icon.Code /> {t.snippet}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{marginBottom:"16px"}} className="search-wrap">
        <Icon.Search />
        <input className="search-input" placeholder={t.search} value={searchQ}
          onChange={e => setSearchQ(e.target.value)} />
      </div>

      {/* Search results */}
      {searchQ.trim() && (
        <div className="card" style={{marginBottom:"20px"}}>
          <div className="card-header">
            <span className="card-title">{t.searchResults} ({searchResults.length})</span>
          </div>
          {searchResults.length === 0
            ? <div style={{padding:"16px",color:"var(--text3)",fontStyle:"italic"}}>{t.noResults}</div>
            : searchResults.map((r, i) => (
              <div key={i} className="search-result-row" style={{cursor:"pointer"}} onClick={() => { setSearchQ(""); setSelectedDate(r.sd); }}>
                <span style={{fontFamily:"var(--mono)",fontSize:"12px",color:"var(--text2)",minWidth:"80px"}}>{formatDateShort(r.sd.date, lang)}</span>
                <span className="person-chip">{r.a.personName}</span>
                <span style={{fontSize:"12px",color:"var(--text2)"}}>{r.dt ? r.dt[lang] : ""}</span>
                {r.sd.notes && <span style={{fontSize:"11px",color:"var(--text3)",marginLeft:"auto",fontStyle:"italic"}}>{r.sd.notes}</span>}
              </div>
            ))
          }
        </div>
      )}

      {/* Month filter */}
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
        <button className={`btn btn-sm ${filterMonth==="all"?"btn-primary":"btn-ghost"}`} onClick={() => setFilterMonth("all")}>
          {t.allDates}
        </button>
        {months.map(m => {
          const [y, mo] = m.split("-");
          const label = new Date(+y, +mo-1).toLocaleDateString(lang==="nl"?"nl-NL":"en-GB", {month:"short", year:"2-digit"});
          return (
            <button key={m} className={`btn btn-sm ${filterMonth===m?"btn-primary":"btn-ghost"}`} onClick={() => setFilterMonth(m)}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
        {[
          ["green", t.green + (lang==="nl"?" (★ verplicht)": " (★ mandatory)")],
          ["orange", t.orange],
          ["red", t.red],
        ].map(([c,l]) => (
          <div key={c} style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"11px",color:"var(--text2)"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:STATUS_COLORS[c]}} />
            {l}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"11px",color:"var(--text2)"}}>
          <div style={{width:"10px",height:"10px",borderRadius:"3px",background:"#fde68a"}} />
          {lang==="nl"?"Extra dienst":"Extra service"}
        </div>
      </div>

      {/* Grid */}
      <div className="calendar-grid">
        {filtered.map(sd => {
          const status = getFillStatus(sd.id, assignments, dutyTypes);
          const filled = assignments.filter(a => a.serviceDateId === sd.id).length;
          const d = new Date(sd.date);
          const dow = d.toLocaleDateString(lang==="nl"?"nl-NL":"en-GB", {weekday:"short"});
          const dm = d.toLocaleDateString(lang==="nl"?"nl-NL":"en-GB", {day:"numeric",month:"short"});
          return (
            <div key={sd.id} className="cal-cell" onClick={() => setSelectedDate(sd)}>
              <div className="cal-cell-header" style={{background:STATUS_COLORS[status]}} />
              <div className="cal-cell-body">
                {sd.extra && <div className="cal-extra-badge">{lang==="nl"?"Extra":"Extra"}</div>}
                <div className="cal-date">{dm}</div>
                <div className="cal-dow">{dow} · W{sd.week}</div>
                {sd.notes && <div className="cal-notes">{sd.notes}</div>}
                <div className="cal-fill">
                  <div className="cal-dot" style={{background:STATUS_COLORS[status]}} />
                  <span style={{fontSize:"11px",color:"var(--text3)"}}>{filled} {lang==="nl"?"taken":"duties"}</span>
                </div>
                {sd.locked && <div className="cal-lock"><Icon.Lock /> {t.locked}</div>}
                {sd.published && !sd.locked && <div style={{fontSize:"9px",color:"#15803d",display:"flex",alignItems:"center",gap:"2px",marginTop:"3px"}}>✓ {t.published}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Service date detail modal */}
      {selectedDate && (
        <ServiceDetailModal
          sd={selectedDate} t={t} lang={lang} dutyTypes={dutyTypes}
          assignments={assignments} people={people} isAdmin={isAdmin}
          onClose={() => setSelectedDate(null)} setState={setState} state={state}
        />
      )}

      {/* Snippet modal */}
      {showSnippet && (
        <div className="modal-backdrop" onClick={() => setShowSnippet(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{t.snippetTitle}</span>
              <button className="btn-icon" onClick={() => setShowSnippet(false)}><Icon.Close /></button>
            </div>
            <div className="modal-body">
              <p style={{fontSize:"12px",color:"var(--text2)",marginBottom:"12px"}}>
                {lang==="nl"
                  ? "Voeg dit JSON-fragment in op uw kerkwebsite om automatisch de volgende dienst te tonen."
                  : "Embed this JSON snippet on your church website to automatically show the next service."}
              </p>
              <div className="snippet-box">{getSnippetJSON()}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleCopy}>
                {copied ? <span style={{color:"#a8e6cf"}}>✓ {t.copied}</span> : <><Icon.Code /> {t.copySnippet}</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowSnippet(false)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SERVICE DETAIL MODAL ─────────────────────────────────────────────────────
function ServiceDetailModal({ sd, t, lang, dutyTypes, assignments, people, isAdmin, onClose, setState, state }) {
  const [editSlot, setEditSlot] = useState(null); // {dutyId, assignmentId or null}
  const [selectedPerson, setSelectedPerson] = useState("");

  const sdAssign = assignments.filter(a => a.serviceDateId === sd.id);

  function getAssignment(dutyId) {
    return sdAssign.find(a => a.dutyId === dutyId);
  }

  function handleSaveEdit() {
    if (!editSlot) return;
    setState(prev => {
      const newAssignments = prev.assignments.filter(a => !(a.serviceDateId === sd.id && a.dutyId === editSlot.dutyId));
      if (selectedPerson) {
        const person = prev.people.find(p => p.name === selectedPerson);
        newAssignments.push({
          id: `a_${Date.now()}`, serviceDateId: sd.id, dutyId: editSlot.dutyId,
          personId: person?.id || `ext_${selectedPerson}`, personName: selectedPerson,
        });
      }
      return { ...prev, assignments: newAssignments };
    });
    setEditSlot(null);
    setSelectedPerson("");
  }

  const grouped = useMemo(() => {
    return DUTY_GROUPS[lang].map((gName, gi) => ({
      name: gName,
      duties: dutyTypes.filter(d => d.group === gi),
    }));
  }, [dutyTypes, lang]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{maxWidth:"600px"}} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{formatDate(sd.date, lang)}</div>
            <div style={{display:"flex",gap:"6px",marginTop:"4px",flexWrap:"wrap"}}>
              {sd.notes && <span className="tag tag-blue">{sd.notes}</span>}
              {sd.published ? <span className="tag tag-green">{t.published}</span> : <span className="tag tag-gray">{t.unpublished}</span>}
              {sd.locked && <span className="tag tag-gray"><Icon.Lock /> {t.locked}</span>}
              <span className="tag tag-gray">W{sd.week}</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body" style={{paddingBottom:"8px"}}>
          {grouped.map(g => {
            const relevant = g.duties.filter(d => {
              const a = getAssignment(d.id);
              return a || isAdmin;
            });
            if (relevant.length === 0) return null;
            return (
              <div key={g.name} className="duty-group">
                <div className="duty-group-title">{g.name}</div>
                {relevant.map(d => {
                  const a = getAssignment(d.id);
                  return (
                    <div key={d.id} className="duty-row">
                      <span className="duty-name">
                        {d[lang]}
                        {d.mandatory && <span style={{marginLeft:"4px",color:"var(--accent)",fontSize:"10px"}} title={t.mandatory}>★</span>}
                      </span>
                      <span className={`duty-person ${!a ? "duty-empty" : ""}`}>
                        {a ? a.personName : (isAdmin ? <em style={{color:"var(--text3)"}}>{lang==="nl"?"— leeg —":"— empty —"}</em> : null)}
                      </span>
                      {isAdmin && !sd.locked && (
                        <button className="btn-icon btn-sm duty-edit-btn"
                          onClick={() => { setEditSlot({dutyId:d.id}); setSelectedPerson(a?.personName || ""); }}>
                          <Icon.Edit />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {isAdmin && (
          <div className="modal-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => setState(prev => ({
              ...prev,
              serviceDates: prev.serviceDates.map(s => s.id===sd.id ? {...s, published:!s.published} : s)
            }))}>
              {sd.published ? t.unpublished : t.publish}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setState(prev => ({
              ...prev,
              serviceDates: prev.serviceDates.map(s => s.id===sd.id ? {...s, locked:!s.locked} : s)
            }))}>
              {sd.locked ? t.unlock : t.lock}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>{t.close}</button>
          </div>
        )}
      </div>

      {/* Edit slot inline */}
      {editSlot && (
        <div className="modal-backdrop" style={{zIndex:300}} onClick={() => setEditSlot(null)}>
          <div className="modal" style={{maxWidth:"320px"}} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{t.editDuty}</span>
              <button className="btn-icon" onClick={() => setEditSlot(null)}><Icon.Close /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">{t.selectPerson}</label>
                <select className="form-select" value={selectedPerson} onChange={e => setSelectedPerson(e.target.value)}>
                  <option value="">— {lang==="nl"?"Leeg laten":"Leave empty"} —</option>
                  {UNIQUE_PEOPLE.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-sm" onClick={handleSaveEdit}>{t.saveChanges}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditSlot(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROSTER VIEW ─────────────────────────────────────────────────────────────
function RosterView({ t, lang, serviceDates, assignments, dutyTypes, people, isAdmin, setState, state }) {
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const months = useMemo(() => {
    const ms = [...new Set(serviceDates.map(s => s.date.slice(0,7)))];
    return ms.sort().slice(0,6);
  }, [serviceDates]);

  const filteredDates = serviceDates.filter(s =>
    filterMonth === "all" || s.date.startsWith(filterMonth)
  ).slice(0, 20);

  const filteredDuties = filterGroup === "all"
    ? dutyTypes
    : dutyTypes.filter(d => d.group === parseInt(filterGroup));

  return (
    <div>
      <h1 className="section-title">{t.nav.roster}</h1>

      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"12px"}}>
        <select className="form-select" style={{width:"auto"}} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="all">{t.allDates}</option>
          {months.map(m => {
            const [y,mo] = m.split("-");
            const label = new Date(+y,+mo-1).toLocaleDateString(lang==="nl"?"nl-NL":"en-GB",{month:"long",year:"numeric"});
            return <option key={m} value={m}>{label}</option>;
          })}
        </select>
        <select className="form-select" style={{width:"auto"}} value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
          <option value="all">{t.allGroups}</option>
          {DUTY_GROUPS[lang].map((g,i) => <option key={i} value={i}>{g}</option>)}
        </select>
      </div>

      <div style={{overflowX:"auto"}}>
        <table className="table" style={{minWidth:"600px"}}>
          <thead>
            <tr>
              <th style={{width:"160px"}}>{t.serviceDate}</th>
              <th style={{width:"100px",fontSize:"10px"}}>{lang==="nl"?"Notities":"Notes"}</th>
              {filteredDuties.slice(0,8).map(d => (
                <th key={d.id} style={{fontSize:"10px",minWidth:"90px"}}>{d[lang]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDates.map(sd => {
              const sdAssign = assignments.filter(a => a.serviceDateId === sd.id);
              const status = getFillStatus(sd.id, assignments, dutyTypes);
              return (
                <tr key={sd.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                      <div style={{width:"6px",height:"6px",borderRadius:"50%",background:STATUS_COLORS[status],flexShrink:0}} />
                      <span style={{fontFamily:"var(--mono)",fontSize:"12px"}}>{formatDateShort(sd.date, lang)}</span>
                      {sd.locked && <Icon.Lock />}
                    </div>
                  </td>
                  <td style={{fontSize:"11px",color:"var(--text2)",fontStyle:"italic"}}>{sd.notes||""}</td>
                  {filteredDuties.slice(0,8).map(d => {
                    const a = sdAssign.find(x => x.dutyId === d.id);
                    return (
                      <td key={d.id} style={{fontSize:"12px"}}>
                        {a ? <span className="person-chip" style={{fontSize:"11px"}}>{a.personName}</span>
                           : <span style={{color:"var(--text3)"}}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredDates.length === 0 && <div className="empty-state">{t.noResults}</div>}
    </div>
  );
}

// ─── MY DUTIES VIEW ───────────────────────────────────────────────────────────
function MyDutiesView({ t, lang, serviceDates, assignments, dutyTypes, people, currentUser, setState, state }) {
  const [selectedUser, setSelectedUser] = useState(currentUser.name);
  const [availability, setAvailability] = useState({});
  const today = new Date().toISOString().slice(0,10);

  const personAssignments = useMemo(() => {
    return assignments.filter(a => a.personName === selectedUser)
      .map(a => {
        const sd = serviceDates.find(s => s.id === a.serviceDateId);
        const dt = dutyTypes.find(d => d.id === a.dutyId);
        return { ...a, sd, dt };
      })
      .filter(a => a.sd && a.sd.date >= today)
      .sort((a,b) => a.sd.date.localeCompare(b.sd.date));
  }, [assignments, selectedUser, serviceDates, dutyTypes, today]);

  const upcomingDates = serviceDates.filter(s => s.date >= today).slice(0, 15);

  function setAvail(sdId, status) {
    setAvailability(prev => ({ ...prev, [sdId]: status }));
  }

  const avLabels = {
    av: t.available, un: t.unavailable, co: t.conditional, "": t.notSet,
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
        <h1 className="section-title" style={{marginBottom:0}}>{t.nav.myDuties}</h1>
        <select className="form-select" style={{width:"220px"}} value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {UNIQUE_PEOPLE.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="row" style={{gap:"20px"}}>
        {/* Upcoming duties */}
        <div className="col" style={{minWidth:"280px"}}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">{t.upcomingDuties}</span>
              <span className="tag tag-accent" style={{marginLeft:"auto"}}>{personAssignments.length}</span>
            </div>
            <div className="card-body" style={{padding:"12px 16px"}}>
              {personAssignments.length === 0
                ? <div className="empty-state" style={{padding:"24px 0"}}>{t.noDuties}</div>
                : personAssignments.map(a => (
                  <div key={a.id} className="my-duty-card" style={{marginBottom:"8px"}}>
                    <div className="my-duty-date">{formatDateShort(a.sd.date, lang)}</div>
                    <div className="my-duty-info">
                      <div className="my-duty-name">{a.dt ? a.dt[lang] : ""}</div>
                      {a.sd.notes && <div className="my-duty-duty">{a.sd.notes}</div>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                      {a.sd.locked
                        ? <span className="tag tag-gray btn-sm"><Icon.Lock /></span>
                        : <span className="tag tag-green" style={{fontSize:"10px"}}>{lang==="nl"?"Bevestigd":"Confirmed"}</span>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="col" style={{minWidth:"280px"}}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">{t.availability}</span>
            </div>
            <div className="card-body" style={{padding:"0 16px"}}>
              {upcomingDates.map(sd => {
                const av = availability[sd.id] || "";
                const isAssigned = assignments.some(a => a.serviceDateId === sd.id && a.personName === selectedUser);
                return (
                  <div key={sd.id} className="avail-row">
                    <div style={{display:"flex",alignItems:"center",gap:"8px",flex:1}}>
                      <span style={{fontFamily:"var(--mono)",fontSize:"12px",color:"var(--text2)",minWidth:"75px"}}>{formatDateShort(sd.date, lang)}</span>
                      <span style={{fontSize:"11px",color:"var(--text3)",flex:1}}>{sd.notes||""}</span>
                      {isAssigned && <span className="tag tag-accent" style={{fontSize:"9px"}}>★</span>}
                    </div>
                    <div style={{display:"flex",gap:"4px"}}>
                      {["av","un","co"].map(s => (
                        <button key={s} className={`avail-btn ${av===s?s:""}`} onClick={() => setAvail(sd.id, av===s?"":s)}>
                          {s==="av"?"✓":s==="un"?"✗":"~"}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView({ t, lang, state, setState }) {
  const [activeTab, setActiveTab] = useState("people");
  const [dutySearch, setDutySearch] = useState("");

  // ── shared edit modal state ──
  const [modal, setModal] = useState(null); // { type: 'person'|'date'|'duty', data: obj|null }
  const closeModal = () => setModal(null);

  const { serviceDates, people, dutyTypes, assignments } = state;

  // ── People ──
  function savePerson(draft) {
    setState(prev => {
      const exists = prev.people.find(p => p.id === draft.id);
      return {
        ...prev,
        people: exists
          ? prev.people.map(p => p.id === draft.id ? draft : p)
          : [...prev.people, { ...draft, id: `p_${Date.now()}`, active: true }],
      };
    });
    closeModal();
  }
  function deletePerson(id) {
    setState(prev => ({ ...prev, people: prev.people.filter(p => p.id !== id) }));
  }

  // ── Dates ──
  function saveDate(draft) {
    setState(prev => {
      const exists = prev.serviceDates.find(s => s.id === draft.id);
      const list = exists
        ? prev.serviceDates.map(s => s.id === draft.id ? draft : s)
        : [...prev.serviceDates, { ...draft, id: `sd_${Date.now()}`, published: false, locked: false, week: getWeekNumber(draft.date) }];
      return { ...prev, serviceDates: list.sort((a, b) => a.date.localeCompare(b.date)) };
    });
    closeModal();
  }
  function deleteDate(id) {
    setState(prev => ({
      ...prev,
      serviceDates: prev.serviceDates.filter(s => s.id !== id),
      assignments: prev.assignments.filter(a => a.serviceDateId !== id),
    }));
  }

  // ── Duties ──
  function saveDuty(draft) {
    setState(prev => {
      const exists = prev.dutyTypes.find(d => d.id === draft.id);
      return {
        ...prev,
        dutyTypes: exists
          ? prev.dutyTypes.map(d => d.id === draft.id ? draft : d)
          : [...prev.dutyTypes, { ...draft, id: `d_${Date.now()}` }],
      };
    });
    closeModal();
  }
  function deleteDuty(id) {
    setState(prev => ({
      ...prev,
      dutyTypes: prev.dutyTypes.filter(d => d.id !== id),
      assignments: prev.assignments.filter(a => a.dutyId !== id),
    }));
  }

  const filteredDuties = dutyTypes.filter(d =>
    !dutySearch || d.nl.toLowerCase().includes(dutySearch.toLowerCase()) || d.en.toLowerCase().includes(dutySearch.toLowerCase())
  );

  const mandatoryCount = dutyTypes.filter(d => d.mandatory).length;

  return (
    <div>
      <h1 className="section-title">{t.nav.admin}</h1>
      <div className="tabs">
        {[["people", t.peopleTab], ["dates", t.datesTab], ["duties", t.dutiesTab]].map(([id, label]) => (
          <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PEOPLE TAB ── */}
      {activeTab === "people" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <button className="btn btn-primary" onClick={() => setModal({ type: "person", data: null })}>
              <Icon.Plus /> {t.addPerson}
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead><tr>
                <th>{t.name}</th><th>{t.email}</th><th>{t.role}</th><th>{t.weekPref}</th><th>{t.actions}</th>
              </tr></thead>
              <tbody>
                {people.map(p => (
                  <tr key={p.id}>
                    <td><span className="person-chip">{p.name}</span></td>
                    <td style={{ fontSize: "12px", color: "var(--text2)" }}>{p.email || "—"}</td>
                    <td><span className={`tag ${p.role === "admin" ? "tag-accent" : "tag-gray"}`}>{t.roles[p.role] || p.role}</span></td>
                    <td style={{ fontSize: "12px", color: "var(--text2)" }}>
                      {p.weekPref === "even" ? t.evenWeeks : p.weekPref === "odd" ? t.oddWeeks : t.bothWeeks}
                    </td>
                    <td style={{ display: "flex", gap: "4px" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "person", data: { ...p } })}>
                        <Icon.Edit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deletePerson(p.id)}>
                        <Icon.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DATES TAB ── */}
      {activeTab === "dates" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <button className="btn btn-primary" onClick={() => setModal({ type: "date", data: null })}>
              <Icon.Plus /> {t.addDate}
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead><tr>
                <th>{t.serviceDate}</th><th>{t.notes}</th><th>W</th>
                <th>{t.extraService}</th><th>{t.published}</th><th>{t.locked}</th><th>{t.actions}</th>
              </tr></thead>
              <tbody>
                {serviceDates.map(sd => (
                  <tr key={sd.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>{formatDate(sd.date, lang)}</td>
                    <td style={{ fontSize: "12px", color: "var(--text2)", fontStyle: "italic" }}>{sd.notes || "—"}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>{sd.week}</td>
                    <td>{sd.extra ? <span className="tag tag-orange" style={{background:"#fef3c7",color:"#92400e"}}>★</span> : <span style={{color:"var(--text3)"}}>—</span>}</td>
                    <td>
                      <button className={`btn btn-sm ${sd.published ? "btn-secondary" : "btn-ghost"}`}
                        onClick={() => setState(prev => ({ ...prev, serviceDates: prev.serviceDates.map(s => s.id === sd.id ? { ...s, published: !s.published } : s) }))}>
                        {sd.published ? "✓" : "○"}
                      </button>
                    </td>
                    <td>
                      <button className={`btn btn-sm ${sd.locked ? "btn-secondary" : "btn-ghost"}`}
                        onClick={() => setState(prev => ({ ...prev, serviceDates: prev.serviceDates.map(s => s.id === sd.id ? { ...s, locked: !s.locked } : s) }))}>
                        {sd.locked ? <Icon.Lock /> : "○"}
                      </button>
                    </td>
                    <td style={{ display: "flex", gap: "4px" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "date", data: { ...sd } })}>
                        <Icon.Edit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteDate(sd.id)}>
                        <Icon.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DUTIES TAB ── */}
      {activeTab === "duties" && (
        <div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <Icon.Search />
              <input className="search-input" placeholder={t.search} value={dutySearch} onChange={e => setDutySearch(e.target.value)} />
            </div>
            <div style={{ fontSize: "12px", color: "var(--text2)", whiteSpace: "nowrap" }}>
              {mandatoryCount} {lang === "nl" ? "verplicht" : "mandatory"}
            </div>
            <button className="btn btn-primary" onClick={() => setModal({ type: "duty", data: null })}>
              <Icon.Plus /> {t.addDuty}
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px", fontStyle: "italic" }}>{t.mandatoryHint}</p>
          <div className="card">
            <table className="table">
              <thead><tr>
                <th>{t.nameNl}</th>
                <th>{t.nameEn}</th>
                <th>{t.group}</th>
                <th style={{ textAlign: "center" }}>{t.mandatory}</th>
                <th>{t.actions}</th>
              </tr></thead>
              <tbody>
                {filteredDuties.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.nl}</td>
                    <td style={{ color: "var(--text2)" }}>{d.en}</td>
                    <td><span className="tag tag-gray">{DUTY_GROUPS[lang][d.group]}</span></td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className={`btn btn-sm ${d.mandatory ? "btn-primary" : "btn-ghost"}`}
                        style={{ padding: "3px 10px", fontSize: "11px" }}
                        title={t.mandatoryHint}
                        onClick={() => saveDuty({ ...d, mandatory: !d.mandatory })}
                      >
                        {d.mandatory ? "★ " + (lang === "nl" ? "Ja" : "Yes") : "☆ " + (lang === "nl" ? "Nee" : "No")}
                      </button>
                    </td>
                    <td style={{ display: "flex", gap: "4px" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "duty", data: { ...d } })}>
                        <Icon.Edit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteDuty(d.id)}>
                        <Icon.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal?.type === "person" && (
        <PersonModal t={t} lang={lang} person={modal.data} onSave={savePerson} onClose={closeModal} />
      )}
      {modal?.type === "date" && (
        <DateModal t={t} lang={lang} sd={modal.data} onSave={saveDate} onClose={closeModal} />
      )}
      {modal?.type === "duty" && (
        <DutyModal t={t} lang={lang} duty={modal.data} onSave={saveDuty} onClose={closeModal} />
      )}
    </div>
  );
}

// ─── PERSON MODAL ─────────────────────────────────────────────────────────────
function PersonModal({ t, lang, person, onSave, onClose }) {
  const isNew = !person;
  const [draft, setDraft] = useState(person || { name: "", email: "", role: "user", weekPref: "both" });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isNew ? t.addPerson : t.editPerson}</span>
          <button className="btn-icon" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t.name}</label>
            <input className="form-input" value={draft.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.email}</label>
            <input className="form-input" type="email" value={draft.email || ""} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.role}</label>
            <select className="form-select" value={draft.role} onChange={e => set("role", e.target.value)}>
              <option value="user">{t.roles.user}</option>
              <option value="admin">{t.roles.admin}</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.weekPref}</label>
            <select className="form-select" value={draft.weekPref || "both"} onChange={e => set("weekPref", e.target.value)}>
              <option value="both">{t.bothWeeks}</option>
              <option value="even">{t.evenWeeks}</option>
              <option value="odd">{t.oddWeeks}</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => draft.name.trim() && onSave(draft)}>{t.saveChanges}</button>
          <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DATE MODAL ───────────────────────────────────────────────────────────────
function DateModal({ t, lang, sd, onSave, onClose }) {
  const isNew = !sd;
  const [draft, setDraft] = useState(sd || { date: "", notes: "", extra: false });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isNew ? t.addDate : t.editDate}</span>
          <button className="btn-icon" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t.serviceDate}</label>
            <input className="form-input" type="date" value={draft.date} onChange={e => set("date", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.notes}</label>
            <input className="form-input" value={draft.notes || ""} onChange={e => set("notes", e.target.value)}
              placeholder={lang === "nl" ? "Bijv. Goede Vrijdag, Praise & Prayer…" : "e.g. Good Friday, Praise & Prayer…"} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={!!draft.extra} onChange={e => set("extra", e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }} />
              {t.extraService}
            </label>
          </div>
          {!isNew && (
            <div style={{ fontSize: "12px", color: "var(--text3)", marginTop: "4px" }}>
              {lang === "nl" ? "Week" : "Week"} {getWeekNumber(draft.date) || "—"}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => draft.date && onSave(draft)}>{t.saveChanges}</button>
          <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DUTY MODAL ───────────────────────────────────────────────────────────────
function DutyModal({ t, lang, duty, onSave, onClose }) {
  const isNew = !duty;
  const [draft, setDraft] = useState(duty || { nl: "", en: "", group: 0, slots: 1, mandatory: false });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isNew ? t.addDuty : t.editDutyAdmin}</span>
          <button className="btn-icon" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t.nameNl}</label>
            <input className="form-input" value={draft.nl} onChange={e => set("nl", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.nameEn}</label>
            <input className="form-input" value={draft.en} onChange={e => set("en", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.group}</label>
            <select className="form-select" value={draft.group} onChange={e => set("group", parseInt(e.target.value))}>
              {DUTY_GROUPS[lang].map((g, i) => <option key={i} value={i}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={!!draft.mandatory} onChange={e => set("mandatory", e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }} />
              <span>
                {t.mandatory}
                <span style={{ display: "block", fontSize: "11px", fontWeight: 400, color: "var(--text3)", textTransform: "none", letterSpacing: 0 }}>
                  {t.mandatoryHint}
                </span>
              </span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => (draft.nl.trim() || draft.en.trim()) && onSave(draft)}>{t.saveChanges}</button>
          <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}


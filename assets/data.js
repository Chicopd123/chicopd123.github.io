/* ============================================================
   CHICO PD - MACRO + VIOLATION DATA
   To change a macro: edit its text here and save.
   The Macros page updates itself.
   ============================================================ */
window.CHICO = {};

CHICO.roleplay = [
  "/me HELLO MY NAME IS (YOUR NAME HERE), I'M A CHICO L.A POLICE OFFICER. BADGE NUMBER-####",
  "/do TASER! TASER! TASER! BREAKS WINDOW AND TASER CIVILIAN THEN PULLS THEM OUT OF VEHICLE.",
  "/do TASER! TASER! TASER!",
  "/do CONFIRMS BODY CAM IS ON",
  "/me THIS IS THE CHICO L.A.P..D. PULL OVER YOUR VEHICLE AND TURN OFF YOUR ENGINE. TURN ON YOUR HAZARDS AND KEEP YOUR HANDS ON YOUR STEERING WHEEL.",
  "/me YOU HAVE THE RIGHT TO REMAIN SILENT. ANYTHING YOU SAY CAN AND WILL BE USED AGAINST YOU IN A COURT OF LAW. YOU HAVE THE RIGHT TO AN ATTORNEY. IF YOU CANNOT AFFORD AN ATTORNEY, ONE WILL BE PROVIDED FOR YOU. DO YOU UNDERSTAND YOUR RIGHTS?",
  "/do PATS DOWN SUSPECT WITH BACK OF HAND AND REMOVES ALL ITEMS AND WEAPONS FROM PERSON! DOUBLE LOCK CUFFS!",
  "/me YOU HAVE A WARRANT FOR YOUR ARREST. PLEASE COMPLY TO AVOID THE USE OF NON-LETHAL FORCES.",
  "/do SHOOTS TO DEFEND POLICE OFFICERS/CIVILIANS AGAINST CRIMINALS",
  "/me PLEASE LEAVE GZI! THIS IS NOT A CHILL ZONE! CHECK DISCORD FOR THE UPDATED MAP.",
  "/me I'M UNBADGED & UNABLE TO ASSIST YOU AT THE MOMENT. GO TO THE LOBBY AND SOMEONE WILL BE THERE TO ASSIST SHORTLY. THANK YOU HAVE A GREAT DAY!",
  "/do BOOKING AND PROCESSING!",
  "/do FINGERPRINTING!",
  "/do MUG SHOT!",
  "/do GIVES INMATE BLANKET AND JUMPSUIT!"
];

/* [macro text, when to use it] */
CHICO.radio = [
  ["/flobby (10-4) COPY.", "Acknowledged, message received."],
  ["/flobby (10-6) CURRENTLY BUSY.", "You are busy and unavailable."],
  ["/flobby (10-7) OUT OF SERVICE", "Logging off duty / not available."],
  ["/flobby (10-8) IN SERVICE", "You are on duty and available."],
  ["/flobby (10-9) REPEAT THAT PLEASE", "Did not hear or need message repeated."],
  ["/flobby (10-10) FIGHT IN PROGRESS", "A physical fight is happening."],
  ["/flobby (10-11) TRAFFIC STOP", "You have initiated a traffic stop."],
  ["/flobby (10-12) ACTIVE RIDE ALONG", "You are currently on a ride along."],
  ["/flobby (10-13) SHOTS FIRED", "Gunshots have been fired."],
  ["/flobby (10-15) SUSPECT IN CUSTODY EN ROUTE TO PD", "You have a suspect and are taking them to the station."],
  ["/flobby (10-20) LOCATION", "Requesting or sharing location."],
  ["/flobby (10-22) DISREGARD", "Cancel the previous message."],
  ["/flobby (10-23) ARRIVED ON SCENE", "You have reached the location."],
  ["/flobby (10-26) SUSPECT DETAINED", "A suspect is detained (not yet in custody)."],
  ["/flobby (10-27) I.D. CHECK", "Running identification on a person."],
  ["/flobby (10-29) WARRANT CHECK", "Running a warrant check."],
  ["/flobby (10-30) WANTED", "Person is wanted / has an active warrant."],
  ["/flobby (10-32) BACKUP NEEDED", "Requesting additional units."],
  ["/flobby (10-37) REQUESTING SUPERVISOR", "Requesting a supervisor to respond."],
  ["/flobby (10-41) REQUESTING INMATE TRANSPORTATION", "Requesting transport for a prisoner."],
  ["/flobby (10-47) SHOOTOUT IN PROGRESS", "Active gunfight with suspects."],
  ["/flobby (10-57) HIT AND RUN", "A vehicle has fled the scene after a collision."],
  ["/flobby (10-60) ARMED SUSPECTS", "Suspects are armed with weapons."],
  ["/flobby (10-63) REQUESTING FEMALE OFFICER", "Requesting a female officer to respond."],
  ["/flobby (10-63) REQUESTING MALE OFFICER", "Requesting a male officer to respond."],
  ["/flobby (10-71) TRAINING (MACROS, CODES, RP, ETC.)", "Used during training or practice sessions."],
  ["/flobby (10-80) IN PURSUIT", "You are actively pursuing a suspect."],
  ["/flobby (10-85) TRAFFIC LIGHT DOWN", "A traffic light is not working."],
  ["/flobby (10-97) EN ROUTE", "You are on the way to a location."],
  ["/flobby (10-97) EN ROUTE CODE-2 (SILENT PURSUIT)", "Responding without lights and sirens."],
  ["/flobby (10-97) EN ROUTE CODE-3 (LIGHTS AND SIRENS)", "Responding with lights and sirens."],
  ["/flobby (10-98) AT THE STATION", "You are currently at PD station."],
  ["/flobby (10-99) NEEDING IMMEDIATE ASSISTANCE", "Urgent help required."],
  ["/flobby (10-100) OFFICER DOWN", "An officer has been injured or is down."],
  ["/flobby (10-101) BEING FOLLOWED", "You are being followed (suspicious vehicle/person)."],
  ["/flobby CODE-0 SUSPECT LOGGED OUT", "The suspect has disconnected from the server."],
  ["/flobby CODE-2 NO LIGHTS OR SIRENS", "Using code 2 (normal driving)."],
  ["/flobby CODE-3 LIGHTS AND SIRENS", "Using code 3 (emergency response)."],
  ["/flobby CODE-4 SCENE CLEARED", "The situation is under control and units can return to patrol."]
];

/* code, name, meaning, examples, optional restriction */
CHICO.violations = [
  {
    id: "felonies", tone: "red", minutes: 20,
    title: "Felonies / Criminal Violations",
    blurb: "Serious crimes that pose a high risk to public safety, government operations or human life.",
    poster: "felonies",
    items: [
      ["1.1", "SEIZURE OF STATE FACILITIES", "When someone takes over, occupies or forcibly controls a state facility.", "E.g. police station, military base, medic HQ, government buildings."],
      ["1.2", "FORCIBLE OVERTHROW OF STATE GOVERNMENT", "When someone attempts, through force or violence, to overthrow or take control of the state government.", "State government includes: Police, Medics or Army."],
      ["1.3", "KIDNAPPING AND HOSTAGE-TAKING", "When someone abducts, forcibly holds, transports or confines another person against their will, including holding them as a hostage.", "Taking a player and holding them to demand something."],
      ["1.4", "FATAL VEHICLE-PEDESTRIAN COLLISION", "When a driver hits a pedestrian and the collision results in the person's death.", "Any vehicle causing a pedestrian death."],
      ["1.5", "THEFT OR ATTEMPTED THEFT OF PRIVATE PROPERTY", "When someone steals, takes or attempts to take another person's private property without permission.", "Stealing or attempted stealing of any civilian property."],
      ["1.6", "ROBBERY OF A PUBLIC SERVANT ON DUTY", "When someone uses or threatens force to rob an on-duty police officer, medic, soldier or other public servant.", "Taking property from a government employee using force or threats."],
      ["1.7", "TRESPASSING ON A RESTRICTED AREA", "When someone knowingly enters or remains in an officially restricted area without authorization.", "E.g. military base, red zone, airport, government facility, secure zones."],
      ["1.8", "VEHICLE-PEDESTRIAN COLLISION (NON-FATAL)", "When a driver hits a pedestrian but the person survives.", "Pedestrian injured but not killed."],
      ["1.9", "SHOOTING IN PUBLIC", "When someone intentionally fires a firearm in a public area without a legitimate reason.", "Shooting in streets, city, safe zones or crowded areas."],
      ["1.10", "BRIBERY OR ATTEMPTED BRIBERY OF A PUBLIC SERVANT", "When someone offers, gives or attempts to give money, property or another benefit to influence an on-duty public servant.", "Offering money or items to avoid an arrest, charge or to gain an advantage."],
      ["1.11", "MURDER", "When someone intentionally and unlawfully kills another person.", "Intentional killing of any player. Description of the situation is required.", "Only in Redzone"],
      ["1.12", "ASSAULT ON A PUBLIC SERVANT ON DUTY", "When someone intentionally attacks or uses unlawful physical force against an on-duty public servant.", "Attacking or seriously injuring a police officer, medic or soldier. Description of the situation is required.", "Only in Redzone"]
    ]
  },
  {
    id: "infractions", tone: "blue", minutes: 10,
    title: "Infractions / Civil Violations",
    blurb: "Civil offences that disrupt public order or cause property damage.",
    poster: "infractions",
    items: [
      ["2.1", "DAMAGE TO GOVERNMENT PROPERTY", "When someone intentionally damages government property belonging to the state or any official faction.", "E.g. police vehicles, medic vehicles, army vehicles, government buildings, barriers, equipment."],
      ["2.2", "DAMAGE TO PRIVATE PROPERTY", "When someone intentionally damages property belonging to another civilian or private organisation.", "E.g. civilian vehicles, houses, shops, business property, personal items."],
      ["2.3", "MAKING A FALSE EMERGENCY CALL", "When someone knowingly reports a fake emergency or deliberately calls emergency services for a non-existent incident.", "Fake 10-41, fake shootout, fake medical emergency, or any false report to dispatch."],
      ["2.4", "DISORDERLY CONDUCT", "When someone causes a serious public disturbance through disruptive, threatening or disorderly behaviour.", "E.g. fighting, blocking roads, excessive noise, provoking large groups, causing chaos in public areas."],
      ["2.5", "MURDER THREATS", "When someone seriously threatens to kill another person.", "E.g. verbal or written threats to kill a player, officer, medic or civilian."],
      ["2.6", "INSULTING A PUBLIC SERVANT ON DUTY", "When someone directs prohibited insults, offensive language or verbal abuse at an on-duty public servant.", "E.g. insulting, degrading or continuously abusing a police officer, medic or soldier while they are on duty."],
      ["2.7", "EXTORTION", "When someone uses threats, intimidation or coercion to force another person to give money, property, information or another benefit.", "E.g. threatening someone to pay money, give items or provide information under threat of harm."]
    ]
  },
  {
    id: "misdemeanors", tone: "green", minutes: 5,
    title: "Misdemeanors / Administrative Violations",
    blurb: "Minor offences that interfere with law enforcement operations or public safety.",
    poster: "misdemeanors",
    items: [
      ["3.1", "RESISTING ARREST", "When someone actively attempts to prevent officers from carrying out an arrest, such as fighting, pulling away or escaping.", "Struggling, running, fighting, or refusing to comply while being arrested."],
      ["3.2", "DISOBEYING A LAWFUL ORDER", "When someone knowingly refuses a valid and lawful instruction from an authorized officer.", "Ignoring verbal commands, refusing to stop, leave an area, or follow instructions."],
      ["3.3", "AIDING IN RESISTING ARREST", "When someone intentionally helps another person resist or escape an arrest.", "Blocking officers, pulling the suspect away, providing a vehicle to escape, or distracting officers."],
      ["3.4", "VIOLATION OF TRAFFIC LAWS", "When someone breaks applicable traffic rules.", "Speeding, running a red light, reckless driving, dangerous manoeuvres, illegal parking, or ignoring traffic signs."],
      ["3.5", "ASSAULT ON A CIVILIAN", "When someone intentionally attacks or uses unlawful physical force against another civilian.", "Hitting, punching, kicking or using a weapon against a civilian without justification."],
      ["3.6", "REFUSAL TO PROVIDE DOCUMENTS", "When someone refuses to provide required identification or documents when an officer has the authority to request them.", "Refusing to show ID, driver's license, vehicle documents, or other required papers when legally requested."]
    ]
  }
];

CHICO.violationMacro = function (group, item) {
  return "/me ISSUE " + item[0] + " " + item[1] + " [+" + group.minutes + "MIN]";
};

/* Chain of command. Highest rank first.
   To add someone, put their name in the "people" list for their rank.
   "about" is the short description of what the rank does.
   many: true means the rank has too many officers to list by name. */
CHICO.command = [
  { tier: "Command staff", tone: "gold", ranks: [
    { rank: "Chief Federal General", short: "CFG", insignia: "stars5", people: ["Megan Geeta"],
      about: "Above everyone in Chico PD. Handles promotions and firing, decides who joins the PD and sets the rules." },
    { rank: "Deputy Federal General", short: "DFG", insignia: "stars4", people: ["Lex Dagreat", "Tank Brazy"],
      about: "Second in charge, with almost the same powers as the Chief. Can promote, fire and approve vacations (time off) for officers." }
  ] },
  { tier: "General officers", tone: "purple", ranks: [
    { rank: "Colonel General", short: "CG", insignia: "stars3", people: ["Dan Beans", "Rachael Adlyn"],
      about: "Can put officers into uniform and appoint leaders. Oversees the generals below and deals with serious complaints." },
    { rank: "Lieutenant General", short: "LG", insignia: "stars2", people: ["Kryptic Khaos", "Big Papabear", "Diggy Rogers"],
      about: "Keeps the department running day to day: training standards, events and how officers behave on duty." },
    { rank: "Major General", short: "MG", insignia: "stars1", people: ["Kyler Random", "Smooth", "John Gibbs", "Sarah Warwick", "Miss Smith", "Billy Jackson", "Bronx Baby", "Lonno Rampa", "Kevin Alcala", "Mrs Dagreat", "Dr Satan", "Leah Gibbs", "Shellz Hunter", "Thomas Miller", "Jayden Lucious", "Bones Brazy", "Monster Bud"],
      about: "Supports the senior generals. Supervises shifts and the officers below, and helps train and check newer officers." }
  ] },
  { tier: "Field officers", tone: "blue", ranks: [
    { rank: "Colonel", short: "COL", insignia: "eagle", many: true,
      about: "Commands the officers on duty, organises patrols and makes sure the PD rules are followed." },
    { rank: "Major", short: "MAJ", insignia: "leaf", many: true,
      about: "Backs up the Colonel, supervises officers on shift and checks arrests and reports." }
  ] },
  { tier: "Company officers", tone: "cyan", ranks: [
    { rank: "Captain", short: "CPT", insignia: "bars2", many: true,
      about: "Leads a shift or team, takes control of scenes and reports up to the Major." },
    { rank: "Lieutenant", short: "LT", insignia: "bars1", many: true,
      about: "The first leadership rank. Runs scenes, guides newer officers and passes problems up the chain." }
  ] },
  { tier: "Non-commissioned officers", tone: "green", ranks: [
    { rank: "Sergeant Major", short: "SGM", insignia: "chev3r2", many: true,
      about: "The most senior sergeant. Looks after the sergeants and keeps standards high across the lower ranks." },
    { rank: "First Sergeant", short: "1SG", insignia: "chev3r1", many: true,
      about: "Helps the Sergeant Major, keeps the sergeants organised and checks on officers' conduct." },
    { rank: "Sergeant", short: "SGT", insignia: "chev3", many: true,
      about: "Rides with recruits on patrol, helps on traffic stops and pursuits, and corrects mistakes on the spot." }
  ] },
  { tier: "Recruits", tone: "silver", ranks: [
    { rank: "Recruit", short: "RCT", insignia: "chev1", many: true,
      about: "A newly badged officer. Patrols, follows orders from the ranks above and keeps learning from the sergeants." },
    { rank: "Cadet / Trainee", short: "CDT", insignia: "none", many: true,
      about: "Unbadged and in training. Learning the rules and macros, working up to 50,000 XP and passing RP1 and RP2." }
  ] }
];

// Eén gedeelde bron voor de categorie/subcategorie-boom, gebruikt bij zowel
// uploaden, bewerken als zoeken/browsen. Voorheen hield elke pagina zijn eigen
// kopie bij; die liepen volledig uit elkaar, waardoor subcategorieën die je bij
// het uploaden koos in Zoeken niet bestonden (en andersom) en advertenties dus
// nooit via categorie-browsen terug te vinden waren.
export const CATEGORY_HIERARCHY: Record<string, { icon: string; sub: string[] }> = {
  "Meisjeskleding": { icon: "👧", sub: [
    "Jurken & Rokken", "Jassen & Vesten", "Truien & Sweaters", "T-shirts & Tops",
    "Broeken & Leggings", "Zwemkleding & Badpakken", "Pyjama & Ondergoed",
    "Schoenen & Laarzen", "Sokken & Kousen", "Feest & Galakleding",
    "Sportkleding", "Mutsen & Sjaals",
  ]},
  "Jongenskleding": { icon: "👦", sub: [
    "Jassen & Vesten", "Truien & Sweaters", "T-shirts & Poloshirts",
    "Overhemden", "Broeken & Shorts", "Joggingbroeken & Trainingskleding",
    "Zwemkleding", "Pyjama & Ondergoed", "Schoenen & Laarzen",
    "Sokken", "Sportkleding", "Feestkleding",
  ]},
  "Speelgoed": { icon: "🧸", sub: [
    "Houten Speelgoed", "Educatief Speelgoed", "Knuffels & Poppen",
    "Buitenspeelgoed", "Puzzels & Gezelschapsspellen", "Constructie & Lego",
    "Rollenspel & Verkleedkleding", "Muziek & Creativiteit",
    "Baby & Peuter Speelgoed", "Voertuigen & RC-speelgoed",
    "Treinen & Banen", "Waterspeelgoed",
  ]},
  "Kinderwagens, buggy's & autostoeltjes": { icon: "🛒", sub: [
    "Combinatiewagens", "Buggy's & Wandelwagens", "Tweelingwagens",
    "Autostoeltjes Groep 0-0+", "Autostoeltjes Groep 1-2-3",
    "Maxi-Cosi Accessoires", "Draagdoeken & Draagzakken",
    "Fietsstoeltjes & Fietskarren", "Reisbassins & Reiswiegjes",
    "Regenhoes & Muggennet",
  ]},
  "Meubilair & decoratie": { icon: "🛏️", sub: [
    "Bedjes & Wiegjes", "Matrassen", "Kasten & Commodes",
    "Kinderstoelen & Hoge Stoelen", "Bureaus & Kindertafels",
    "Decoratie & Wanddecoratie", "Verlichting",
    "Opbergers & Dozen", "Babykamerset", "Boxen & Boxkleden",
  ]},
  "Badderen & verschonen": { icon: "🛁", sub: [
    "Babybadjes", "Verschoontafels & -matten", "Luiers & Doekjes",
    "Babyverzorging", "Badcapes & Washandjes", "Luierzakken & Etuis",
  ]},
  "Veiligheid in en om het huis": { icon: "🔒", sub: [
    "Babyhekjes & Afzettingen", "Stopcontact- & Meubelbeveiliging",
    "Babyfoons & Slaapmonitors", "Gordijnen & Raamdecoratie",
    "Helmen & Bescherming", "Anti-valmatten",
  ]},
  "Gezondheid & zwangerschap": { icon: "🤰", sub: [
    "Zwangerschapskleding", "Zwangerschapskussens",
    "Borstvoeding Accessoires", "Kolfapparaten & Flesjes",
    "Thermometers & Monitoren", "Vitaminen & Supplementen",
  ]},
  "Voeden": { icon: "🍼", sub: [
    "Zuigflessen & Tepels", "Borstkolven", "Eetservies & Slabbetjes",
    "Kinderstoelen (eten)", "Potjes & Knijpzakjes",
    "Sterilisatoren & Warmers", "Diepvriesbewaarzakjes",
  ]},
  "Slapen & beddengoed": { icon: "😴", sub: [
    "Slaapzakken", "Wiegjes & Reiswiegjes", "Kussens & Dekbedden",
    "Hoeslakens & Beddengoed", "Nachtlampjes & Schemerlicht",
    "Speendoekjes & Troostobjecten",
  ]},
  "Schoolbenodigdheden": { icon: "🎒", sub: [
    "Schooltassen & Rugzakken", "Pennenetuis & Schrijfgerei",
    "Lunchboxen & Drinkflessen", "Gymtassen & Sportspullen",
    "Leesboeken & Lesmateriaal", "Knutsel- & Tekenmateriaal",
  ]},
  "Overige kinderartikelen": { icon: "📦", sub: [
    "Speelmatten & Activiteitencentra", "Wipstoelen & Schommels",
    "Looprekjes & Loopwagens", "Zwemspeelgoed & Waterspelen",
    "Baby Monitors & Tech", "Cadeaus & Feestartikelen",
    "Boeken & Films",
  ]},
};

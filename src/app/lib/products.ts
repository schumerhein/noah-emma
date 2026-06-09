
export type Product = {
  id: string;
  title: string;
  brand: string;
  location: string;
  price: number;
  size: string;
  condition: string;
  images: string[];
  likes: number;
  verified: boolean;
  isAd?: boolean;
  uploadDate: string;
  color: string;
  material: string;
  description: string;
  category: string;
};

export const ALL_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Biologisch Katoenen Trui",
    brand: "Mini-Rodini",
    location: "Amsterdam",
    price: 14.50,
    size: "92/98",
    condition: "Goede staat",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCzAb08zkPOfGg6Vdd4UTZG0xwR6Fa9l1LQnyA07wRXMVSxJR-O0jjFawVn4OhMUtR_qNeWb4MbsFbyM4RaWj6qmWLdB0ZMUcKKlCigcHBVACLgXvaSML4u0Es6zeNnOllwNL96fCYU3gcT4IRPnsxAbMVMMc_ihmvDWIiJNki_kdyjJ5JJKNrvV9Vk9KVeC9HgSp8sT4yYmKJGTz3yY4H0AEu_CfKRrEJDzLmtk2VNJh0nn_2Mr3rKh2_F5DeG8NcK3aim5W6oQDs"],
    likes: 14,
    verified: true,
    uploadDate: "2024-02-20",
    color: "Beige",
    material: "Biologisch Katoen",
    description: "Heerlijk zachte trui van biologisch katoen. In zeer goede staat, nauwelijks gedragen.",
    category: "Jongens Truien & Vesten"
  },
  {
    id: "p2",
    title: "Stoer Spijkerjack",
    brand: "ZARA Kids",
    location: "Utrecht",
    price: 22.00,
    size: "110",
    condition: "Nieuw",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAfSoLiWLNF-xPUNCl0S0NNJZv7x1q9mUzbVYh4vcRBwYUvu8rctqz1MVvdi5PwTQb2a-vOELnV3Rhp8xNQjHc0QVi0S7DunnZx9gMLGE21XaXOFK0ejRreAl3v71gIoJJQLdu-Yn5sIoDYXkhZoT5sbHbGyhi9a_drp1c3xLPIvnaYy9J12Ux9Y9miz-pfYDzTb4P8Ohn7rEAiALkjg9rdFrTtoj539FqJkRwK_dsQN42SmQwah439g--7X5oiv5s4tLhomVJoBSo"],
    likes: 32,
    verified: true,
    uploadDate: "2024-02-18",
    color: "Denim Blauw",
    material: "Katoen",
    description: "Prachtig spijkerjack, ideaal voor het voorjaar. Nooit gedragen, kaartje zit er nog aan.",
    category: "Jongens Jassen"
  },
  {
    id: "p3",
    title: "Handgemaakte Wollen Muts",
    brand: "Lokaal",
    location: "Rotterdam",
    price: 8.00,
    size: "One size",
    condition: "Zgan",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAGuOYW95spqL3V3Ujttst1XkA_upFw3zck-JZrxjYOBEj50mpupb6DGJFctEqDxnY3MYQ_xfKNJFCLU-bKlaSMF9hgO9nguE0frg-PZMFT867kXmlykwSY3jBIQMD99iaqTkUvMA25Xuh7nCPVpLClOnvWoN-XriWhZY0ZSsCwk4UKOhjJKGt-qbgY6IexFyPRsnBOHm0CYs5AS2z6K7tLkjv2JMVXGMCZtcccLXcy9ufPRXTj7zBnpz39xAcnekqQ84OvTQB-o6Q"],
    likes: 8,
    verified: false,
    uploadDate: "2024-02-22",
    color: "Multi",
    material: "Wol",
    description: "Unieke, handgemaakte muts. Lekker warm en kriebelt niet.",
    category: "Meisjes Accessoires"
  },
  {
    id: "p4",
    title: "Gele Regenlaarsjes",
    brand: "Bergstein",
    location: "Eindhoven",
    price: 12.50,
    size: "24",
    condition: "Goed",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA95GySa12qteHgMIWAq2D4F_qAcvB2D_5aSvKhrY4Ho_IsBWJ6obnaUchhPTI287XQkkYGAy2wNRc8UQ4kxRvhGyrZ2zDfijy3C52y5HR4t2DHFOPR5o7aOmDLpf2EZkWKiKSZwNuUxCSps6a8yOcsanuQB1H8zPQ5cGbcHCnmAgSqoQCW0F3nszO4uRlphJMso4OS1yb573TOudsrZibXF7njJ4qWd4fQEZMzn9der9_LnfmT3jg9gsiFgyzP18oT39Gg0IKGfrs"],
    likes: 19,
    verified: true,
    uploadDate: "2024-02-15",
    color: "Geel",
    material: "Natuurrubber",
    description: "Fijne regenlaarsjes van Bergstein. Gebruikt maar nog in prima staat voor een tweede ronde.",
    category: "Jongens Meisjes Schoenen"
  },
  {
    id: "p5",
    title: "Meisjes Bloemenjurk",
    brand: "Petit Bateau",
    location: "Maastricht",
    price: 18.00,
    size: "104",
    condition: "Zgan",
    images: ["https://picsum.photos/seed/dress/600/800"],
    likes: 25,
    verified: true,
    uploadDate: "2024-02-25",
    color: "Roze",
    material: "Katoen",
    description: "Schattig zomerjurkje met vrolijke bloemenprint. Slechts een paar keer gedragen.",
    category: "Meisjes Jurken & Rokken"
  },
  {
    id: "p6",
    title: "Houten Blokkenset",
    brand: "Grimm's",
    location: "Den Haag",
    price: 35.00,
    size: "N.v.t.",
    condition: "Goed",
    images: ["https://picsum.photos/seed/toys/600/800"],
    likes: 42,
    verified: true,
    uploadDate: "2024-02-26",
    color: "Multi",
    material: "Hout",
    description: "Kleurrijke set houten blokken. Stimuleert de creativiteit van je kind.",
    category: "Speelgoed Houten speelgoed"
  },
  {
    id: "p7",
    title: "Modern Wiegje",
    brand: "Stokke",
    location: "Groningen",
    price: 120.00,
    size: "Newborn",
    condition: "Uitstekend",
    images: ["https://picsum.photos/seed/crib/600/800"],
    likes: 56,
    verified: true,
    uploadDate: "2024-02-27",
    color: "Wit",
    material: "Hout",
    description: "Prachtig modern wiegje van Stokke. Inclusief matrasje.",
    category: "Babyuitzet Wiegjes & Wiegje"
  },
  {
    id: "p8",
    title: "Compacte Bugaboo Wandelwagen",
    brand: "Bugaboo",
    location: "Arnhem",
    price: 250.00,
    size: "N.v.t.",
    condition: "Gebruikt",
    images: ["https://picsum.photos/seed/stroller/600/800"],
    likes: 12,
    verified: false,
    uploadDate: "2024-02-28",
    color: "Zwart",
    material: "Aluminium / Textiel",
    description: "Fijne wandelwagen, makkelijk in te klappen. Heeft wat lichte gebruikssporen maar rijdt nog perfect.",
    category: "Wandelwagens Wandelwagens"
  },
  {
    id: "p9",
    title: "Rugzak voor de Basisschool",
    brand: "Fjällräven Kånken Kids",
    location: "Leiden",
    price: 25.00,
    size: "One size",
    condition: "Goed",
    images: ["https://picsum.photos/seed/backpack/600/800"],
    likes: 31,
    verified: true,
    uploadDate: "2024-03-01",
    color: "Blauw",
    material: "Vinylon F",
    description: "De ideale rugzak voor school of dagjes uit. Duurzaam en stijlvol.",
    category: "School Rugzakken"
  }
];

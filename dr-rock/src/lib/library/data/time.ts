import type { LibraryEntry } from "../types";

/** Ages follow the International Chronostratigraphic Chart (ICS v2023/09). */
export const PERIOD_ENTRIES: LibraryEntry[] = [
  {
    id: "cambrian",
    name: "Cambrian",
    category: "period",
    aka: "Paleozoic Era",
    summary: "The 'explosion' when most major animal groups first appear.",
    description:
      "The Cambrian opens the Paleozoic Era and the Phanerozoic Eon. Within a few tens of millions of years, the fossil record shows the appearance of most major animal groups, including arthropods, molluscs, echinoderms and the first chordates.",
    formation:
      "Warm greenhouse climates and high sea levels flooded continental margins. The supercontinent Gondwana lay mostly in the southern hemisphere, and oxygen levels in the oceans rose.",
    age: "538.8 – 485.4 million years ago",
    facts: [
      "The name comes from Cambria, the Latin name for Wales, where its rocks were first studied.",
      "The Burgess Shale (~508 Ma) and Chengjiang (~518 Ma) sites preserve soft-bodied Cambrian animals in exquisite detail.",
      "Trilobites became abundant and are used to divide Cambrian time.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~53 million years" },
      { label: "Signature life", value: "Trilobites, early arthropods, first chordates" },
      { label: "Climate", value: "Warm greenhouse, high sea level" },
    ],
    tags: ["Cambrian explosion", "Burgess Shale", "trilobite", "Gondwana"],
    art: { kind: "time", unitId: "cambrian" },
    related: ["trilobite", "paleozoic", "ordovician"],
  },
  {
    id: "ordovician",
    name: "Ordovician",
    category: "period",
    aka: "Paleozoic Era",
    summary: "A great burst of marine diversity — ended by an ice age.",
    description:
      "During the Great Ordovician Biodiversification Event, marine life diversified dramatically: brachiopods, bryozoans, crinoids, graptolites and giant straight-shelled nautiloids filled the seas. The first plants began colonising land.",
    formation:
      "Shallow seas covered much of the continents. Late in the period, Gondwana drifted over the South Pole and a major glaciation lowered sea levels.",
    age: "485.4 – 443.8 million years ago",
    facts: [
      "The Late Ordovician mass extinction, tied to glaciation, was one of the 'Big Five' and eliminated most marine species.",
      "Fossil spores show that plants related to liverworts had reached land by about 470 million years ago.",
      "It is named after the Ordovices, an ancient Celtic tribe of Wales.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~42 million years" },
      { label: "Signature life", value: "Brachiopods, graptolites, nautiloids, crinoids" },
      { label: "Ended with", value: "Late Ordovician mass extinction" },
    ],
    tags: ["biodiversification", "glaciation", "graptolite", "mass extinction"],
    art: { kind: "time", unitId: "ordovician" },
    related: ["brachiopod", "crinoid", "cambrian", "silurian"],
  },
  {
    id: "silurian",
    name: "Silurian",
    category: "period",
    aka: "Paleozoic Era",
    summary: "Reefs recover, jawed fish spread and plants stand up on land.",
    description:
      "After the Ordovician extinction, reefs of corals and stromatoporoids rebuilt. Jawed fishes diversified, sea scorpions (eurypterids) hunted in coastal waters, and the first small vascular plants such as Cooksonia appeared on land.",
    formation:
      "Melting glaciers raised sea levels, creating vast warm, shallow seas. Continents Laurentia and Baltica collided, building the Caledonian mountains.",
    age: "443.8 – 419.2 million years ago",
    facts: [
      "Cooksonia, one of the earliest vascular plants, was only a few centimetres tall.",
      "Some of the first land animals, early millipede-like arthropods, date from this time.",
      "It is named after the Silures, a Celtic tribe of Wales.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~25 million years" },
      { label: "Signature life", value: "Reef corals, eurypterids, jawed fish" },
      { label: "Climate", value: "Warm, high sea levels" },
    ],
    tags: ["reef", "eurypterid", "Cooksonia", "jawed fish"],
    art: { kind: "time", unitId: "silurian" },
    related: ["fossil-coral", "ordovician", "devonian"],
  },
  {
    id: "devonian",
    name: "Devonian",
    category: "period",
    aka: "Paleozoic Era",
    summary: "The Age of Fishes, when the first forests and four-legged animals appeared.",
    description:
      "Fishes diversified spectacularly, from armoured placoderms like Dunkleosteus to lobe-finned fishes. Some lobe-fins gave rise to the first tetrapods, and the first true trees formed forests. Ammonoids appeared in the seas.",
    formation:
      "Warm climates supported extensive reefs. On land, roots of the first forests accelerated rock weathering and soil formation, changing ocean chemistry and atmospheric CO₂.",
    age: "419.2 – 358.9 million years ago",
    facts: [
      "Tiktaalik, about 375 million years old, combines features of fish and early limbed animals.",
      "Archaeopteris, one of the first true trees, could grow over 10 metres tall.",
      "A series of Late Devonian extinction events devastated reef ecosystems.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~60 million years" },
      { label: "Signature life", value: "Placoderms, lobe-finned fish, first tetrapods" },
      { label: "Ended with", value: "Late Devonian extinctions" },
    ],
    tags: ["Age of Fishes", "Tiktaalik", "first forests", "placoderm", "tetrapod"],
    art: { kind: "time", unitId: "devonian" },
    related: ["fossil-coral", "ammonite", "silurian", "carboniferous"],
  },
  {
    id: "carboniferous",
    name: "Carboniferous",
    category: "period",
    aka: "Paleozoic Era",
    summary: "Coal-swamp forests, giant insects and the first reptiles.",
    description:
      "Vast tropical swamps dominated by tree-sized club mosses (Lepidodendron), horsetails and seed ferns produced the peat that became much of the world's coal. Giant arthropods and the first amniotes — early reptiles — appeared.",
    formation:
      "Continents were assembling into Pangaea. High atmospheric oxygen, possibly above 30 %, coincided with giant insects, while a long ice age began in the southern hemisphere.",
    age: "358.9 – 298.9 million years ago",
    facts: [
      "Griffinflies such as Meganeura had wingspans of around 70 cm.",
      "Arthropleura, a millipede relative, grew to over 2 metres long.",
      "In North America the period is split into the Mississippian and Pennsylvanian subperiods.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~60 million years" },
      { label: "Signature life", value: "Coal forests, giant insects, first reptiles" },
      { label: "Climate", value: "Tropical swamps; southern ice age" },
    ],
    tags: ["coal", "swamp", "Meganeura", "giant insects", "Pangaea"],
    art: { kind: "time", unitId: "carboniferous" },
    related: ["coal", "fern-fossil", "crinoid", "permian"],
  },
  {
    id: "permian",
    name: "Permian",
    category: "period",
    aka: "Paleozoic Era",
    summary: "The age of Pangaea — ending in the greatest extinction of all.",
    description:
      "With the continents joined as Pangaea, interiors became hot and dry. Synapsids — the lineage leading to mammals — dominated land, from sail-backed Dimetrodon to later therapsids, while conifers spread.",
    formation:
      "The supercontinent stretched from pole to pole, creating extreme climates. At the end of the period, massive volcanic eruptions in Siberia released enormous amounts of CO₂.",
    age: "298.9 – 251.902 million years ago",
    facts: [
      "The end-Permian extinction, the 'Great Dying', wiped out the large majority of marine species — the worst crisis in the history of life.",
      "Trilobites and the Paleozoic tabulate and rugose corals disappeared in that extinction.",
      "It is named after the Perm region of Russia.",
    ],
    properties: [
      { label: "Era", value: "Paleozoic" },
      { label: "Duration", value: "~47 million years" },
      { label: "Signature life", value: "Synapsids, conifers, Glossopteris flora" },
      { label: "Ended with", value: "End-Permian mass extinction" },
    ],
    tags: ["Pangaea", "Great Dying", "Dimetrodon", "Siberian Traps"],
    art: { kind: "time", unitId: "permian" },
    related: ["trilobite", "carboniferous", "triassic", "paleozoic"],
  },
  {
    id: "triassic",
    name: "Triassic",
    category: "period",
    aka: "Mesozoic Era",
    summary: "Life rebuilds — and the first dinosaurs and mammals appear.",
    description:
      "After the Great Dying, ecosystems slowly recovered. The first dinosaurs, pterosaurs and mammal-like animals appeared on land, while ichthyosaurs swam in the seas and modern-type corals began building reefs.",
    formation:
      "Pangaea was still intact, with a hot, largely arid climate. Near the end of the period, Pangaea began to rift apart, accompanied by enormous volcanic eruptions.",
    age: "251.902 – 201.4 million years ago",
    facts: [
      "The earliest dinosaurs, such as Eoraptor and Herrerasaurus, lived about 233–230 million years ago.",
      "The name refers to a three-fold division of rock layers in Germany.",
      "The end-Triassic extinction cleared the way for dinosaurs to dominate the Jurassic.",
    ],
    properties: [
      { label: "Era", value: "Mesozoic" },
      { label: "Duration", value: "~50 million years" },
      { label: "Signature life", value: "First dinosaurs, pterosaurs, ichthyosaurs" },
      { label: "Ended with", value: "End-Triassic extinction" },
    ],
    tags: ["first dinosaurs", "Pangaea", "recovery", "ichthyosaur"],
    art: { kind: "time", unitId: "triassic" },
    related: ["petrified-wood", "mesozoic", "jurassic"],
  },
  {
    id: "jurassic",
    name: "Jurassic",
    category: "period",
    aka: "Mesozoic Era",
    summary: "Giant sauropods, the first birds and seas full of ammonites.",
    description:
      "Dinosaurs dominated the land, including giant long-necked sauropods, plated stegosaurs and large predators like Allosaurus. The first birds appeared, and the seas teemed with ammonites, belemnites and marine reptiles.",
    formation:
      "Pangaea broke apart and the Atlantic Ocean began to open. The climate was warm and humid with no large polar ice caps, and shallow seas flooded continents.",
    age: "201.4 – 145.0 million years ago",
    facts: [
      "Archaeopteryx, an early bird with feathers and teeth, is preserved in the fine Solnhofen limestone of Germany (~150 Ma).",
      "The period is named after the Jura Mountains on the France–Switzerland border.",
      "Sauropods such as Diplodocus could exceed 25 metres in length.",
    ],
    properties: [
      { label: "Era", value: "Mesozoic" },
      { label: "Duration", value: "~56 million years" },
      { label: "Signature life", value: "Sauropods, early birds, ammonites" },
      { label: "Climate", value: "Warm greenhouse, no polar ice" },
    ],
    tags: ["dinosaur", "Archaeopteryx", "sauropod", "ammonite", "Atlantic"],
    art: { kind: "time", unitId: "jurassic" },
    related: ["ammonite", "belemnite", "dinosaur-bone", "cretaceous"],
  },
  {
    id: "cretaceous",
    name: "Cretaceous",
    category: "period",
    aka: "Mesozoic Era",
    summary: "Flowers bloom, T. rex reigns — until an asteroid strikes.",
    description:
      "Flowering plants appeared and spread, transforming landscapes. Iconic dinosaurs such as Tyrannosaurus and Triceratops lived near its end, alongside mosasaurs in the seas. High sea levels deposited thick chalk.",
    formation:
      "Continents continued to separate and sea levels were among the highest in Earth history, flooding continental interiors. The period ended with the Chicxulub asteroid impact in present-day Mexico.",
    age: "145.0 – 66.0 million years ago",
    facts: [
      "The end-Cretaceous extinction eliminated about three-quarters of species, including all non-avian dinosaurs and ammonites.",
      "A thin clay layer enriched in iridium marks the impact worldwide.",
      "Its name comes from 'creta', Latin for chalk.",
    ],
    properties: [
      { label: "Era", value: "Mesozoic" },
      { label: "Duration", value: "~79 million years" },
      { label: "Signature life", value: "T. rex, flowering plants, mosasaurs" },
      { label: "Ended with", value: "Chicxulub impact (K–Pg extinction)" },
    ],
    tags: ["T. rex", "chalk", "Chicxulub", "flowering plants", "K-Pg"],
    art: { kind: "time", unitId: "cretaceous" },
    related: ["chalk", "ammonite", "dinosaur-bone", "paleogene"],
  },
  {
    id: "paleogene",
    name: "Paleogene",
    category: "period",
    aka: "Cenozoic Era",
    summary: "Mammals rise from the ashes of the dinosaurs' world.",
    description:
      "With the dinosaurs gone, mammals diversified rapidly into many new forms, including early primates, horses and whales that evolved from land-dwelling ancestors. Birds also radiated.",
    formation:
      "The period began very warm, peaking at the Paleocene–Eocene Thermal Maximum about 56 million years ago. India collided with Asia, beginning the Himalayas, and Antarctica developed ice sheets by about 34 million years ago.",
    age: "66.0 – 23.03 million years ago",
    facts: [
      "Whales evolved from four-legged land mammals in roughly 10 million years.",
      "The Messel Pit in Germany (~47 Ma) preserves mammals, birds and insects with skin, fur and stomach contents.",
      "Much of the famous Baltic amber formed during this period.",
    ],
    properties: [
      { label: "Era", value: "Cenozoic" },
      { label: "Duration", value: "~43 million years" },
      { label: "Signature life", value: "Early mammals, primates, early whales" },
      { label: "Climate", value: "Hothouse cooling to icehouse" },
    ],
    tags: ["mammals", "PETM", "whale evolution", "Himalayas", "Messel"],
    art: { kind: "time", unitId: "paleogene" },
    related: ["amber", "cenozoic", "neogene"],
  },
  {
    id: "neogene",
    name: "Neogene",
    category: "period",
    aka: "Cenozoic Era",
    summary: "Grasslands spread, megalodon hunts and our ancestors stand upright.",
    description:
      "Grasslands expanded across continents, favouring grazing mammals such as horses. Megalodon patrolled the oceans, and the first hominins — the lineage leading to humans — appeared in Africa.",
    formation:
      "The climate cooled and dried. The Isthmus of Panama formed, joining the Americas and reshaping ocean currents, and the Mediterranean temporarily dried out during the Messinian salinity crisis.",
    age: "23.03 – 2.58 million years ago",
    facts: [
      "Around 6–5.3 million years ago the Mediterranean Sea nearly dried up, leaving thick salt deposits.",
      "'Lucy', a famous Australopithecus afarensis skeleton, is about 3.2 million years old.",
      "The closure of the Isthmus of Panama allowed a great exchange of animals between North and South America.",
    ],
    properties: [
      { label: "Era", value: "Cenozoic" },
      { label: "Duration", value: "~20 million years" },
      { label: "Signature life", value: "Grazers, megalodon, early hominins" },
      { label: "Climate", value: "Cooling and drying" },
    ],
    tags: ["Miocene", "Pliocene", "megalodon", "hominin", "grasslands"],
    art: { kind: "time", unitId: "neogene" },
    related: ["megalodon-tooth", "paleogene", "quaternary"],
  },
  {
    id: "quaternary",
    name: "Quaternary",
    category: "period",
    aka: "Cenozoic Era",
    summary: "The ice ages, mammoths — and modern humans.",
    description:
      "The current period is defined by repeated glacial and interglacial cycles. Woolly mammoths, cave bears and sabre-toothed cats roamed, the genus Homo evolved, and Homo sapiens spread across the globe.",
    formation:
      "Ice sheets advanced and retreated many times, driven by cyclic changes in Earth's orbit. At the Last Glacial Maximum, about 20,000 years ago, sea level was roughly 120 metres lower than today.",
    age: "2.58 million years ago – present",
    facts: [
      "The Holocene epoch, our current interglacial, began about 11,700 years ago.",
      "The oldest known Homo sapiens fossils, from Jebel Irhoud in Morocco, are about 300,000 years old.",
      "Many large mammals, including woolly mammoths, disappeared at the end of the last ice age.",
    ],
    properties: [
      { label: "Era", value: "Cenozoic" },
      { label: "Duration", value: "2.58 million years (ongoing)" },
      { label: "Signature life", value: "Mammoths, Homo sapiens" },
      { label: "Climate", value: "Glacial–interglacial cycles" },
    ],
    tags: ["ice age", "mammoth", "Holocene", "Pleistocene", "humans"],
    art: { kind: "time", unitId: "quaternary" },
    related: ["neogene", "cenozoic"],
  },
];

export const ERA_ENTRIES: LibraryEntry[] = [
  {
    id: "precambrian",
    name: "Precambrian",
    category: "era",
    aka: "Hadean, Archean & Proterozoic eons",
    summary: "Nearly 90 % of Earth's history, from its birth to the first animals.",
    description:
      "The Precambrian is an informal name for all time before the Cambrian. It spans Earth's formation, the first oceans and continents, the origin of life, the rise of oxygen and the first multicellular organisms.",
    formation:
      "Earth formed about 4.57 billion years ago. Microbes transformed the planet: cyanobacteria released oxygen, triggering the Great Oxidation Event around 2.4 billion years ago, and the planet may have frozen over during 'Snowball Earth' episodes.",
    age: "~4,567 – 538.8 million years ago",
    facts: [
      "Zircon crystals from Jack Hills, Australia, are about 4.4 billion years old — the oldest known pieces of Earth.",
      "Stromatolites, layered mounds built by microbes, provide some of the earliest evidence of life, more than 3.4 billion years old.",
      "The Ediacaran biota (~575–539 Ma) includes some of the first large, complex organisms.",
    ],
    properties: [
      { label: "Span", value: "~4 billion years" },
      { label: "Share of Earth history", value: "~88 %" },
      { label: "Key events", value: "Origin of life, Great Oxidation, Snowball Earth" },
      { label: "Typical fossils", value: "Stromatolites, Ediacaran organisms" },
    ],
    tags: ["Hadean", "Archean", "Proterozoic", "stromatolite", "origin of life", "Ediacaran"],
    art: { kind: "time", unitId: "precambrian" },
    related: ["gneiss", "hematite", "paleozoic"],
  },
  {
    id: "paleozoic",
    name: "Paleozoic Era",
    category: "era",
    aka: "'Ancient life'",
    summary: "From the Cambrian explosion to the Great Dying.",
    description:
      "The Paleozoic saw life diversify in the oceans and then conquer the land: fish, land plants, insects, amphibians and reptiles all appeared. It includes six periods, from the Cambrian to the Permian.",
    formation:
      "Continents drifted and eventually assembled into the supercontinent Pangaea. Several ice ages and greenhouse intervals alternated.",
    age: "538.8 – 251.902 million years ago",
    facts: [
      "Its name means 'ancient life' in Greek.",
      "It began with the Cambrian explosion and ended with the end-Permian mass extinction, the largest in Earth history.",
      "Trilobites lived through almost the entire era.",
    ],
    properties: [
      { label: "Periods", value: "Cambrian → Permian (6)" },
      { label: "Duration", value: "~287 million years" },
      { label: "Signature life", value: "Trilobites, brachiopods, early fish, coal forests" },
      { label: "Ended with", value: "End-Permian extinction" },
    ],
    tags: ["ancient life", "Pangaea", "trilobite", "Great Dying"],
    art: { kind: "time", unitId: "paleozoic" },
    related: ["cambrian", "permian", "trilobite", "mesozoic"],
  },
  {
    id: "mesozoic",
    name: "Mesozoic Era",
    category: "era",
    aka: "'Middle life' — the Age of Reptiles",
    summary: "The age of dinosaurs, between two mass extinctions.",
    description:
      "The Mesozoic is famous for dinosaurs, but it also saw the first mammals, birds and flowering plants, and seas ruled by marine reptiles and ammonites. It comprises the Triassic, Jurassic and Cretaceous periods.",
    formation:
      "Pangaea broke apart, opening the Atlantic Ocean. Climates were generally warm, with little or no polar ice for long intervals.",
    age: "251.902 – 66.0 million years ago",
    facts: [
      "Its name means 'middle life'.",
      "It began after the end-Permian extinction and ended with the Chicxulub impact.",
      "Ammonites are so useful for dating its rocks that Mesozoic time is divided by ammonite zones.",
    ],
    properties: [
      { label: "Periods", value: "Triassic, Jurassic, Cretaceous" },
      { label: "Duration", value: "~186 million years" },
      { label: "Signature life", value: "Dinosaurs, ammonites, marine reptiles" },
      { label: "Ended with", value: "K–Pg extinction" },
    ],
    tags: ["dinosaurs", "Age of Reptiles", "ammonites", "Pangaea breakup"],
    art: { kind: "time", unitId: "mesozoic" },
    related: ["triassic", "jurassic", "cretaceous", "ammonite"],
  },
  {
    id: "cenozoic",
    name: "Cenozoic Era",
    category: "era",
    aka: "'New life' — the Age of Mammals",
    summary: "The age of mammals, from the dinosaurs' demise to today.",
    description:
      "In the Cenozoic, mammals and birds diversified to fill the niches left by dinosaurs, grasslands spread, and humans evolved. It includes the Paleogene, Neogene and Quaternary periods.",
    formation:
      "Continents moved toward their present positions, the Alps and Himalayas rose, and Earth's climate cooled from a hothouse into the ice ages.",
    age: "66.0 million years ago – present",
    facts: [
      "Its name means 'new life'.",
      "The Himalayas, still rising today, began forming when India collided with Asia about 50 million years ago.",
      "Every human who ever lived belongs to the last tiny fraction of this era.",
    ],
    properties: [
      { label: "Periods", value: "Paleogene, Neogene, Quaternary" },
      { label: "Duration", value: "66 million years (ongoing)" },
      { label: "Signature life", value: "Mammals, birds, grasses, humans" },
      { label: "Climate", value: "Cooling toward ice ages" },
    ],
    tags: ["mammals", "Age of Mammals", "ice ages", "Himalayas", "humans"],
    art: { kind: "time", unitId: "cenozoic" },
    related: ["paleogene", "neogene", "quaternary", "megalodon-tooth"],
  },
];

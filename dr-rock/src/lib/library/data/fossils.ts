import type { LibraryEntry } from "../types";

export const MARINE_FOSSILS: LibraryEntry[] = [
  {
    id: "ammonite",
    name: "Ammonite",
    category: "marine-fossil",
    aka: "Ammonoidea",
    summary: "Spiral-shelled relatives of squid that ruled Mesozoic seas.",
    description:
      "Ammonites (ammonoids) were marine cephalopod molluscs with coiled, chambered shells. The walls between chambers met the shell in intricate, frilly suture lines that are a hallmark of the group.",
    formation:
      "When an ammonite died, its shell sank into seafloor mud. The original aragonite shell often dissolved or was replaced by calcite or pyrite, while the chambers filled with sediment or crystals, producing internal moulds that show the sutures.",
    age: "Ammonoids appeared in the Early Devonian, about 410 million years ago, and the last ones died out in the end-Cretaceous extinction, 66 million years ago.",
    facts: [
      "Because species evolved rapidly and spread widely, ammonites are superb index fossils for dating Jurassic and Cretaceous rocks.",
      "The largest known ammonite, Parapuzosia seppenradensis, had a shell close to 2 metres across.",
      "Despite their Nautilus-like shells, ammonoids were more closely related to squid and octopuses.",
    ],
    properties: [
      { label: "Group", value: "Mollusca › Cephalopoda › Ammonoidea" },
      { label: "Lived", value: "~410–66 Ma (Devonian–Cretaceous)" },
      { label: "Habitat", value: "Open seas" },
      { label: "Found in", value: "Limestone, shale, concretions" },
    ],
    tags: ["cephalopod", "spiral", "index fossil", "Jurassic", "Cretaceous", "suture"],
    art: { kind: "fossil", form: "ammonite", matrix: ["#a0978a", "#4f4a43"], fossil: ["#dcbc8e", "#7a5634"] },
    related: ["belemnite", "jurassic", "cretaceous", "limestone"],
  },
  {
    id: "trilobite",
    name: "Trilobite",
    category: "marine-fossil",
    aka: "Trilobita",
    summary: "Armoured arthropods that roamed the seafloor for nearly 300 million years.",
    description:
      "Trilobites were marine arthropods whose hard exoskeleton is divided lengthwise into three lobes — a central axis flanked by two pleural lobes — and crosswise into head (cephalon), segmented thorax and tail (pygidium).",
    formation:
      "Their mineralised exoskeletons fossilised readily. Like modern arthropods they moulted, so many trilobite fossils are shed skins rather than bodies, typically preserved in fine shale or limestone.",
    age: "Trilobites appeared in the Early Cambrian, about 521 million years ago, and disappeared in the end-Permian mass extinction, about 252 million years ago.",
    facts: [
      "More than 20,000 trilobite species have been described.",
      "Their compound eyes had lenses made of the mineral calcite — among the earliest complex eyes known.",
      "Many species could roll up into a ball for protection, like modern pill bugs.",
    ],
    properties: [
      { label: "Group", value: "Arthropoda › Trilobita" },
      { label: "Lived", value: "~521–252 Ma (Cambrian–Permian)" },
      { label: "Habitat", value: "Seafloor, from shallow to deep" },
      { label: "Found in", value: "Shale, limestone" },
    ],
    tags: ["arthropod", "Cambrian", "Paleozoic", "exoskeleton", "index fossil"],
    art: { kind: "fossil", form: "trilobite", matrix: ["#84878a", "#3a3c3e"], fossil: ["#6e655c", "#2a2520"] },
    related: ["cambrian", "ordovician", "shale"],
  },
  {
    id: "brachiopod",
    name: "Brachiopod",
    category: "marine-fossil",
    aka: "Lamp shell",
    summary: "Shelled filter-feeders that dominated Paleozoic seafloors.",
    description:
      "Brachiopods are marine animals with two shells (valves) of unequal size. They look like clams, but the plane of symmetry cuts through each valve rather than between them, and they belong to an entirely different branch of animal life.",
    formation:
      "Their sturdy calcite or phosphate shells were easily buried in seafloor sediment and are often preserved whole or as moulds, sometimes in vast shell beds.",
    age: "Brachiopods appeared in the early Cambrian, over 520 million years ago. They peaked in the Paleozoic, were devastated by the end-Permian extinction and still survive today.",
    facts: [
      "Hundreds of brachiopod species still live today, mostly in cold or deep waters.",
      "Lingula, a living brachiopod, looks remarkably like relatives that lived hundreds of millions of years ago.",
      "Their name means 'arm-foot', from a mistaken early idea about their feeding organ.",
    ],
    properties: [
      { label: "Group", value: "Brachiopoda" },
      { label: "Lived", value: "Cambrian – present (>520 Ma)" },
      { label: "Habitat", value: "Seafloor filter feeders" },
      { label: "Found in", value: "Limestone, shale" },
    ],
    tags: ["shell", "lamp shell", "Paleozoic", "filter feeder", "bivalve look-alike"],
    art: { kind: "fossil", form: "brachiopod", matrix: ["#cbc1aa", "#7d735f"], fossil: ["#f0e5d0", "#a08a66"] },
    related: ["limestone", "ordovician", "devonian"],
  },
  {
    id: "crinoid",
    name: "Crinoid",
    category: "marine-fossil",
    aka: "Sea lily",
    summary: "Flower-like animals whose stem fragments build entire limestones.",
    description:
      "Crinoids are echinoderms — relatives of starfish and sea urchins. Many had a long stalk made of stacked discs (columnals), topped by a cup (calyx) and feathery arms for catching food particles.",
    formation:
      "When crinoids died, their skeletons usually fell apart into individual plates and columnals, which accumulated on the seafloor. Complete fossil crinoids are rare treasures from rapid burial.",
    age: "Crinoids appeared in the Early Ordovician, about 485 million years ago, flourished in the Paleozoic and still live today.",
    facts: [
      "The Mississippian (Early Carboniferous) is nicknamed the 'Age of Crinoids'.",
      "Some limestones, called encrinites, are made almost entirely of crinoid fragments.",
      "Fossil crinoid columnals were once called 'St Cuthbert's beads' and were strung as rosaries.",
    ],
    properties: [
      { label: "Group", value: "Echinodermata › Crinoidea" },
      { label: "Lived", value: "Ordovician – present (~485 Ma)" },
      { label: "Habitat", value: "Seafloor, reefs" },
      { label: "Found in", value: "Limestone" },
    ],
    tags: ["sea lily", "echinoderm", "columnal", "Carboniferous", "encrinite"],
    art: { kind: "fossil", form: "crinoid", matrix: ["#a69d8f", "#57504a"], fossil: ["#e9ddc8", "#9c8b70"] },
    related: ["limestone", "carboniferous"],
  },
  {
    id: "megalodon-tooth",
    name: "Megalodon tooth",
    category: "marine-fossil",
    aka: "Otodus megalodon",
    summary: "Teeth from the largest predatory shark that ever lived.",
    description:
      "Megalodon was a gigantic shark whose skeleton, made of cartilage, almost never fossilised. Its huge, triangular, serrated teeth, however, are common fossils. Their colours come from minerals absorbed during fossilisation.",
    formation:
      "Sharks shed and replace teeth continuously throughout life. Shed teeth sank into seafloor sediments, where minerals gradually replaced the original material.",
    age: "Megalodon lived from about 23 to 3.6 million years ago, during the Miocene and Pliocene epochs.",
    facts: [
      "The largest megalodon teeth exceed 17 cm in slant height.",
      "Scientific estimates of megalodon's body length vary, commonly between about 15 and 20 metres.",
      "A single shark can shed thousands of teeth in its lifetime, making shark teeth among the most common vertebrate fossils.",
    ],
    properties: [
      { label: "Group", value: "Chondrichthyes › Lamniformes" },
      { label: "Lived", value: "~23–3.6 Ma (Miocene–Pliocene)" },
      { label: "Habitat", value: "Warm coastal and open seas" },
      { label: "Found in", value: "Marine sands, phosphate beds" },
    ],
    tags: ["shark", "tooth", "Miocene", "Neogene", "vertebrate"],
    art: { kind: "fossil", form: "shark-tooth", matrix: ["#a0978a", "#4f4a43"], fossil: ["#80909c", "#262d33"] },
    related: ["neogene"],
  },
  {
    id: "fossil-coral",
    name: "Fossil coral",
    category: "marine-fossil",
    aka: "Rugose, tabulate & scleractinian corals",
    summary: "Ancient reef builders, some preserved as honeycomb-like colonies.",
    description:
      "Corals are marine animals that build calcium carbonate skeletons. Paleozoic tabulate corals such as Favosites formed honeycomb-like colonies, while rugose corals were often horn-shaped. Modern reef corals (scleractinians) appeared later.",
    formation:
      "Coral skeletons are robust and often fossilise in place, sometimes preserving entire ancient reefs within limestone.",
    age: "Tabulate and rugose corals lived from the Ordovician until the end-Permian extinction (~252 Ma). Scleractinian corals appeared in the Middle Triassic and build today's reefs.",
    facts: [
      "Growth bands on Devonian corals suggest a year then had about 400 days, because Earth's rotation has slowed over time.",
      "The Petoskey stone, Michigan's state stone, is a fossil Devonian colonial coral.",
      "Devonian reef systems were among the most extensive in Earth history.",
    ],
    properties: [
      { label: "Group", value: "Cnidaria › Anthozoa" },
      { label: "Lived", value: "Ordovician – present" },
      { label: "Habitat", value: "Warm, shallow, clear seas" },
      { label: "Found in", value: "Reef limestone" },
    ],
    tags: ["reef", "Favosites", "honeycomb", "Devonian", "Petoskey"],
    art: { kind: "fossil", form: "coral", matrix: ["#bbae97", "#62574a"], fossil: ["#e7dbc4", "#4a3a2a"] },
    related: ["devonian", "silurian", "limestone"],
  },
  {
    id: "belemnite",
    name: "Belemnite",
    category: "marine-fossil",
    aka: "Belemnitida",
    summary: "Bullet-shaped guards from extinct squid-like hunters.",
    description:
      "Belemnites were squid-like cephalopods. Their most commonly preserved part is the guard (rostrum), a dense, bullet-shaped calcite structure at the rear of the internal shell, often translucent amber to brown.",
    formation:
      "The solid calcite guard resisted decay and fossilised readily in marine mud and limestone; soft parts, ink sacs and arm hooks survive only rarely.",
    age: "Belemnites lived from the Early Jurassic (with possible Late Triassic forerunners) until the end-Cretaceous extinction, 66 million years ago.",
    facts: [
      "In folklore they were called 'thunderbolts', believed to fall from the sky during storms.",
      "Oxygen isotopes in belemnite guards are used to reconstruct ancient seawater temperatures.",
      "The carbon-isotope reference standard used worldwide (PDB) was originally based on a Cretaceous belemnite.",
    ],
    properties: [
      { label: "Group", value: "Mollusca › Cephalopoda › Belemnitida" },
      { label: "Lived", value: "~200–66 Ma (Jurassic–Cretaceous)" },
      { label: "Habitat", value: "Open seas" },
      { label: "Found in", value: "Marine clays, limestone, chalk" },
    ],
    tags: ["cephalopod", "guard", "thunderbolt", "Jurassic", "isotopes"],
    art: { kind: "fossil", form: "belemnite", matrix: ["#aaa295", "#575049"], fossil: ["#e2a55c", "#6b3a14"] },
    related: ["ammonite", "jurassic"],
  },
];

export const TERRESTRIAL_FOSSILS: LibraryEntry[] = [
  {
    id: "fern-fossil",
    name: "Fern fossil",
    category: "terrestrial-fossil",
    aka: "Plant compression",
    summary: "Delicate fronds from the coal-swamp forests of the Carboniferous.",
    description:
      "Fossil fern-like fronds are among the most beautiful plant fossils. They usually appear as dark carbon films or impressions on shale or inside ironstone nodules, showing every leaflet (pinnule).",
    formation:
      "Leaves that fell into swamps and lakes were buried quickly in fine mud. Pressure flattened them and drove off volatile compounds, leaving a thin carbon film (compression) or an imprint.",
    age: "True ferns appeared in the Devonian, about 390 million years ago. The most famous fern-like fossils come from Carboniferous coal measures (359–299 Ma).",
    facts: [
      "Many Carboniferous 'ferns' were actually seed ferns — plants with fern-like leaves that reproduced with seeds.",
      "The Mazon Creek site in Illinois preserves plants inside ironstone concretions about 309 million years old.",
      "Fern spores often 'spike' in rock layers right after mass extinctions, as ferns quickly recolonise devastated land.",
    ],
    properties: [
      { label: "Group", value: "Plantae (ferns & seed ferns)" },
      { label: "Lived", value: "Devonian – present" },
      { label: "Habitat", value: "Swamps, floodplains, forests" },
      { label: "Found in", value: "Shale, ironstone, coal measures" },
    ],
    tags: ["plant", "leaf", "Carboniferous", "seed fern", "compression"],
    art: { kind: "fossil", form: "fern", matrix: ["#a8835a", "#5a4028"], fossil: ["#3a2c1e", "#1c140c"] },
    related: ["carboniferous", "coal", "shale"],
  },
  {
    id: "petrified-wood",
    name: "Petrified wood",
    category: "terrestrial-fossil",
    aka: "Silicified wood",
    summary: "Ancient trees turned to stone, cell by cell.",
    description:
      "Petrified wood is fossil wood in which the original organic material has been filled and replaced by minerals, usually silica (quartz, chalcedony or opal). Growth rings and even individual cells can be preserved.",
    formation:
      "Logs buried rapidly — often by volcanic ash or river sediment — were soaked by groundwater rich in dissolved silica. The silica precipitated inside cell spaces and gradually replaced the wood.",
    age: "Fossil wood occurs from the Devonian, when the first trees appeared about 385 million years ago, to geologically recent times.",
    facts: [
      "Petrified Forest National Park in Arizona preserves logs from the Late Triassic, roughly 225 million years ago.",
      "Iron and manganese impurities give petrified wood its reds, yellows and blacks.",
      "Because it is largely quartz, petrified wood is about as hard as quartz (~7 on the Mohs scale).",
    ],
    properties: [
      { label: "Composition", value: "Silica (quartz, chalcedony, opal)" },
      { label: "Lived", value: "Devonian – recent" },
      { label: "Preservation", value: "Permineralization & replacement" },
      { label: "Hardness", value: "~7 Mohs" },
    ],
    tags: ["tree", "silica", "Triassic", "Arizona", "permineralization"],
    art: { kind: "fossil", form: "petrified-wood", matrix: ["#a0978a", "#4f4a43"], fossil: ["#eab46e", "#6b2f17"] },
    related: ["triassic", "quartz"],
  },
  {
    id: "dinosaur-bone",
    name: "Dinosaur bone",
    category: "terrestrial-fossil",
    aka: "Permineralized bone",
    summary: "Mineral-filled bones of the animals that dominated the Mesozoic.",
    description:
      "Fossil dinosaur bone keeps the shape and often the microscopic structure of the original bone, while its pores are filled with minerals. Broken ends commonly reveal a spongy, honeycomb-like interior.",
    formation:
      "Bones buried in river sand, floodplain mud or lake deposits were permeated by groundwater. Minerals such as silica, calcite or iron compounds crystallised in the pores, making the fossil heavier than the original bone.",
    age: "Dinosaurs appeared about 233–230 million years ago in the Late Triassic. Non-avian dinosaurs went extinct 66 million years ago; birds are their living descendants.",
    facts: [
      "Birds are living dinosaurs, descended from small feathered theropods.",
      "Some dinosaur bones are 'agatized', with colourful agate filling the bone cells.",
      "Thin sections of fossil bone reveal growth rings that let scientists estimate a dinosaur's age at death.",
    ],
    properties: [
      { label: "Group", value: "Dinosauria" },
      { label: "Lived", value: "~233–66 Ma (non-avian)" },
      { label: "Habitat", value: "Land: floodplains, deserts, forests" },
      { label: "Found in", value: "Sandstone, mudstone" },
    ],
    tags: ["dinosaur", "bone", "Jurassic", "Cretaceous", "vertebrate", "T. rex"],
    art: { kind: "fossil", form: "dinosaur-bone", matrix: ["#a0978a", "#4f4a43"], fossil: ["#cba77c", "#4a3322"] },
    related: ["jurassic", "cretaceous", "dinosaur-footprint"],
  },
  {
    id: "amber",
    name: "Amber with insect",
    category: "terrestrial-fossil",
    aka: "Fossilized resin",
    summary: "Golden time capsules that trap insects in perfect detail.",
    description:
      "Amber is fossilised tree resin. Sticky resin trapped insects, spiders, plant fragments and occasionally small vertebrates, sealing them in with extraordinary three-dimensional detail.",
    formation:
      "Resin buried in sediment slowly hardens as its molecules polymerise and lose volatile compounds over millions of years. Younger, incompletely hardened resin is called copal.",
    age: "Amber with tiny trapped arthropods is known from the Triassic (~230 Ma). Famous deposits include Burmese amber (~99 Ma), Baltic amber (~45–35 Ma) and Dominican amber (~20–15 Ma).",
    facts: [
      "Amber floats in strongly salty water because its density is only about 1.05–1.10 g/cm³.",
      "The word 'electricity' comes from 'elektron', Greek for amber, which becomes charged when rubbed.",
      "Despite the movies, no dinosaur DNA has been recovered from amber — DNA degrades far too quickly.",
    ],
    properties: [
      { label: "Composition", value: "Polymerised plant resin" },
      { label: "Hardness", value: "2–2.5 Mohs" },
      { label: "Density", value: "~1.05–1.10 g/cm³" },
      { label: "Oldest inclusions", value: "~230 Ma (Triassic)" },
    ],
    tags: ["resin", "insect", "Baltic", "inclusion", "copal", "gem"],
    art: { kind: "fossil", form: "amber", matrix: ["#a0978a", "#4f4a43"], fossil: ["#f2a32c", "#8a3a0a"] },
    related: ["paleogene", "cretaceous"],
  },
  {
    id: "dinosaur-footprint",
    name: "Dinosaur footprint",
    category: "terrestrial-fossil",
    aka: "Trace fossil (ichnofossil)",
    summary: "A moment of behaviour frozen in stone.",
    description:
      "Footprints are trace fossils: they record activity rather than a body. Three-toed tracks were usually made by theropods or ornithopods, while sauropods left huge rounded prints. Trackways reveal posture, speed and herd behaviour.",
    formation:
      "A dinosaur walked across soft mud or damp sand. The print dried and was gently covered by new sediment, which later hardened into rock. Erosion can expose the track or its natural cast.",
    age: "Dinosaur tracks are found in rocks from the Late Triassic to the end of the Cretaceous (about 230–66 million years ago).",
    facts: [
      "Tracks get their own scientific names (ichnotaxa), such as Grallator and Eubrontes, because the exact trackmaker is rarely known.",
      "Walking speed can be estimated from stride length and the animal's hip height.",
      "At Plagne in France, a sauropod trackway about 150 million years old continues for more than 150 metres.",
    ],
    properties: [
      { label: "Type", value: "Trace fossil" },
      { label: "Age", value: "~230–66 Ma" },
      { label: "Environment", value: "Shorelines, mudflats, riverbanks" },
      { label: "Found in", value: "Sandstone, siltstone, limestone" },
    ],
    tags: ["track", "ichnofossil", "theropod", "trackway", "dinosaur"],
    art: { kind: "fossil", form: "footprint", matrix: ["#c6a585", "#6e5640"], fossil: ["#e2c9a8", "#5d4732"] },
    related: ["dinosaur-bone", "jurassic", "sandstone"],
  },
];

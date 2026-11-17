import type { LibraryEntry } from "../types";

export const MINERALS: LibraryEntry[] = [
  {
    id: "quartz",
    name: "Quartz",
    category: "mineral",
    aka: "SiO₂",
    summary: "The hard, glassy mineral found in countless rocks, sands and gems.",
    description:
      "Quartz is silicon dioxide, one of the most abundant minerals in the continental crust. It forms six-sided prisms topped by pyramids, has a glassy lustre, no cleavage and breaks with a conchoidal fracture.",
    formation:
      "It crystallises from silica-rich magmas (as in granite), from hot hydrothermal fluids in veins and geodes, and during metamorphism. Its resistance to weathering makes it the main component of most sand.",
    age: "Quartz forms continuously and is found in rocks of every age; quartz crystals can grow in a few years in laboratories or over millions of years in nature.",
    facts: [
      "Quartz is piezoelectric — it produces a tiny voltage when squeezed — which is why it keeps time in quartz watches.",
      "Amethyst, citrine, rose quartz, smoky quartz, agate and jasper are all varieties of quartz.",
      "It defines 7 on the Mohs hardness scale and easily scratches glass.",
    ],
    properties: [
      { label: "Formula", value: "SiO₂" },
      { label: "Hardness", value: "7 Mohs" },
      { label: "Density", value: "2.65 g/cm³" },
      { label: "Crystal system", value: "Trigonal (hexagonal prisms)" },
    ],
    tags: ["silica", "crystal", "amethyst", "agate", "sand", "geode"],
    art: { kind: "crystal", habit: "hex-prism", palette: ["#f4f8fb", "#cfdbe3", "#8fa3b0"] },
    related: ["granite", "sandstone", "quartzite"],
  },
  {
    id: "feldspar",
    name: "Feldspar",
    category: "mineral",
    aka: "Orthoclase & plagioclase",
    summary: "The most abundant mineral group in Earth's crust.",
    description:
      "Feldspars are aluminium silicates containing potassium, sodium or calcium. Orthoclase (potassium feldspar) is often pink or salmon; plagioclase is typically white to grey. Both break along two cleavage planes at nearly right angles.",
    formation:
      "Feldspars crystallise from magma in most igneous rocks and grow during metamorphism. At the surface they weather slowly into clay minerals such as kaolinite.",
    age: "Feldspars form continuously and occur in rocks of every age.",
    facts: [
      "Feldspars make up roughly 40 % of Earth's continental crust by weight.",
      "Orthoclase defines 6 on the Mohs hardness scale.",
      "Moonstone and labradorite, with their shimmering optical effects, are gem varieties of feldspar.",
    ],
    properties: [
      { label: "Formula", value: "KAlSi₃O₈ – (Na,Ca)(Al,Si)₄O₈" },
      { label: "Hardness", value: "6–6.5 Mohs" },
      { label: "Density", value: "2.55–2.76 g/cm³" },
      { label: "Cleavage", value: "Two directions, ~90°" },
    ],
    tags: ["orthoclase", "plagioclase", "silicate", "clay", "moonstone", "labradorite"],
    art: { kind: "crystal", habit: "blocky", palette: ["#f2c7b0", "#d99a7c", "#a8654a"] },
    related: ["granite", "andesite"],
  },
  {
    id: "calcite",
    name: "Calcite",
    category: "mineral",
    aka: "CaCO₃",
    summary: "The fizzing mineral of shells, limestone and marble.",
    description:
      "Calcite is calcium carbonate. It splits into perfect rhombohedra along three cleavage directions, fizzes in dilute acid, and clear crystals show strong double refraction: anything seen through them appears doubled.",
    formation:
      "It forms from seawater through the shells and skeletons of organisms, precipitates in caves as stalactites and stalagmites, and recrystallises during metamorphism to form marble.",
    age: "Calcite forms continuously, from ancient marine deposits to cave formations growing today.",
    facts: [
      "Clear calcite, called Iceland spar, splits a single image into two.",
      "It defines 3 on the Mohs scale: a copper coin can just scratch it.",
      "Most of the world's limestone and marble is made of calcite.",
    ],
    properties: [
      { label: "Formula", value: "CaCO₃" },
      { label: "Hardness", value: "3 Mohs" },
      { label: "Density", value: "2.71 g/cm³" },
      { label: "Cleavage", value: "Perfect rhombohedral" },
    ],
    tags: ["carbonate", "Iceland spar", "double refraction", "stalactite", "acid test"],
    art: { kind: "crystal", habit: "rhombohedron", palette: ["#fbe7b5", "#e9c27a", "#b98a3c"] },
    related: ["limestone", "marble", "chalk"],
  },
  {
    id: "mica",
    name: "Mica (muscovite)",
    category: "mineral",
    aka: "Sheet silicate",
    summary: "A mineral that peels into thin, flexible, see-through sheets.",
    description:
      "Micas are sheet silicates with perfect cleavage in one direction, so they peel into extremely thin, flexible flakes. Muscovite is clear to silvery; biotite is dark brown to black.",
    formation:
      "Micas crystallise in granites and pegmatites and grow abundantly during metamorphism, giving schist and phyllite their sparkle.",
    age: "Micas form continuously and occur in igneous and metamorphic rocks of all ages.",
    facts: [
      "Sheets of muscovite were once used as window panes, known as 'Muscovy glass' — the origin of its name.",
      "Mica is an excellent electrical insulator and withstands high temperatures.",
      "It is soft enough (2–2.5 Mohs) to be scratched with a fingernail.",
    ],
    properties: [
      { label: "Formula (muscovite)", value: "KAl₂(AlSi₃O₁₀)(OH)₂" },
      { label: "Hardness", value: "2–2.5 Mohs" },
      { label: "Density", value: "2.76–2.88 g/cm³" },
      { label: "Cleavage", value: "Perfect, one direction" },
    ],
    tags: ["muscovite", "biotite", "sheet", "schist", "insulator"],
    art: { kind: "crystal", habit: "sheets", palette: ["#efe9da", "#bfb49a", "#7d735c"] },
    related: ["schist", "phyllite", "granite"],
  },
  {
    id: "pyrite",
    name: "Pyrite",
    category: "mineral",
    aka: "Fool's gold (FeS₂)",
    summary: "Brassy cubes that have fooled prospectors for centuries.",
    description:
      "Pyrite is iron sulfide with a bright brass-yellow metallic lustre. It often forms striated cubes or pyritohedra. Unlike gold, it is hard and brittle and leaves a greenish-black streak.",
    formation:
      "It forms in low-oxygen sediments (where bacteria produce sulfide), in hydrothermal veins and in metamorphic rocks. In mud it can replace shells, producing shiny pyritised fossils.",
    age: "Pyrite forms in rocks of all ages, from ancient Archean sediments to modern marine muds.",
    facts: [
      "Its name comes from the Greek 'pyr', fire, because it sparks when struck against steel.",
      "Near-perfect natural cubes are found at Navajún, Spain.",
      "Pyritised ammonites can slowly decay in humid air — a problem collectors call 'pyrite disease'.",
    ],
    properties: [
      { label: "Formula", value: "FeS₂" },
      { label: "Hardness", value: "6–6.5 Mohs" },
      { label: "Density", value: "4.9–5.2 g/cm³" },
      { label: "Streak", value: "Greenish-black" },
    ],
    tags: ["fool's gold", "sulfide", "cube", "metallic", "pyritised fossil"],
    art: { kind: "crystal", habit: "cube", palette: ["#f2dc8a", "#c9a94a", "#7d6524"] },
    related: ["ammonite", "shale"],
  },
  {
    id: "hematite",
    name: "Hematite",
    category: "mineral",
    aka: "Fe₂O₃",
    summary: "The iron oxide that colours red rocks — and Mars.",
    description:
      "Hematite is iron oxide and the most important ore of iron. It ranges from metallic steel-grey to earthy red, but always leaves a reddish-brown streak. Rounded 'kidney ore' (botryoidal) forms are prized by collectors.",
    formation:
      "It forms when iron-bearing minerals oxidise, precipitates from water in sedimentary basins, and makes up much of the ancient banded iron formations.",
    age: "Hematite occurs in rocks of all ages; huge banded iron formations formed mostly between about 2.5 and 1.8 billion years ago.",
    facts: [
      "Its name comes from the Greek 'haima', blood, because of its red streak.",
      "NASA's Opportunity rover found small hematite spheres, nicknamed 'blueberries', on Mars in 2004 — evidence of past water.",
      "Red ochre, one of the oldest pigments used by humans, is largely hematite.",
    ],
    properties: [
      { label: "Formula", value: "Fe₂O₃" },
      { label: "Hardness", value: "5–6.5 Mohs" },
      { label: "Density", value: "~5.3 g/cm³" },
      { label: "Streak", value: "Reddish-brown" },
    ],
    tags: ["iron ore", "oxide", "red", "Mars", "botryoidal", "ochre"],
    art: { kind: "crystal", habit: "botryoidal", palette: ["#c9cbce", "#6c5a5a", "#2a1c1c"] },
    related: ["precambrian", "sandstone"],
  },
  {
    id: "olivine",
    name: "Olivine",
    category: "mineral",
    aka: "(Mg,Fe)₂SiO₄",
    summary: "The green mineral that makes up much of Earth's upper mantle.",
    description:
      "Olivine is an olive-green magnesium–iron silicate with a glassy lustre, usually found as grains rather than large crystals. Gem-quality olivine is called peridot.",
    formation:
      "It is the main mineral of peridotite, the rock of the upper mantle, and crystallises early from basaltic magma. Volcanic eruptions sometimes carry mantle olivine to the surface.",
    age: "Olivine forms continuously in the mantle and in mafic magmas; it also occurs in meteorites as old as the Solar System (~4.57 billion years).",
    facts: [
      "Olivine is thought to be the most abundant mineral in Earth's upper mantle.",
      "Papakōlea Beach in Hawaii owes its green sand to olivine crystals eroded from volcanic rock.",
      "Pallasite meteorites contain gem-like olivine crystals embedded in iron–nickel metal.",
    ],
    properties: [
      { label: "Formula", value: "(Mg,Fe)₂SiO₄" },
      { label: "Hardness", value: "6.5–7 Mohs" },
      { label: "Density", value: "3.2–4.4 g/cm³" },
      { label: "Lustre", value: "Vitreous (glassy)" },
    ],
    tags: ["peridot", "mantle", "peridotite", "green sand", "meteorite"],
    art: { kind: "crystal", habit: "granular", palette: ["#c9e07a", "#7da832", "#3d5a14"] },
    related: ["basalt", "gabbro"],
  },
  {
    id: "gypsum",
    name: "Gypsum",
    category: "mineral",
    aka: "CaSO₄·2H₂O",
    summary: "A soft evaporite mineral that can grow into giant crystals.",
    description:
      "Gypsum is hydrated calcium sulfate, soft enough to scratch with a fingernail. Varieties include transparent selenite, fibrous satin spar, fine-grained alabaster and rosette-shaped 'desert roses'.",
    formation:
      "It precipitates when seawater or salty lake water evaporates, forming thick evaporite beds. It can also grow in caves and clays.",
    age: "Gypsum forms today in salt flats and has formed throughout geological history wherever basins dried out.",
    facts: [
      "Selenite crystals in Mexico's Cave of the Crystals (Naica) reach about 11–12 metres in length.",
      "The brilliant dunes of White Sands, New Mexico, are made of gypsum sand.",
      "Heated gypsum becomes plaster of Paris and is the main ingredient of drywall.",
    ],
    properties: [
      { label: "Formula", value: "CaSO₄·2H₂O" },
      { label: "Hardness", value: "2 Mohs" },
      { label: "Density", value: "~2.3 g/cm³" },
      { label: "Varieties", value: "Selenite, satin spar, alabaster" },
    ],
    tags: ["evaporite", "selenite", "desert rose", "plaster", "Naica"],
    art: { kind: "crystal", habit: "bladed", palette: ["#ffffff", "#e8eef2", "#b8c6cf"] },
    related: ["neogene"],
  },
];

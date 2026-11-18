import type { EntryText } from "../../types";

/** Spanish text for metamorphic rock entries. */
export const ROCKS_B_ES: Record<string, EntryText> = {
  marble: {
    name: "Mármol",
    aka: "Caliza metamorfizada",
    summary: "Caliza renacida bajo calor y presión: la piedra de los escultores.",
    description:
      "El mármol es una roca metamórfica formada por cristales entrelazados y recristalizados de calcita o dolomita. El mármol puro es blanco; las impurezas crean vetas y remolinos de colores. Como la caliza, burbujea con ácido.",
    formation:
      "Cuando la caliza queda enterrada a gran profundidad o la calienta un magma cercano, su calcita recristaliza en granos más grandes y entrelazados. El proceso suele borrar los fósiles que contenía la caliza.",
    age: "Hay mármoles de muchas edades. El famoso mármol de Carrara (Italia) fue caliza depositada en el Jurásico y metamorfizada durante la formación de los Apeninos, decenas de millones de años después.",
    facts: [
      "Miguel Ángel esculpió su David en mármol de Carrara.",
      "El Taj Mahal está revestido de mármol blanco de Makrana (India).",
      "La lluvia ácida disuelve lentamente el mármol; por eso las estatuas al aire libre pierden sus detalles con el tiempo.",
    ],
    properties: [
      { label: "Mineral principal", value: "Calcita o dolomita" },
      { label: "Roca original", value: "Caliza / dolomía" },
      { label: "Dureza", value: "3–4 Mohs" },
      { label: "Densidad", value: "2,55–2,75 g/cm³" },
    ],
    tags: ["Carrara", "escultura", "calcita", "no foliada", "recristalizada"],
  },
  quartzite: {
    name: "Cuarcita",
    aka: "Arenisca metamorfizada",
    summary: "Arenisca soldada en una de las rocas más resistentes de la Tierra.",
    description:
      "La cuarcita es una roca metamórfica dura y no foliada formada casi por completo por cuarzo. Sus granos están tan soldados que se rompe a través de ellos y no alrededor, con una superficie azucarada y vítrea.",
    formation:
      "Se forma cuando una arenisca rica en cuarzo se calienta y se comprime: los granos de cuarzo recristalizan y se sueldan, y desaparecen los poros originales.",
    age: "Hay cuarcitas muy antiguas —como la cuarcita de Baraboo (Wisconsin), de unos 1700 millones de años— y otras metamorfizadas en orogenias recientes.",
    facts: [
      "Como resiste muy bien la erosión, la cuarcita suele formar crestas y acantilados destacados.",
      "Es más dura que el acero y raya el vidrio con facilidad.",
      "A veces las marcas de ondulación de la arenisca original sobreviven al metamorfismo y se ven en la cuarcita.",
    ],
    properties: [
      { label: "Mineral principal", value: "Cuarzo (SiO₂)" },
      { label: "Roca original", value: "Arenisca cuarzosa" },
      { label: "Dureza", value: "~7 Mohs" },
      { label: "Densidad", value: "2,6–2,7 g/cm³" },
    ],
    tags: ["cuarzo", "no foliada", "resistente", "cresta"],
  },
  slate: {
    name: "Pizarra",
    aka: "Roca metamórfica de bajo grado",
    summary: "Lutita comprimida en láminas perfectas: la roca que techó el mundo.",
    description:
      "La pizarra es una roca metamórfica oscura y de grano fino que se separa en láminas planas y duraderas a lo largo de un plano llamado esquistosidad pizarrosa. Sus minerales son demasiado pequeños para verlos.",
    formation:
      "Se forma a partir de lutita o argilita con metamorfismo de bajo grado. La presión reorienta los minerales de arcilla en diminutas micas perpendiculares a la compresión, creando un plano de exfoliación que puede cortar la estratificación original.",
    age: "Muchas pizarras famosas, como las de Gales, son del Cámbrico al Ordovícico y se metamorfizaron en antiguas orogenias.",
    facts: [
      "En el siglo XIX, las canteras galesas abastecían de pizarra para tejados a ciudades de todo el mundo.",
      "Las pizarras escolares y las mesas de billar se hacían tradicionalmente de pizarra porque se parte plana y es rígida.",
      "Fósiles como los trilobites pueden conservarse en la pizarra, aunque a menudo aparecen estirados y deformados.",
    ],
    properties: [
      { label: "Roca original", value: "Lutita / argilita" },
      { label: "Foliación", value: "Esquistosidad pizarrosa" },
      { label: "Dureza", value: "~3–4 Mohs" },
      { label: "Densidad", value: "2,7–2,8 g/cm³" },
    ],
    tags: ["tejado", "exfoliación", "foliada", "Gales", "pizarra escolar"],
  },
  phyllite: {
    name: "Filita",
    aka: "Roca foliada sedosa",
    summary: "El paso brillante entre la pizarra y el esquisto.",
    description:
      "La filita es una roca metamórfica foliada con un característico brillo sedoso o satinado, debido a escamas microscópicas de mica blanca. Sus superficies suelen estar finamente arrugadas (crenuladas).",
    formation:
      "Se forma cuando la pizarra soporta temperaturas y presiones algo mayores, y las diminutas micas crecen lo justo para reflejar la luz, pero no lo bastante para verlas una a una.",
    age: "Hay filitas en antiguas cordilleras de muchas edades, allí donde las rocas arcillosas sufrieron un metamorfismo moderado.",
    facts: [
      "Su nombre viene del griego «phyllon», hoja, porque se separa en láminas finas.",
      "Su brillo, llamado «brillo filítico», permite distinguirla rápidamente de la pizarra mate.",
      "Con más calor y presión, la filita se convierte en esquisto, con cristales de mica visibles.",
    ],
    properties: [
      { label: "Roca original", value: "Lutita → pizarra" },
      { label: "Foliación", value: "Fina, a menudo crenulada" },
      { label: "Brillo", value: "Sedoso / satinado" },
      { label: "Dureza", value: "~3–4 Mohs" },
    ],
    tags: ["foliada", "brillo", "mica", "sericita"],
  },
  schist: {
    name: "Esquisto",
    aka: "Roca foliada de grado medio",
    summary: "Roca brillante y escamosa, a menudo salpicada de granates.",
    description:
      "El esquisto es una roca metamórfica foliada con minerales laminares visibles y alineados —sobre todo micas— que la hacen brillar y separarse en escamas. Con frecuencia contiene cristales de granate, estaurolita o cianita.",
    formation:
      "Se forma a partir de rocas arcillosas o volcánicas a temperaturas y presiones moderadas, normalmente a varios o decenas de kilómetros de profundidad en cordilleras en crecimiento.",
    age: "Hay esquistos tanto en cordilleras antiguas como jóvenes. El esquisto de Manhattan, bajo Nueva York, se metamorfizó hace cientos de millones de años, durante el Paleozoico.",
    facts: [
      "Gran parte de los rascacielos de Manhattan se apoya en un sólido sustrato de esquisto cercano a la superficie.",
      "Los minerales índice del esquisto, como el granate y la cianita, indican la temperatura y la presión que soportó la roca.",
      "Su nombre viene del griego «partir», porque se rompe con facilidad a lo largo de su foliación.",
    ],
    properties: [
      { label: "Minerales comunes", value: "Mica, cuarzo, granate" },
      { label: "Foliación", value: "Esquistosidad" },
      { label: "Dureza", value: "Variable (mica ~2,5, granate ~7)" },
      { label: "Densidad", value: "2,7–3,0 g/cm³" },
    ],
    tags: ["granate", "mica", "foliada", "Manhattan", "minerales índice"],
  },
  gneiss: {
    name: "Gneis",
    aka: "Roca bandeada de alto grado",
    summary: "Roca de bandas marcadas forjada en lo profundo de la corteza, incluidas las rocas más antiguas de la Tierra.",
    description:
      "El gneis es una roca metamórfica de grano grueso y alto grado con llamativas bandas alternas de minerales claros (cuarzo, feldespato) y oscuros (biotita, hornblenda).",
    formation:
      "Se forma a altas temperaturas y presiones en lo profundo de la corteza continental, donde los minerales migran y se segregan en bandas. Con aún más calor puede fundirse parcialmente y convertirse en migmatita.",
    age: "Entre los gneises están algunas de las rocas más antiguas de la Tierra: el gneis de Acasta, en el norte de Canadá, tiene unos 4000 millones de años.",
    facts: [
      "El gneis de Acasta está entre las rocas intactas más antiguas que se conocen.",
      "El gneis lewisiano de Escocia, de unos 3000 millones de años, forma algunos de los paisajes más antiguos de Gran Bretaña.",
      "El gneis puede formarse a partir de muchas rocas, como el granito (ortogneis) o rocas sedimentarias (paragneis).",
    ],
    properties: [
      { label: "Minerales comunes", value: "Cuarzo, feldespato, biotita" },
      { label: "Foliación", value: "Bandeado gnéisico" },
      { label: "Dureza", value: "6–7 Mohs" },
      { label: "Densidad", value: "2,6–2,9 g/cm³" },
    ],
    tags: ["bandeada", "alto grado", "Acasta", "roca más antigua", "migmatita"],
  },
};

import type { EntryText } from "../../types";

/** Spanish text for marine and terrestrial fossil entries. */
export const FOSSILS_ES: Record<string, EntryText> = {
  ammonite: {
    name: "Ammonite",
    aka: "Ammonoidea",
    summary: "Parientes de los calamares con concha en espiral que dominaron los mares del Mesozoico.",
    description:
      "Los ammonites (ammonoideos) eran moluscos cefalópodos marinos con conchas enrolladas y divididas en cámaras. Las paredes entre cámaras se unían a la concha formando intrincadas líneas de sutura festoneadas, un rasgo distintivo del grupo.",
    formation:
      "Al morir, la concha del ammonite se hundía en el barro del fondo marino. El aragonito original a menudo se disolvía o era sustituido por calcita o pirita, mientras las cámaras se rellenaban de sedimento o cristales, produciendo moldes internos que muestran las suturas.",
    age: "Los ammonoideos aparecieron en el Devónico Inferior, hace unos 410 millones de años, y los últimos desaparecieron en la extinción de finales del Cretácico, hace 66 millones de años.",
    facts: [
      "Como sus especies evolucionaban rápido y se extendían mucho, los ammonites son excelentes fósiles guía para datar rocas del Jurásico y el Cretácico.",
      "El ammonite más grande conocido, Parapuzosia seppenradensis, tenía una concha de casi 2 metros de diámetro.",
      "Pese a su concha parecida a la del nautilo, los ammonoideos estaban más emparentados con calamares y pulpos.",
    ],
    properties: [
      { label: "Grupo", value: "Mollusca › Cephalopoda › Ammonoidea" },
      { label: "Vivió", value: "~410–66 Ma (Devónico–Cretácico)" },
      { label: "Hábitat", value: "Mar abierto" },
      { label: "Se encuentra en", value: "Caliza, lutita, concreciones" },
    ],
    tags: ["cefalópodo", "espiral", "fósil guía", "Jurásico", "Cretácico", "sutura", "amonita"],
  },
  trilobite: {
    name: "Trilobites",
    aka: "Trilobita",
    summary: "Artrópodos acorazados que recorrieron el fondo marino durante casi 300 millones de años.",
    description:
      "Los trilobites eran artrópodos marinos cuyo duro exoesqueleto se divide a lo largo en tres lóbulos —un eje central flanqueado por dos lóbulos pleurales— y a lo ancho en cabeza (céfalon), tórax segmentado y cola (pigidio).",
    formation:
      "Sus exoesqueletos mineralizados fosilizaban con facilidad. Como los artrópodos actuales, mudaban, así que muchos fósiles de trilobites son mudas y no cuerpos, normalmente conservadas en lutita fina o caliza.",
    age: "Los trilobites aparecieron en el Cámbrico Inferior, hace unos 521 millones de años, y desaparecieron en la extinción masiva de finales del Pérmico, hace unos 252 millones de años.",
    facts: [
      "Se han descrito más de 20 000 especies de trilobites.",
      "Sus ojos compuestos tenían lentes del mineral calcita, de los ojos complejos más antiguos que se conocen.",
      "Muchas especies podían enrollarse como una bola para protegerse, como las cochinillas actuales.",
    ],
    properties: [
      { label: "Grupo", value: "Arthropoda › Trilobita" },
      { label: "Vivió", value: "~521–252 Ma (Cámbrico–Pérmico)" },
      { label: "Hábitat", value: "Fondo marino, de somero a profundo" },
      { label: "Se encuentra en", value: "Lutita, caliza" },
    ],
    tags: ["artrópodo", "Cámbrico", "Paleozoico", "exoesqueleto", "fósil guía", "trilobite"],
  },
  brachiopod: {
    name: "Braquiópodo",
    aka: "Concha lámpara",
    summary: "Filtradores con concha que dominaron los fondos marinos del Paleozoico.",
    description:
      "Los braquiópodos son animales marinos con dos conchas (valvas) de tamaño desigual. Parecen almejas, pero su plano de simetría corta cada valva en lugar de pasar entre ellas, y pertenecen a una rama totalmente distinta del reino animal.",
    formation:
      "Sus robustas conchas de calcita o fosfato quedaban enterradas fácilmente en el sedimento y suelen conservarse enteras o como moldes, a veces en enormes bancos de conchas.",
    age: "Los braquiópodos aparecieron a comienzos del Cámbrico, hace más de 520 millones de años. Alcanzaron su apogeo en el Paleozoico, quedaron diezmados en la extinción de finales del Pérmico y todavía sobreviven.",
    facts: [
      "Hoy viven cientos de especies de braquiópodos, sobre todo en aguas frías o profundas.",
      "Lingula, un braquiópodo actual, se parece muchísimo a parientes que vivieron hace cientos de millones de años.",
      "Su nombre significa «brazo-pie», por una idea errónea antigua sobre su órgano de alimentación.",
    ],
    properties: [
      { label: "Grupo", value: "Brachiopoda" },
      { label: "Vivió", value: "Cámbrico – actualidad (>520 Ma)" },
      { label: "Hábitat", value: "Filtradores del fondo marino" },
      { label: "Se encuentra en", value: "Caliza, lutita" },
    ],
    tags: ["concha", "concha lámpara", "Paleozoico", "filtrador", "parecido a bivalvo"],
  },
  crinoid: {
    name: "Crinoideo",
    aka: "Lirio de mar",
    summary: "Animales con forma de flor cuyos fragmentos de tallo forman calizas enteras.",
    description:
      "Los crinoideos son equinodermos, parientes de las estrellas y los erizos de mar. Muchos tenían un largo tallo de discos apilados (columnales), rematado por un cáliz y brazos plumosos para atrapar partículas de alimento.",
    formation:
      "Al morir, sus esqueletos solían deshacerse en placas y columnales sueltos que se acumulaban en el fondo marino. Los crinoideos fósiles completos son tesoros raros fruto de un enterramiento rápido.",
    age: "Los crinoideos aparecieron en el Ordovícico Inferior, hace unos 485 millones de años, prosperaron en el Paleozoico y todavía viven hoy.",
    facts: [
      "El Misisípico (Carbonífero Inferior) se conoce como la «Edad de los Crinoideos».",
      "Algunas calizas, llamadas encrinitas, están formadas casi por completo por fragmentos de crinoideos.",
      "Antiguamente los columnales fósiles se llamaban «cuentas de San Cuthbert» y se ensartaban como rosarios.",
    ],
    properties: [
      { label: "Grupo", value: "Echinodermata › Crinoidea" },
      { label: "Vivió", value: "Ordovícico – actualidad (~485 Ma)" },
      { label: "Hábitat", value: "Fondo marino, arrecifes" },
      { label: "Se encuentra en", value: "Caliza" },
    ],
    tags: ["lirio de mar", "equinodermo", "columnal", "Carbonífero", "encrinita"],
  },
  "megalodon-tooth": {
    name: "Diente de megalodón",
    aka: "Otodus megalodon",
    summary: "Dientes del mayor tiburón depredador que ha existido.",
    description:
      "El megalodón fue un tiburón gigantesco cuyo esqueleto, de cartílago, casi nunca fosilizó. Sin embargo, sus enormes dientes triangulares y aserrados son fósiles comunes. Sus colores proceden de los minerales absorbidos durante la fosilización.",
    formation:
      "Los tiburones pierden y reponen dientes continuamente durante toda su vida. Los dientes caídos se hundían en los sedimentos del fondo marino, donde los minerales sustituían poco a poco el material original.",
    age: "El megalodón vivió hace aproximadamente entre 23 y 3,6 millones de años, durante el Mioceno y el Plioceno.",
    facts: [
      "Los mayores dientes de megalodón superan los 17 cm de altura oblicua.",
      "Las estimaciones científicas de su longitud corporal varían, normalmente entre unos 15 y 20 metros.",
      "Un solo tiburón puede perder miles de dientes en su vida, por eso son de los fósiles de vertebrados más comunes.",
    ],
    properties: [
      { label: "Grupo", value: "Chondrichthyes › Lamniformes" },
      { label: "Vivió", value: "~23–3,6 Ma (Mioceno–Plioceno)" },
      { label: "Hábitat", value: "Mares cálidos costeros y abiertos" },
      { label: "Se encuentra en", value: "Arenas marinas, capas de fosfato" },
    ],
    tags: ["tiburón", "diente", "Mioceno", "Neógeno", "vertebrado", "megalodon"],
  },
  "fossil-coral": {
    name: "Coral fósil",
    aka: "Corales rugosos, tabulados y escleractinios",
    summary: "Antiguos constructores de arrecifes, algunos conservados como colonias en forma de panal.",
    description:
      "Los corales son animales marinos que construyen esqueletos de carbonato de calcio. Los corales tabulados del Paleozoico, como Favosites, formaban colonias en forma de panal, mientras que los rugosos solían tener forma de cuerno. Los corales arrecifales modernos (escleractinios) aparecieron más tarde.",
    formation:
      "Los esqueletos de coral son robustos y a menudo fosilizan en su posición de vida, conservando a veces arrecifes antiguos enteros dentro de la caliza.",
    age: "Los corales tabulados y rugosos vivieron desde el Ordovícico hasta la extinción de finales del Pérmico (~252 Ma). Los escleractinios aparecieron en el Triásico Medio y construyen los arrecifes actuales.",
    facts: [
      "Las bandas de crecimiento de corales del Devónico sugieren que un año tenía entonces unos 400 días, porque la rotación de la Tierra se ha ido frenando.",
      "La piedra Petoskey, piedra oficial de Michigan, es un coral colonial fósil del Devónico.",
      "Los sistemas de arrecifes del Devónico estuvieron entre los más extensos de la historia de la Tierra.",
    ],
    properties: [
      { label: "Grupo", value: "Cnidaria › Anthozoa" },
      { label: "Vivió", value: "Ordovícico – actualidad" },
      { label: "Hábitat", value: "Mares cálidos, someros y claros" },
      { label: "Se encuentra en", value: "Caliza arrecifal" },
    ],
    tags: ["arrecife", "Favosites", "panal", "Devónico", "Petoskey"],
  },
  belemnite: {
    name: "Belemnites",
    aka: "Belemnitida",
    summary: "Rostros en forma de bala de cazadores extintos parecidos a calamares.",
    description:
      "Los belemnites eran cefalópodos parecidos a calamares. Su parte más conservada es el rostro, una estructura densa de calcita en forma de bala situada en la parte trasera de la concha interna, a menudo translúcida, de color ámbar a marrón.",
    formation:
      "El rostro macizo de calcita resistía la descomposición y fosilizaba con facilidad en barros marinos y calizas; las partes blandas, las bolsas de tinta y los ganchos de los brazos solo se conservan rara vez.",
    age: "Los belemnites vivieron desde el Jurásico Inferior (con posibles precursores del Triásico Superior) hasta la extinción de finales del Cretácico, hace 66 millones de años.",
    facts: [
      "En el folclore se les llamaba «rayos» o «piedras de rayo», porque se creía que caían del cielo durante las tormentas.",
      "Los isótopos de oxígeno de los rostros de belemnites sirven para reconstruir la temperatura de mares antiguos.",
      "El patrón de referencia de isótopos de carbono usado en todo el mundo (PDB) se basó originalmente en un belemnites del Cretácico.",
    ],
    properties: [
      { label: "Grupo", value: "Mollusca › Cephalopoda › Belemnitida" },
      { label: "Vivió", value: "~200–66 Ma (Jurásico–Cretácico)" },
      { label: "Hábitat", value: "Mar abierto" },
      { label: "Se encuentra en", value: "Arcillas marinas, caliza, creta" },
    ],
    tags: ["cefalópodo", "rostro", "piedra de rayo", "Jurásico", "isótopos", "belemnite"],
  },
  "fern-fossil": {
    name: "Helecho fósil",
    aka: "Compresión vegetal",
    summary: "Frondas delicadas de los bosques pantanosos del Carbonífero.",
    description:
      "Las frondas fósiles de tipo helecho están entre los fósiles vegetales más bellos. Suelen aparecer como películas oscuras de carbono o impresiones sobre lutita o dentro de nódulos de hierro, mostrando cada foliolo (pínula).",
    formation:
      "Las hojas que caían en pantanos y lagos quedaban enterradas rápidamente en barro fino. La presión las aplanaba y expulsaba los compuestos volátiles, dejando una fina película de carbono (compresión) o una impresión.",
    age: "Los helechos verdaderos aparecieron en el Devónico, hace unos 390 millones de años. Los fósiles de tipo helecho más famosos proceden de las cuencas carboníferas del Carbonífero (359–299 Ma).",
    facts: [
      "Muchos «helechos» del Carbonífero eran en realidad pteridospermas: plantas con hojas de helecho que se reproducían con semillas.",
      "El yacimiento de Mazon Creek (Illinois) conserva plantas dentro de concreciones de hierro de unos 309 millones de años.",
      "Las esporas de helecho suelen dispararse en las capas de roca justo después de las extinciones masivas, porque los helechos recolonizan rápido la tierra devastada.",
    ],
    properties: [
      { label: "Grupo", value: "Plantae (helechos y pteridospermas)" },
      { label: "Vivió", value: "Devónico – actualidad" },
      { label: "Hábitat", value: "Pantanos, llanuras de inundación, bosques" },
      { label: "Se encuentra en", value: "Lutita, nódulos de hierro, cuencas de carbón" },
    ],
    tags: ["planta", "hoja", "Carbonífero", "pteridosperma", "compresión"],
  },
  "petrified-wood": {
    name: "Madera petrificada",
    aka: "Madera silicificada",
    summary: "Árboles antiguos convertidos en piedra, célula a célula.",
    description:
      "La madera petrificada es madera fósil en la que el material orgánico original se ha rellenado y sustituido por minerales, normalmente sílice (cuarzo, calcedonia u ópalo). Pueden conservarse los anillos de crecimiento e incluso células individuales.",
    formation:
      "Los troncos enterrados rápidamente —a menudo por ceniza volcánica o sedimentos fluviales— se empapaban de agua subterránea rica en sílice disuelta. La sílice precipitaba dentro de las células y sustituía poco a poco la madera.",
    age: "Hay madera fósil desde el Devónico, cuando aparecieron los primeros árboles hace unos 385 millones de años, hasta épocas geológicamente recientes.",
    facts: [
      "El Parque Nacional del Bosque Petrificado (Arizona) conserva troncos del Triásico Superior, de unos 225 millones de años.",
      "Las impurezas de hierro y manganeso dan a la madera petrificada sus rojos, amarillos y negros.",
      "Como es sobre todo cuarzo, la madera petrificada es casi tan dura como él (~7 en la escala de Mohs).",
    ],
    properties: [
      { label: "Composición", value: "Sílice (cuarzo, calcedonia, ópalo)" },
      { label: "Vivió", value: "Devónico – reciente" },
      { label: "Conservación", value: "Permineralización y sustitución" },
      { label: "Dureza", value: "~7 Mohs" },
    ],
    tags: ["árbol", "sílice", "Triásico", "Arizona", "permineralización"],
  },
  "dinosaur-bone": {
    name: "Hueso de dinosaurio",
    aka: "Hueso permineralizado",
    summary: "Huesos rellenos de minerales de los animales que dominaron el Mesozoico.",
    description:
      "El hueso fósil de dinosaurio conserva la forma y a menudo la estructura microscópica del hueso original, mientras sus poros se rellenan de minerales. Los extremos rotos suelen mostrar un interior esponjoso, como un panal.",
    formation:
      "Los huesos enterrados en arenas fluviales, barros de llanura de inundación o depósitos lacustres quedaban empapados por agua subterránea. Minerales como la sílice, la calcita o compuestos de hierro cristalizaban en los poros, y el fósil acababa pesando más que el hueso original.",
    age: "Los dinosaurios aparecieron hace unos 233–230 millones de años, en el Triásico Superior. Los dinosaurios no avianos se extinguieron hace 66 millones de años; las aves son sus descendientes vivos.",
    facts: [
      "Las aves son dinosaurios vivos, descendientes de pequeños terópodos con plumas.",
      "Algunos huesos de dinosaurio están «agatizados», con ágata de colores rellenando las células óseas.",
      "Las láminas delgadas de hueso fósil revelan anillos de crecimiento que permiten estimar la edad de un dinosaurio al morir.",
    ],
    properties: [
      { label: "Grupo", value: "Dinosauria" },
      { label: "Vivió", value: "~233–66 Ma (no avianos)" },
      { label: "Hábitat", value: "Tierra firme: llanuras, desiertos, bosques" },
      { label: "Se encuentra en", value: "Arenisca, argilita" },
    ],
    tags: ["dinosaurio", "hueso", "Jurásico", "Cretácico", "vertebrado", "T. rex"],
  },
  amber: {
    name: "Ámbar con insecto",
    aka: "Resina fosilizada",
    summary: "Cápsulas del tiempo doradas que atrapan insectos con un detalle perfecto.",
    description:
      "El ámbar es resina de árbol fosilizada. La resina pegajosa atrapaba insectos, arañas, fragmentos de plantas y, a veces, pequeños vertebrados, sellándolos con un extraordinario detalle tridimensional.",
    formation:
      "La resina enterrada en el sedimento se endurece lentamente a medida que sus moléculas polimerizan y pierden compuestos volátiles durante millones de años. La resina más joven y no del todo endurecida se llama copal.",
    age: "Se conoce ámbar con diminutos artrópodos atrapados desde el Triásico (~230 Ma). Entre los yacimientos famosos están el ámbar birmano (~99 Ma), el báltico (~45–35 Ma) y el dominicano (~20–15 Ma).",
    facts: [
      "El ámbar flota en agua muy salada porque su densidad es de solo 1,05–1,10 g/cm³.",
      "La palabra «electricidad» viene de «elektron», ámbar en griego, porque se carga al frotarlo.",
      "Pese a las películas, nunca se ha recuperado ADN de dinosaurio del ámbar: el ADN se degrada demasiado rápido.",
    ],
    properties: [
      { label: "Composición", value: "Resina vegetal polimerizada" },
      { label: "Dureza", value: "2–2,5 Mohs" },
      { label: "Densidad", value: "~1,05–1,10 g/cm³" },
      { label: "Inclusiones más antiguas", value: "~230 Ma (Triásico)" },
    ],
    tags: ["resina", "insecto", "báltico", "inclusión", "copal", "gema"],
  },
  "dinosaur-footprint": {
    name: "Huella de dinosaurio",
    aka: "Icnofósil (fósil traza)",
    summary: "Un instante de comportamiento congelado en la piedra.",
    description:
      "Las huellas son icnofósiles: registran una actividad, no un cuerpo. Las huellas de tres dedos solían dejarlas terópodos u ornitópodos, mientras que los saurópodos dejaban enormes huellas redondeadas. Los rastros revelan postura, velocidad y comportamiento gregario.",
    formation:
      "Un dinosaurio caminó sobre barro blando o arena húmeda. La huella se secó y la cubrió suavemente sedimento nuevo, que después se endureció en roca. La erosión puede dejar al descubierto la huella o su contramolde natural.",
    age: "Hay huellas de dinosaurio en rocas desde el Triásico Superior hasta finales del Cretácico (hace unos 230–66 millones de años).",
    facts: [
      "Las huellas tienen sus propios nombres científicos (icnotaxones), como Grallator y Eubrontes, porque rara vez se sabe qué animal exacto las dejó.",
      "La velocidad al caminar se puede estimar a partir de la longitud de la zancada y la altura de la cadera.",
      "En Plagne (Francia), un rastro de saurópodo de unos 150 millones de años se extiende más de 150 metros.",
    ],
    properties: [
      { label: "Tipo", value: "Icnofósil" },
      { label: "Edad", value: "~230–66 Ma" },
      { label: "Ambiente", value: "Costas, llanuras de marea, riberas" },
      { label: "Se encuentra en", value: "Arenisca, limolita, caliza" },
    ],
    tags: ["huella", "icnofósil", "terópodo", "rastro", "dinosaurio"],
  },
};

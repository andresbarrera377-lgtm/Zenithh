import type { EntryText } from "../../types";

/** Spanish text for geological period and era entries. Ages follow the ICS chart. */
export const TIME_ES: Record<string, EntryText> = {
  cambrian: {
    name: "Cámbrico",
    aka: "Era Paleozoica",
    summary: "La «explosión» en la que aparecen casi todos los grandes grupos de animales.",
    description:
      "El Cámbrico abre la Era Paleozoica y el Eón Fanerozoico. En pocas decenas de millones de años, el registro fósil muestra la aparición de la mayoría de los grandes grupos animales, como artrópodos, moluscos, equinodermos y los primeros cordados.",
    formation:
      "Un clima cálido de invernadero y un nivel del mar alto inundaron los márgenes continentales. El supercontinente Gondwana estaba sobre todo en el hemisferio sur, y el oxígeno de los océanos aumentó.",
    age: "Hace 538,8 – 485,4 millones de años",
    facts: [
      "Su nombre viene de Cambria, el nombre latino de Gales, donde se estudiaron sus rocas por primera vez.",
      "Los yacimientos del esquisto de Burgess (~508 Ma) y Chengjiang (~518 Ma) conservan animales cámbricos de cuerpo blando con un detalle exquisito.",
      "Los trilobites se volvieron abundantes y sirven para dividir el tiempo cámbrico.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~53 millones de años" },
      { label: "Vida característica", value: "Trilobites, primeros artrópodos y cordados" },
      { label: "Clima", value: "Cálido de invernadero, nivel del mar alto" },
    ],
    tags: ["explosión cámbrica", "esquisto de Burgess", "trilobites", "Gondwana"],
  },
  ordovician: {
    name: "Ordovícico",
    aka: "Era Paleozoica",
    summary: "Un gran estallido de diversidad marina… que terminó con una glaciación.",
    description:
      "Durante el Gran Evento de Biodiversificación del Ordovícico, la vida marina se diversificó enormemente: braquiópodos, briozoos, crinoideos, graptolitos y nautiloideos gigantes de concha recta llenaron los mares. Las primeras plantas empezaron a colonizar la tierra.",
    formation:
      "Mares someros cubrían gran parte de los continentes. A finales del periodo, Gondwana se desplazó sobre el Polo Sur y una gran glaciación hizo bajar el nivel del mar.",
    age: "Hace 485,4 – 443,8 millones de años",
    facts: [
      "La extinción masiva del Ordovícico Superior, ligada a la glaciación, fue una de las «cinco grandes» y eliminó a la mayoría de las especies marinas.",
      "Las esporas fósiles muestran que plantas emparentadas con las hepáticas ya habían llegado a tierra hace unos 470 millones de años.",
      "Su nombre viene de los ordovicos, una antigua tribu celta de Gales.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~42 millones de años" },
      { label: "Vida característica", value: "Braquiópodos, graptolitos, nautiloideos, crinoideos" },
      { label: "Terminó con", value: "Extinción masiva del Ordovícico Superior" },
    ],
    tags: ["biodiversificación", "glaciación", "graptolito", "extinción masiva"],
  },
  silurian: {
    name: "Silúrico",
    aka: "Era Paleozoica",
    summary: "Los arrecifes se recuperan, se extienden los peces con mandíbula y las plantas se yerguen en tierra.",
    description:
      "Tras la extinción del Ordovícico, los arrecifes de corales y estromatopóridos se reconstruyeron. Los peces con mandíbula se diversificaron, los escorpiones marinos (euriptéridos) cazaban en aguas costeras y en tierra aparecieron las primeras plantas vasculares pequeñas, como Cooksonia.",
    formation:
      "El deshielo de los glaciares elevó el nivel del mar y creó enormes mares cálidos y someros. Los continentes Laurentia y Báltica chocaron y levantaron la cordillera Caledoniana.",
    age: "Hace 443,8 – 419,2 millones de años",
    facts: [
      "Cooksonia, una de las primeras plantas vasculares, medía solo unos centímetros.",
      "Algunos de los primeros animales terrestres, artrópodos parecidos a milpiés, son de esta época.",
      "Su nombre viene de los siluros, una tribu celta de Gales.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~25 millones de años" },
      { label: "Vida característica", value: "Corales arrecifales, euriptéridos, peces con mandíbula" },
      { label: "Clima", value: "Cálido, nivel del mar alto" },
    ],
    tags: ["arrecife", "euriptérido", "Cooksonia", "peces con mandíbula"],
  },
  devonian: {
    name: "Devónico",
    aka: "Era Paleozoica",
    summary: "La Edad de los Peces, cuando aparecieron los primeros bosques y animales de cuatro patas.",
    description:
      "Los peces se diversificaron de forma espectacular, desde placodermos acorazados como Dunkleosteus hasta peces de aletas lobuladas. Algunos de estos dieron origen a los primeros tetrápodos, y los primeros árboles verdaderos formaron bosques. En los mares aparecieron los ammonoideos.",
    formation:
      "El clima cálido favoreció grandes arrecifes. En tierra, las raíces de los primeros bosques aceleraron la meteorización de las rocas y la formación de suelos, cambiando la química del océano y el CO₂ atmosférico.",
    age: "Hace 419,2 – 358,9 millones de años",
    facts: [
      "Tiktaalik, de unos 375 millones de años, combina rasgos de pez y de los primeros animales con extremidades.",
      "Archaeopteris, uno de los primeros árboles verdaderos, podía superar los 10 metros de altura.",
      "Una serie de extinciones en el Devónico Superior arrasó los ecosistemas de arrecife.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~60 millones de años" },
      { label: "Vida característica", value: "Placodermos, peces de aletas lobuladas, primeros tetrápodos" },
      { label: "Terminó con", value: "Extinciones del Devónico Superior" },
    ],
    tags: ["Edad de los Peces", "Tiktaalik", "primeros bosques", "placodermo", "tetrápodo"],
  },
  carboniferous: {
    name: "Carbonífero",
    aka: "Era Paleozoica",
    summary: "Bosques pantanosos de carbón, insectos gigantes y los primeros reptiles.",
    description:
      "Enormes pantanos tropicales dominados por licopodios del tamaño de árboles (Lepidodendron), equisetos y pteridospermas produjeron la turba que se convirtió en gran parte del carbón del mundo. Aparecieron artrópodos gigantes y los primeros amniotas, los reptiles primitivos.",
    formation:
      "Los continentes se estaban uniendo en Pangea. Un oxígeno atmosférico muy alto, quizá por encima del 30 %, coincidió con los insectos gigantes, mientras empezaba una larga glaciación en el hemisferio sur.",
    age: "Hace 358,9 – 298,9 millones de años",
    facts: [
      "Los meganeuros, como Meganeura, tenían alas de unos 70 cm de envergadura.",
      "Arthropleura, un pariente de los milpiés, superaba los 2 metros de longitud.",
      "En Norteamérica el periodo se divide en los subperiodos Misisípico y Pensilvánico.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~60 millones de años" },
      { label: "Vida característica", value: "Bosques de carbón, insectos gigantes, primeros reptiles" },
      { label: "Clima", value: "Pantanos tropicales; glaciación austral" },
    ],
    tags: ["carbón", "pantano", "Meganeura", "insectos gigantes", "Pangea"],
  },
  permian: {
    name: "Pérmico",
    aka: "Era Paleozoica",
    summary: "La era de Pangea, que terminó con la mayor extinción de todas.",
    description:
      "Con los continentes unidos en Pangea, el interior se volvió cálido y seco. Los sinápsidos —el linaje que lleva a los mamíferos— dominaron la tierra, desde Dimetrodon con su vela dorsal hasta los terápsidos posteriores, mientras se extendían las coníferas.",
    formation:
      "El supercontinente se extendía de polo a polo y creaba climas extremos. Al final del periodo, enormes erupciones volcánicas en Siberia liberaron cantidades gigantescas de CO₂.",
    age: "Hace 298,9 – 251,902 millones de años",
    facts: [
      "La extinción de finales del Pérmico, la «Gran Mortandad», acabó con la gran mayoría de las especies marinas: la peor crisis de la historia de la vida.",
      "Los trilobites y los corales tabulados y rugosos del Paleozoico desaparecieron en esa extinción.",
      "Su nombre viene de la región rusa de Perm.",
    ],
    properties: [
      { label: "Era", value: "Paleozoica" },
      { label: "Duración", value: "~47 millones de años" },
      { label: "Vida característica", value: "Sinápsidos, coníferas, flora de Glossopteris" },
      { label: "Terminó con", value: "Extinción masiva del final del Pérmico" },
    ],
    tags: ["Pangea", "Gran Mortandad", "Dimetrodon", "Traps siberianos"],
  },
  triassic: {
    name: "Triásico",
    aka: "Era Mesozoica",
    summary: "La vida se reconstruye y aparecen los primeros dinosaurios y mamíferos.",
    description:
      "Tras la Gran Mortandad, los ecosistemas se recuperaron lentamente. En tierra aparecieron los primeros dinosaurios, pterosaurios y animales parecidos a mamíferos; en el mar nadaban los ictiosaurios y los corales de tipo moderno empezaron a construir arrecifes.",
    formation:
      "Pangea seguía unida, con un clima cálido y en gran parte árido. Hacia el final del periodo empezó a fracturarse, acompañada de enormes erupciones volcánicas.",
    age: "Hace 251,902 – 201,4 millones de años",
    facts: [
      "Los primeros dinosaurios, como Eoraptor y Herrerasaurus, vivieron hace unos 233–230 millones de años.",
      "El nombre alude a una división en tres de las capas de roca en Alemania.",
      "La extinción de finales del Triásico dejó vía libre a los dinosaurios para dominar el Jurásico.",
    ],
    properties: [
      { label: "Era", value: "Mesozoica" },
      { label: "Duración", value: "~50 millones de años" },
      { label: "Vida característica", value: "Primeros dinosaurios, pterosaurios, ictiosaurios" },
      { label: "Terminó con", value: "Extinción del final del Triásico" },
    ],
    tags: ["primeros dinosaurios", "Pangea", "recuperación", "ictiosaurio"],
  },
  jurassic: {
    name: "Jurásico",
    aka: "Era Mesozoica",
    summary: "Saurópodos gigantes, las primeras aves y mares llenos de ammonites.",
    description:
      "Los dinosaurios dominaban la tierra, incluidos los gigantescos saurópodos de cuello largo, los estegosaurios con placas y grandes depredadores como Allosaurus. Aparecieron las primeras aves y los mares rebosaban de ammonites, belemnites y reptiles marinos.",
    formation:
      "Pangea se fragmentó y empezó a abrirse el océano Atlántico. El clima era cálido y húmedo, sin grandes casquetes polares, y mares someros inundaban los continentes.",
    age: "Hace 201,4 – 145,0 millones de años",
    facts: [
      "Archaeopteryx, un ave primitiva con plumas y dientes, se conserva en la fina caliza de Solnhofen (Alemania, ~150 Ma).",
      "El periodo debe su nombre a los montes Jura, en la frontera entre Francia y Suiza.",
      "Saurópodos como Diplodocus podían superar los 25 metros de longitud.",
    ],
    properties: [
      { label: "Era", value: "Mesozoica" },
      { label: "Duración", value: "~56 millones de años" },
      { label: "Vida característica", value: "Saurópodos, primeras aves, ammonites" },
      { label: "Clima", value: "Cálido de invernadero, sin hielo polar" },
    ],
    tags: ["dinosaurio", "Archaeopteryx", "saurópodo", "ammonite", "Atlántico"],
  },
  cretaceous: {
    name: "Cretácico",
    aka: "Era Mesozoica",
    summary: "Florecen las flores y reina el T. rex… hasta que cae un asteroide.",
    description:
      "Aparecieron y se extendieron las plantas con flor, transformando los paisajes. Dinosaurios icónicos como Tyrannosaurus y Triceratops vivieron cerca de su final, junto a los mosasaurios en los mares. El nivel del mar alto depositó gruesas capas de creta.",
    formation:
      "Los continentes siguieron separándose y el nivel del mar fue de los más altos de la historia de la Tierra, inundando el interior de los continentes. El periodo terminó con el impacto del asteroide de Chicxulub, en el actual México.",
    age: "Hace 145,0 – 66,0 millones de años",
    facts: [
      "La extinción de finales del Cretácico eliminó cerca de tres cuartas partes de las especies, incluidos todos los dinosaurios no avianos y los ammonites.",
      "Una fina capa de arcilla enriquecida en iridio marca el impacto en todo el mundo.",
      "Su nombre viene de «creta», tiza en latín.",
    ],
    properties: [
      { label: "Era", value: "Mesozoica" },
      { label: "Duración", value: "~79 millones de años" },
      { label: "Vida característica", value: "T. rex, plantas con flor, mosasaurios" },
      { label: "Terminó con", value: "Impacto de Chicxulub (extinción K–Pg)" },
    ],
    tags: ["T. rex", "creta", "Chicxulub", "plantas con flor", "K-Pg"],
  },
  paleogene: {
    name: "Paleógeno",
    aka: "Era Cenozoica",
    summary: "Los mamíferos surgen de las cenizas del mundo de los dinosaurios.",
    description:
      "Desaparecidos los dinosaurios, los mamíferos se diversificaron rápidamente en muchas formas nuevas, como los primeros primates, los caballos y las ballenas, que evolucionaron a partir de antepasados terrestres. Las aves también se diversificaron.",
    formation:
      "El periodo comenzó muy cálido, con un máximo en el Máximo Térmico del Paleoceno-Eoceno, hace unos 56 millones de años. La India chocó con Asia e inició el Himalaya, y la Antártida desarrolló casquetes de hielo hace unos 34 millones de años.",
    age: "Hace 66,0 – 23,03 millones de años",
    facts: [
      "Las ballenas evolucionaron a partir de mamíferos terrestres de cuatro patas en unos 10 millones de años.",
      "El pozo de Messel (Alemania, ~47 Ma) conserva mamíferos, aves e insectos con piel, pelo y contenido estomacal.",
      "Gran parte del famoso ámbar báltico se formó durante este periodo.",
    ],
    properties: [
      { label: "Era", value: "Cenozoica" },
      { label: "Duración", value: "~43 millones de años" },
      { label: "Vida característica", value: "Primeros mamíferos modernos, primates, ballenas primitivas" },
      { label: "Clima", value: "De invernadero extremo a nevera" },
    ],
    tags: ["mamíferos", "PETM", "evolución de las ballenas", "Himalaya", "Messel"],
  },
  neogene: {
    name: "Neógeno",
    aka: "Era Cenozoica",
    summary: "Se extienden las praderas, caza el megalodón y nuestros antepasados se ponen de pie.",
    description:
      "Las praderas se expandieron por los continentes, favoreciendo a mamíferos herbívoros como los caballos. El megalodón patrullaba los océanos y en África aparecieron los primeros homininos, el linaje que lleva a los humanos.",
    formation:
      "El clima se enfrió y se secó. Se formó el istmo de Panamá, que unió las Américas y cambió las corrientes oceánicas, y el Mediterráneo se secó temporalmente durante la crisis salina del Messiniense.",
    age: "Hace 23,03 – 2,58 millones de años",
    facts: [
      "Hace unos 6–5,3 millones de años el mar Mediterráneo casi se secó y dejó gruesos depósitos de sal.",
      "«Lucy», un famoso esqueleto de Australopithecus afarensis, tiene unos 3,2 millones de años.",
      "El cierre del istmo de Panamá permitió un gran intercambio de animales entre Norteamérica y Sudamérica.",
    ],
    properties: [
      { label: "Era", value: "Cenozoica" },
      { label: "Duración", value: "~20 millones de años" },
      { label: "Vida característica", value: "Herbívoros de pradera, megalodón, primeros homininos" },
      { label: "Clima", value: "Enfriamiento y aridez" },
    ],
    tags: ["Mioceno", "Plioceno", "megalodón", "hominino", "praderas"],
  },
  quaternary: {
    name: "Cuaternario",
    aka: "Era Cenozoica",
    summary: "Las glaciaciones, los mamuts… y los humanos modernos.",
    description:
      "El periodo actual se define por la repetición de ciclos glaciales e interglaciales. Mamuts lanudos, osos cavernarios y tigres dientes de sable recorrían la tierra; evolucionó el género Homo y Homo sapiens se extendió por todo el planeta.",
    formation:
      "Los casquetes de hielo avanzaron y retrocedieron muchas veces, impulsados por cambios cíclicos en la órbita terrestre. En el Último Máximo Glacial, hace unos 20 000 años, el nivel del mar estaba unos 120 metros por debajo del actual.",
    age: "Hace 2,58 millones de años – actualidad",
    facts: [
      "El Holoceno, nuestro interglacial actual, empezó hace unos 11 700 años.",
      "Los fósiles de Homo sapiens más antiguos conocidos, de Jebel Irhoud (Marruecos), tienen unos 300 000 años.",
      "Muchos grandes mamíferos, como los mamuts lanudos, desaparecieron al final de la última glaciación.",
    ],
    properties: [
      { label: "Era", value: "Cenozoica" },
      { label: "Duración", value: "2,58 millones de años (en curso)" },
      { label: "Vida característica", value: "Mamuts, Homo sapiens" },
      { label: "Clima", value: "Ciclos glaciales e interglaciales" },
    ],
    tags: ["glaciación", "mamut", "Holoceno", "Pleistoceno", "humanos"],
  },
  precambrian: {
    name: "Precámbrico",
    aka: "Eones Hádico, Arcaico y Proterozoico",
    summary: "Casi el 90 % de la historia de la Tierra, desde su nacimiento hasta los primeros animales.",
    description:
      "Precámbrico es el nombre informal de todo el tiempo anterior al Cámbrico. Abarca la formación de la Tierra, los primeros océanos y continentes, el origen de la vida, el aumento del oxígeno y los primeros organismos pluricelulares.",
    formation:
      "La Tierra se formó hace unos 4570 millones de años. Los microbios transformaron el planeta: las cianobacterias liberaron oxígeno y desencadenaron la Gran Oxidación hace unos 2400 millones de años, y el planeta pudo congelarse por completo durante los episodios de «Tierra bola de nieve».",
    age: "Hace ~4567 – 538,8 millones de años",
    facts: [
      "Los cristales de circón de Jack Hills (Australia) tienen unos 4400 millones de años: los fragmentos de la Tierra más antiguos conocidos.",
      "Los estromatolitos, montículos estratificados construidos por microbios, son de las pruebas de vida más antiguas, con más de 3400 millones de años.",
      "La biota de Ediacara (~575–539 Ma) incluye algunos de los primeros organismos grandes y complejos.",
    ],
    properties: [
      { label: "Duración", value: "~4000 millones de años" },
      { label: "Parte de la historia terrestre", value: "~88 %" },
      { label: "Hitos", value: "Origen de la vida, Gran Oxidación, Tierra bola de nieve" },
      { label: "Fósiles típicos", value: "Estromatolitos, organismos de Ediacara" },
    ],
    tags: ["Hádico", "Arcaico", "Proterozoico", "estromatolito", "origen de la vida", "Ediacárico"],
  },
  paleozoic: {
    name: "Era Paleozoica",
    aka: "«Vida antigua»",
    summary: "De la explosión cámbrica a la Gran Mortandad.",
    description:
      "En el Paleozoico la vida se diversificó en los océanos y luego conquistó la tierra: aparecieron los peces, las plantas terrestres, los insectos, los anfibios y los reptiles. Incluye seis periodos, del Cámbrico al Pérmico.",
    formation:
      "Los continentes se desplazaron y acabaron uniéndose en el supercontinente Pangea. Se alternaron varias glaciaciones y épocas de invernadero.",
    age: "Hace 538,8 – 251,902 millones de años",
    facts: [
      "Su nombre significa «vida antigua» en griego.",
      "Empezó con la explosión cámbrica y terminó con la extinción masiva del final del Pérmico, la mayor de la historia de la Tierra.",
      "Los trilobites vivieron durante casi toda la era.",
    ],
    properties: [
      { label: "Periodos", value: "Cámbrico → Pérmico (6)" },
      { label: "Duración", value: "~287 millones de años" },
      { label: "Vida característica", value: "Trilobites, braquiópodos, primeros peces, bosques de carbón" },
      { label: "Terminó con", value: "Extinción del final del Pérmico" },
    ],
    tags: ["vida antigua", "Pangea", "trilobites", "Gran Mortandad", "Paleozoico"],
  },
  mesozoic: {
    name: "Era Mesozoica",
    aka: "«Vida media», la Edad de los Reptiles",
    summary: "La era de los dinosaurios, entre dos extinciones masivas.",
    description:
      "El Mesozoico es famoso por los dinosaurios, pero también vio los primeros mamíferos, aves y plantas con flor, y mares dominados por reptiles marinos y ammonites. Comprende el Triásico, el Jurásico y el Cretácico.",
    formation:
      "Pangea se fragmentó y se abrió el océano Atlántico. El clima fue en general cálido, con poco o ningún hielo polar durante largos intervalos.",
    age: "Hace 251,902 – 66,0 millones de años",
    facts: [
      "Su nombre significa «vida media».",
      "Empezó tras la extinción del final del Pérmico y terminó con el impacto de Chicxulub.",
      "Los ammonites son tan útiles para datar sus rocas que el tiempo mesozoico se divide en zonas de ammonites.",
    ],
    properties: [
      { label: "Periodos", value: "Triásico, Jurásico, Cretácico" },
      { label: "Duración", value: "~186 millones de años" },
      { label: "Vida característica", value: "Dinosaurios, ammonites, reptiles marinos" },
      { label: "Terminó con", value: "Extinción K–Pg" },
    ],
    tags: ["dinosaurios", "Edad de los Reptiles", "ammonites", "fragmentación de Pangea", "Mesozoico"],
  },
  cenozoic: {
    name: "Era Cenozoica",
    aka: "«Vida nueva», la Edad de los Mamíferos",
    summary: "La era de los mamíferos, desde el fin de los dinosaurios hasta hoy.",
    description:
      "En el Cenozoico, mamíferos y aves se diversificaron para ocupar los nichos que dejaron los dinosaurios, se extendieron las praderas y evolucionaron los humanos. Incluye el Paleógeno, el Neógeno y el Cuaternario.",
    formation:
      "Los continentes se movieron hacia sus posiciones actuales, se levantaron los Alpes y el Himalaya, y el clima terrestre se enfrió desde un invernadero extremo hasta las glaciaciones.",
    age: "Hace 66,0 millones de años – actualidad",
    facts: [
      "Su nombre significa «vida nueva».",
      "El Himalaya, que todavía crece, empezó a formarse cuando la India chocó con Asia hace unos 50 millones de años.",
      "Todos los humanos que han existido pertenecen a la última y diminuta fracción de esta era.",
    ],
    properties: [
      { label: "Periodos", value: "Paleógeno, Neógeno, Cuaternario" },
      { label: "Duración", value: "66 millones de años (en curso)" },
      { label: "Vida característica", value: "Mamíferos, aves, gramíneas, humanos" },
      { label: "Clima", value: "Enfriamiento hacia las glaciaciones" },
    ],
    tags: ["mamíferos", "Edad de los Mamíferos", "glaciaciones", "Himalaya", "humanos", "Cenozoico"],
  },
};

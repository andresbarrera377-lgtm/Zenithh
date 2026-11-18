import type { EntryText } from "../../types";

/** Spanish text for mineral entries. */
export const MINERALS_ES: Record<string, EntryText> = {
  quartz: {
    name: "Cuarzo",
    aka: "SiO₂",
    summary: "El mineral duro y vítreo presente en innumerables rocas, arenas y gemas.",
    description:
      "El cuarzo es dióxido de silicio, uno de los minerales más abundantes de la corteza continental. Forma prismas de seis caras rematados por pirámides, tiene brillo vítreo, no tiene exfoliación y se rompe con fractura concoidea.",
    formation:
      "Cristaliza a partir de magmas ricos en sílice (como en el granito), de fluidos hidrotermales calientes en vetas y geodas, y durante el metamorfismo. Su resistencia a la meteorización lo convierte en el componente principal de casi toda la arena.",
    age: "El cuarzo se forma continuamente y aparece en rocas de todas las edades; sus cristales pueden crecer en pocos años en un laboratorio o durante millones de años en la naturaleza.",
    facts: [
      "El cuarzo es piezoeléctrico —genera un pequeño voltaje al comprimirlo—, por eso marca el tiempo en los relojes de cuarzo.",
      "La amatista, el citrino, el cuarzo rosa, el cuarzo ahumado, el ágata y el jaspe son variedades de cuarzo.",
      "Define el 7 de la escala de Mohs y raya el vidrio con facilidad.",
    ],
    properties: [
      { label: "Fórmula", value: "SiO₂" },
      { label: "Dureza", value: "7 Mohs" },
      { label: "Densidad", value: "2,65 g/cm³" },
      { label: "Sistema cristalino", value: "Trigonal (prismas hexagonales)" },
    ],
    tags: ["sílice", "cristal", "amatista", "ágata", "arena", "geoda"],
  },
  feldspar: {
    name: "Feldespato",
    aka: "Ortoclasa y plagioclasa",
    summary: "El grupo de minerales más abundante de la corteza terrestre.",
    description:
      "Los feldespatos son silicatos de aluminio con potasio, sodio o calcio. La ortoclasa (feldespato potásico) suele ser rosa o salmón; la plagioclasa, de blanca a gris. Ambos se rompen según dos planos de exfoliación casi en ángulo recto.",
    formation:
      "Los feldespatos cristalizan a partir del magma en la mayoría de las rocas ígneas y crecen durante el metamorfismo. En superficie se meteorizan lentamente y se transforman en minerales de arcilla como la caolinita.",
    age: "Los feldespatos se forman continuamente y aparecen en rocas de todas las edades.",
    facts: [
      "Los feldespatos forman aproximadamente el 40 % en peso de la corteza continental.",
      "La ortoclasa define el 6 de la escala de Mohs.",
      "La piedra de luna y la labradorita, con sus reflejos ópticos, son variedades gema del feldespato.",
    ],
    properties: [
      { label: "Fórmula", value: "KAlSi₃O₈ – (Na,Ca)(Al,Si)₄O₈" },
      { label: "Dureza", value: "6–6,5 Mohs" },
      { label: "Densidad", value: "2,55–2,76 g/cm³" },
      { label: "Exfoliación", value: "Dos direcciones, ~90°" },
    ],
    tags: ["ortoclasa", "plagioclasa", "silicato", "arcilla", "piedra de luna", "labradorita"],
  },
  calcite: {
    name: "Calcita",
    aka: "CaCO₃",
    summary: "El mineral efervescente de las conchas, la caliza y el mármol.",
    description:
      "La calcita es carbonato de calcio. Se exfolia en romboedros perfectos según tres direcciones, burbujea con ácido diluido y sus cristales transparentes muestran una fuerte doble refracción: todo lo que se ve a través de ellos aparece duplicado.",
    formation:
      "Se forma a partir del agua de mar a través de conchas y esqueletos de organismos, precipita en las cuevas como estalactitas y estalagmitas, y recristaliza durante el metamorfismo formando mármol.",
    age: "La calcita se forma continuamente, desde antiguos depósitos marinos hasta espeleotemas que crecen hoy.",
    facts: [
      "La calcita transparente, llamada espato de Islandia, desdobla una imagen en dos.",
      "Define el 3 de la escala de Mohs: una moneda de cobre apenas la raya.",
      "La mayor parte de la caliza y el mármol del mundo está hecha de calcita.",
    ],
    properties: [
      { label: "Fórmula", value: "CaCO₃" },
      { label: "Dureza", value: "3 Mohs" },
      { label: "Densidad", value: "2,71 g/cm³" },
      { label: "Exfoliación", value: "Romboédrica perfecta" },
    ],
    tags: ["carbonato", "espato de Islandia", "doble refracción", "estalactita", "prueba del ácido"],
  },
  mica: {
    name: "Mica (moscovita)",
    aka: "Filosilicato",
    summary: "Un mineral que se separa en láminas finas, flexibles y transparentes.",
    description:
      "Las micas son filosilicatos con exfoliación perfecta en una dirección, así que se separan en escamas extremadamente finas y flexibles. La moscovita es de transparente a plateada; la biotita, de marrón oscuro a negra.",
    formation:
      "Las micas cristalizan en granitos y pegmatitas y crecen en abundancia durante el metamorfismo, dando su brillo al esquisto y la filita.",
    age: "Las micas se forman continuamente y aparecen en rocas ígneas y metamórficas de todas las edades.",
    facts: [
      "Las láminas de moscovita se usaron como cristales de ventana, el «vidrio de Moscovia», origen de su nombre.",
      "La mica es un excelente aislante eléctrico y resiste altas temperaturas.",
      "Es tan blanda (2–2,5 Mohs) que se raya con la uña.",
    ],
    properties: [
      { label: "Fórmula (moscovita)", value: "KAl₂(AlSi₃O₁₀)(OH)₂" },
      { label: "Dureza", value: "2–2,5 Mohs" },
      { label: "Densidad", value: "2,76–2,88 g/cm³" },
      { label: "Exfoliación", value: "Perfecta, una dirección" },
    ],
    tags: ["moscovita", "biotita", "lámina", "esquisto", "aislante"],
  },
  pyrite: {
    name: "Pirita",
    aka: "Oro de los tontos (FeS₂)",
    summary: "Cubos dorados que llevan siglos engañando a los buscadores de oro.",
    description:
      "La pirita es sulfuro de hierro con un intenso brillo metálico amarillo latón. Suele formar cubos estriados o piritoedros. A diferencia del oro, es dura y frágil, y deja una raya negra verdosa.",
    formation:
      "Se forma en sedimentos pobres en oxígeno (donde las bacterias producen sulfuro), en vetas hidrotermales y en rocas metamórficas. En el barro puede reemplazar conchas y producir brillantes fósiles piritizados.",
    age: "La pirita se forma en rocas de todas las edades, desde antiguos sedimentos arcaicos hasta barros marinos actuales.",
    facts: [
      "Su nombre viene del griego «pyr», fuego, porque saca chispas al golpearla contra el acero.",
      "En Navajún (La Rioja, España) se encuentran cubos naturales casi perfectos.",
      "Los ammonites piritizados pueden degradarse lentamente con la humedad, un problema que los coleccionistas llaman «enfermedad de la pirita».",
    ],
    properties: [
      { label: "Fórmula", value: "FeS₂" },
      { label: "Dureza", value: "6–6,5 Mohs" },
      { label: "Densidad", value: "4,9–5,2 g/cm³" },
      { label: "Raya", value: "Negra verdosa" },
    ],
    tags: ["oro de los tontos", "sulfuro", "cubo", "metálico", "fósil piritizado"],
  },
  hematite: {
    name: "Hematites",
    aka: "Fe₂O₃",
    summary: "El óxido de hierro que tiñe de rojo las rocas… y Marte.",
    description:
      "La hematites es óxido de hierro y la mena de hierro más importante. Va del gris acero metálico al rojo terroso, pero siempre deja una raya pardo rojiza. Sus formas redondeadas en «riñón» (botroidales) son muy apreciadas por los coleccionistas.",
    formation:
      "Se forma cuando los minerales con hierro se oxidan, precipita del agua en cuencas sedimentarias y constituye gran parte de las antiguas formaciones de hierro bandeado.",
    age: "La hematites aparece en rocas de todas las edades; las enormes formaciones de hierro bandeado se formaron sobre todo hace unos 2500–1800 millones de años.",
    facts: [
      "Su nombre viene del griego «haima», sangre, por su raya roja.",
      "En 2004, el róver Opportunity de la NASA encontró en Marte pequeñas esferas de hematites, apodadas «arándanos», prueba de agua en el pasado.",
      "El ocre rojo, uno de los pigmentos más antiguos usados por los humanos, es en gran parte hematites.",
    ],
    properties: [
      { label: "Fórmula", value: "Fe₂O₃" },
      { label: "Dureza", value: "5–6,5 Mohs" },
      { label: "Densidad", value: "~5,3 g/cm³" },
      { label: "Raya", value: "Pardo rojiza" },
    ],
    tags: ["mena de hierro", "óxido", "rojo", "Marte", "botroidal", "ocre", "hematita"],
  },
  olivine: {
    name: "Olivino",
    aka: "(Mg,Fe)₂SiO₄",
    summary: "El mineral verde que forma gran parte del manto superior terrestre.",
    description:
      "El olivino es un silicato de magnesio y hierro de color verde oliva y brillo vítreo, que suele aparecer en granos más que en cristales grandes. El olivino de calidad gema se llama peridoto.",
    formation:
      "Es el mineral principal de la peridotita, la roca del manto superior, y cristaliza pronto a partir del magma basáltico. A veces las erupciones volcánicas traen olivino del manto a la superficie.",
    age: "El olivino se forma continuamente en el manto y en magmas máficos; también aparece en meteoritos tan antiguos como el Sistema Solar (~4570 millones de años).",
    facts: [
      "Se cree que el olivino es el mineral más abundante del manto superior.",
      "La playa de Papakōlea, en Hawái, debe su arena verde a cristales de olivino erosionados de rocas volcánicas.",
      "Los meteoritos palasitos contienen cristales de olivino de aspecto gema incrustados en metal de hierro y níquel.",
    ],
    properties: [
      { label: "Fórmula", value: "(Mg,Fe)₂SiO₄" },
      { label: "Dureza", value: "6,5–7 Mohs" },
      { label: "Densidad", value: "3,2–4,4 g/cm³" },
      { label: "Brillo", value: "Vítreo" },
    ],
    tags: ["peridoto", "manto", "peridotita", "arena verde", "meteorito"],
  },
  gypsum: {
    name: "Yeso",
    aka: "CaSO₄·2H₂O",
    summary: "Un mineral evaporítico blando que puede formar cristales gigantes.",
    description:
      "El yeso es sulfato de calcio hidratado, tan blando que se raya con la uña. Sus variedades incluyen la selenita transparente, el espejuelo fibroso, el alabastro de grano fino y las «rosas del desierto» en forma de roseta.",
    formation:
      "Precipita cuando se evapora el agua de mar o de lagos salados, formando gruesos estratos de evaporitas. También puede crecer en cuevas y arcillas.",
    age: "El yeso se forma hoy en salares y se ha formado a lo largo de toda la historia geológica allí donde se secaron cuencas.",
    facts: [
      "Los cristales de selenita de la Cueva de los Cristales de Naica (México) alcanzan unos 11–12 metros de longitud.",
      "Las dunas blanquísimas de White Sands (Nuevo México) son de arena de yeso.",
      "Al calentarlo, el yeso se convierte en escayola, y es el ingrediente principal de las placas de pladur.",
    ],
    properties: [
      { label: "Fórmula", value: "CaSO₄·2H₂O" },
      { label: "Dureza", value: "2 Mohs" },
      { label: "Densidad", value: "~2,3 g/cm³" },
      { label: "Variedades", value: "Selenita, espejuelo, alabastro" },
    ],
    tags: ["evaporita", "selenita", "rosa del desierto", "escayola", "Naica"],
  },
};

import type { EntryText } from "../../types";

/** Spanish text for igneous and sedimentary rock entries. */
export const ROCKS_A_ES: Record<string, EntryText> = {
  granite: {
    name: "Granito",
    aka: "Roca félsica intrusiva",
    summary: "La columna vertebral moteada de los continentes, enfriada lentamente en las profundidades.",
    description:
      "El granito es una roca ígnea de grano grueso formada sobre todo por cuarzo, feldespato alcalino y plagioclasa, con menores cantidades de mica oscura u hornblenda. Sus cristales entrelazados se ven a simple vista y le dan su conocido aspecto de sal y pimienta o moteado rosado.",
    formation:
      "Cristaliza a partir de un magma rico en sílice que se enfría lentamente, a kilómetros bajo la superficie, durante miles a millones de años. Solo aflora después de que la roca que lo cubría se haya levantado y erosionado.",
    age: "El granito se ha formado a lo largo de toda la historia de la Tierra, desde rocas arcaicas de más de 3000 millones de años hasta plutones de apenas unos millones de años. Su edad se mide con precisión mediante la datación radiométrica de sus cristales de circón.",
    facts: [
      "El Half Dome y El Capitan de Yosemite están tallados en rocas graníticas que cristalizaron durante el Cretácico, hace unos 100–85 millones de años.",
      "Muchos granitos son muy ligeramente radiactivos porque contienen potasio, uranio y torio.",
      "El granito es tan común en la corteza continental superior que la composición media de los continentes se parece a la del granito y sus parientes.",
    ],
    properties: [
      { label: "Textura", value: "Grano grueso (fanerítica)" },
      { label: "Sílice (SiO₂)", value: "~70–77 %" },
      { label: "Dureza", value: "6–7 Mohs" },
      { label: "Densidad", value: "2,63–2,75 g/cm³" },
    ],
    tags: ["plutónica", "cuarzo", "feldespato", "encimera", "corteza continental"],
  },
  basalt: {
    name: "Basalto",
    aka: "Roca máfica extrusiva",
    summary: "Roca volcánica oscura que pavimenta el fondo oceánico y los mares de la Luna.",
    description:
      "El basalto es una roca volcánica oscura y de grano fino, rica en hierro y magnesio, formada sobre todo por plagioclasa y piroxeno, a veces con olivino verde. Sus cristales son demasiado pequeños para verlos sin lupa y puede tener burbujas de gas llamadas vesículas.",
    formation:
      "Se forma cuando una lava poco viscosa, generada por la fusión parcial del manto superior, entra en erupción y se enfría rápidamente en superficie: en las dorsales oceánicas, en puntos calientes como Hawái e Islandia y en enormes provincias de basaltos de inundación.",
    age: "El basalto sigue formándose hoy y lo ha hecho durante toda la historia de la Tierra. Como el fondo oceánico se recicla por subducción, el basalto oceánico más antiguo que sigue en su sitio solo tiene unos 180–200 millones de años (Jurásico).",
    facts: [
      "Las columnas hexagonales de la Calzada del Gigante (Irlanda del Norte) se formaron al enfriarse y contraerse una gruesa colada de lava del Paleógeno hace unos 60–50 millones de años.",
      "Los oscuros «mares» de la Luna son enormes llanuras de basalto que se derramaron hace unos 3000–4000 millones de años.",
      "Los Traps del Decán, en la India, una provincia de basaltos de inundación, entraron en erupción hace unos 66 millones de años, en la época de la extinción de finales del Cretácico.",
    ],
    properties: [
      { label: "Textura", value: "Grano fino (afanítica), puede ser vesicular" },
      { label: "Sílice (SiO₂)", value: "~45–52 %" },
      { label: "Dureza", value: "~6 Mohs" },
      { label: "Densidad", value: "2,8–3,0 g/cm³" },
    ],
    tags: ["volcánica", "lava", "corteza oceánica", "disyunción columnar", "máfica"],
  },
  obsidian: {
    name: "Obsidiana",
    aka: "Vidrio volcánico",
    summary: "Vidrio natural tan afilado que se usó para hacer cuchillas durante miles de años.",
    description:
      "La obsidiana es un vidrio volcánico brillante, normalmente negro, con la composición de una riolita. No tiene ningún cristal, así que se rompe con fracturas concoideas lisas y curvas que producen bordes extremadamente afilados.",
    formation:
      "Se forma cuando una lava muy viscosa y rica en sílice se enfría tan deprisa que los átomos no pueden ordenarse en cristales. Suele aparecer en los bordes de coladas y domos de lava riolítica.",
    age: "El vidrio es inestable a escala geológica: cristaliza lentamente (se desvitrifica). Por eso la mayor parte de la obsidiana es geológicamente joven, y la que supera unas decenas de millones de años es rara.",
    facts: [
      "Los bordes recién fracturados de la obsidiana pueden ser más afilados que un bisturí de acero, y todavía se usan cuchillas de obsidiana en algunas cirugías especializadas.",
      "Los arqueólogos reconstruyen antiguas rutas comerciales relacionando herramientas de obsidiana con la huella química de volcanes concretos.",
      "La «obsidiana copo de nieve» debe sus manchas blancas a grupos de cristales de cristobalita que empezaron a crecer en el vidrio.",
    ],
    properties: [
      { label: "Textura", value: "Vítrea (sin cristales)" },
      { label: "Fractura", value: "Concoidea" },
      { label: "Dureza", value: "5–5,5 Mohs" },
      { label: "Densidad", value: "~2,35–2,6 g/cm³" },
    ],
    tags: ["vidrio", "volcánica", "riolita", "herramientas", "punta de flecha"],
  },
  pumice: {
    name: "Piedra pómez",
    aka: "Vidrio volcánico espumoso",
    summary: "Una roca volcánica tan llena de burbujas que puede flotar en el agua.",
    description:
      "La piedra pómez es un vidrio volcánico claro y extremadamente poroso. Sus paredes son finísimas y encierran innumerables burbujas de gas, así que muchos fragmentos son lo bastante ligeros para flotar hasta que el agua llena sus poros.",
    formation:
      "Se forma en erupciones explosivas de magma rico en gases y en sílice: al ascender el magma, los gases disueltos se expanden de golpe y lo hacen espumar como un refresco agitado antes de congelarse en vidrio.",
    age: "Las erupciones actuales producen piedra pómez y se encuentra en depósitos volcánicos de todas las edades, aunque, como todo vidrio volcánico, la muy antigua suele estar alterada.",
    facts: [
      "Tras algunas erupciones submarinas, «balsas de pómez» de cientos de kilómetros cuadrados flotan a la deriva por el océano durante meses.",
      "Los romanos usaron áridos volcánicos ligeros, entre ellos la pómez, para aligerar la cúpula del Panteón.",
      "Su porosidad puede superar el 80 %, por eso se usa como abrasivo suave y como árido ligero.",
    ],
    properties: [
      { label: "Textura", value: "Vesicular, vítrea" },
      { label: "Porosidad", value: "Hasta ~80–90 %" },
      { label: "Dureza", value: "~6 Mohs (vidrio)" },
      { label: "Densidad aparente", value: "A menudo < 1 g/cm³" },
    ],
    tags: ["volcánica", "roca que flota", "vesículas", "abrasivo"],
  },
  andesite: {
    name: "Andesita",
    aka: "Roca volcánica intermedia",
    summary: "La roca emblemática de los volcanes de zonas de subducción, como los de los Andes.",
    description:
      "La andesita es una roca volcánica gris, de grano fino y composición intermedia. A menudo tiene textura porfídica: cristales grandes y claros de plagioclasa (fenocristales) dentro de una matriz de grano fino.",
    formation:
      "Se forma sobre las zonas de subducción, donde el agua liberada por una placa oceánica que se hunde ayuda a fundir el manto; el magma evoluciona al atravesar la corteza continental y sale por empinados estratovolcanes.",
    age: "La andesita se forma allí donde hay subducción activa y hoy entra en erupción alrededor del Cinturón de Fuego del Pacífico; las andesitas antiguas señalan antiguas zonas de subducción.",
    facts: [
      "Su nombre procede de la cordillera de los Andes, donde abunda.",
      "La «línea andesítica» del Pacífico separa aproximadamente el vulcanismo basáltico de las islas oceánicas del vulcanismo andesítico cercano a los continentes.",
      "Su textura en dos etapas registra un magma que empezó a cristalizar despacio bajo tierra y luego salió y se enfrió deprisa.",
    ],
    properties: [
      { label: "Textura", value: "Grano fino, a menudo porfídica" },
      { label: "Sílice (SiO₂)", value: "~52–63 %" },
      { label: "Dureza", value: "~6 Mohs" },
      { label: "Densidad", value: "2,5–2,8 g/cm³" },
    ],
    tags: ["volcánica", "estratovolcán", "subducción", "Cinturón de Fuego", "pórfido"],
  },
  gabbro: {
    name: "Gabro",
    aka: "Roca máfica intrusiva",
    summary: "El gemelo de enfriamiento lento del basalto, que forma la capa profunda de la corteza oceánica.",
    description:
      "El gabro es una roca ígnea oscura y de grano grueso con la misma composición que el basalto: sobre todo plagioclasa cálcica y piroxeno, a veces con olivino. Es pesado y resistente.",
    formation:
      "Cristaliza lentamente a partir de magma basáltico en cámaras bajo las dorsales oceánicas y en grandes intrusiones dentro de la corteza, donde el enfriamiento es lo bastante lento para que crezcan cristales grandes.",
    age: "El gabro se forma sin cesar bajo las dorsales y lo ha hecho durante toda la historia de la Tierra; intrusiones estratificadas famosas, como el Complejo de Bushveld, tienen unos 2000 millones de años.",
    facts: [
      "Gran parte de la corteza oceánica inferior es gabro, normalmente oculto varios kilómetros bajo el fondo marino.",
      "Las ofiolitas —láminas de corteza oceánica empujadas sobre tierra firme, como en Omán o Chipre— permiten a los geólogos caminar sobre gabro antiguo.",
      "Muchas encimeras de «granito negro» son en realidad gabro o rocas parecidas.",
    ],
    properties: [
      { label: "Textura", value: "Grano grueso (fanerítica)" },
      { label: "Sílice (SiO₂)", value: "~45–52 %" },
      { label: "Dureza", value: "6–7 Mohs" },
      { label: "Densidad", value: "2,9–3,1 g/cm³" },
    ],
    tags: ["plutónica", "corteza oceánica", "ofiolita", "granito negro", "máfica"],
  },
  rhyolite: {
    name: "Riolita",
    aka: "Roca félsica extrusiva",
    summary: "La equivalente volcánica del granito, a menudo veteada por bandas de flujo.",
    description:
      "La riolita es una roca volcánica clara y de grano fino con la misma composición rica en sílice que el granito. Suele ser rosada, gris o parda y con frecuencia muestra delicadas bandas de flujo.",
    formation:
      "Se forma a partir de un magma muy viscoso y rico en gases. Ese magma tiende a entrar en erupción de forma explosiva, produciendo ceniza y pómez, o a salir lentamente como espesos domos de lava.",
    age: "La riolita aparece en regiones volcánicas de todas las edades; algunas de las mayores erupciones de los últimos millones de años, como las de Yellowstone, fueron riolíticas.",
    facts: [
      "Las tres supererupciones que formaron las calderas de Yellowstone (hace unos 2,1, 1,3 y 0,64 millones de años) fueron riolíticas.",
      "Los «huevos de trueno», nódulos redondos rellenos de ágata, suelen formarse dentro de lavas y cenizas riolíticas.",
      "Si la lava riolítica se enfría lo bastante rápido se convierte en obsidiana; si espuma, en piedra pómez.",
    ],
    properties: [
      { label: "Textura", value: "Grano fino, con bandas de flujo" },
      { label: "Sílice (SiO₂)", value: "> ~69 %" },
      { label: "Dureza", value: "~6 Mohs" },
      { label: "Densidad", value: "2,4–2,6 g/cm³" },
    ],
    tags: ["volcánica", "Yellowstone", "félsica", "bandas de flujo", "huevo de trueno"],
  },
  limestone: {
    name: "Caliza",
    aka: "Roca carbonatada",
    summary: "Una roca construida con las conchas de antiguos seres marinos: un clásico para buscar fósiles.",
    description:
      "La caliza es una roca sedimentaria formada sobre todo por calcita (carbonato de calcio). Muchas calizas están repletas de fósiles —conchas, corales, tallos de crinoideos y plancton microscópico— y la roca burbujea con ácido diluido.",
    formation:
      "La mayor parte de la caliza se acumula en mares cálidos, claros y poco profundos, como hoy en las Bahamas, donde los organismos extraen carbonato de calcio del agua para construir esqueletos que se amontonan y se cementan. Una parte se forma por precipitación química directa.",
    age: "Las rocas carbonatadas se remontan a más de 3000 millones de años (como estromatolitos), pero las calizas ricas en fósiles son sobre todo de los últimos 539 millones de años, el Fanerozoico.",
    facts: [
      "La Gran Pirámide de Guiza se construyó en gran parte con caliza del Eoceno llena de numulites, foraminíferos fósiles con forma de moneda.",
      "Las cuevas, las dolinas y los paisajes kársticos se forman donde el agua de lluvia disuelve lentamente la caliza.",
      "Las calizas almacenan enormes cantidades de carbono, por lo que son una pieza clave del ciclo del carbono a largo plazo.",
    ],
    properties: [
      { label: "Mineral principal", value: "Calcita (CaCO₃)" },
      { label: "Dureza", value: "~3 Mohs" },
      { label: "Densidad", value: "2,3–2,7 g/cm³" },
      { label: "Prueba del ácido", value: "Burbujea con HCl diluido" },
    ],
    tags: ["carbonato", "fosilífera", "arrecife", "karst", "cueva", "calcita"],
  },
  sandstone: {
    name: "Arenisca",
    aka: "Roca clástica",
    summary: "Antiguas playas, ríos y desiertos convertidos en piedra, grano a grano.",
    description:
      "La arenisca está formada por granos del tamaño de la arena (0,06–2 mm), normalmente de cuarzo, unidos por cementos naturales como sílice, calcita u óxidos de hierro. Su color —del blanco al rojo intenso— suele deberse al cemento.",
    formation:
      "La arena depositada por el viento, los ríos, las olas o los deltas queda enterrada, se compacta y se cementa con minerales que transporta el agua subterránea. Estructuras sedimentarias como la estratificación cruzada y las marcas de ondulación registran las corrientes que la depositaron.",
    age: "Existen areniscas de todas las edades, desde areniscas cuarzosas precámbricas hasta depósitos de solo unos miles de años. Los fósiles que contienen, o los de capas cercanas, sirven para datarlas.",
    facts: [
      "La antigua ciudad de Petra, en Jordania, está tallada directamente en acantilados de arenisca de colores.",
      "La estratificación cruzada a gran escala conserva las caras de avalancha de dunas desérticas que migraron hace cientos de millones de años.",
      "Por ser porosa, la arenisca es un acuífero importante y una roca almacén habitual de petróleo y gas.",
    ],
    properties: [
      { label: "Tamaño de grano", value: "0,06–2 mm (arena)" },
      { label: "Porosidad", value: "~5–30 %" },
      { label: "Densidad", value: "2,0–2,6 g/cm³" },
      { label: "Dureza", value: "Granos ~7 (cuarzo); la resistencia depende del cemento" },
    ],
    tags: ["clástica", "desierto", "duna", "estratificación cruzada", "cuarzo", "acuífero"],
  },
  shale: {
    name: "Lutita",
    aka: "Roca arcillosa fisible",
    summary: "Barro comprimido que se separa en láminas finas y puede conservar fósiles exquisitos.",
    description:
      "La lutita (o pizarra arcillosa) es una roca de grano fino formada por partículas de arcilla y limo compactadas. Es fisible, es decir, se separa en capas finas, y suele ser gris, negra o rojiza.",
    formation:
      "Se forma donde el barro fino se deposita lentamente en aguas tranquilas —fondos marinos profundos, lagos, lagunas y llanuras de inundación— y luego queda enterrado y compactado. Los fondos pobres en oxígeno pueden conservar materia orgánica y fósiles delicados.",
    age: "Hay lutitas en rocas de todas las edades; algunos de los yacimientos fósiles más famosos, como el esquisto de Burgess, del Cámbrico, son lutitas.",
    facts: [
      "Las rocas arcillosas como la lutita forman aproximadamente dos tercios de todas las rocas sedimentarias.",
      "El esquisto de Burgess, en Canadá (de unos 508 millones de años), conserva animales cámbricos de cuerpo blando con un detalle asombroso.",
      "Las lutitas negras ricas en materia orgánica son la roca madre de la mayor parte del petróleo y el gas natural del mundo.",
    ],
    properties: [
      { label: "Tamaño de grano", value: "< 0,06 mm (arcilla y limo)" },
      { label: "Estructura", value: "Fisible, en láminas finas" },
      { label: "Dureza", value: "~3 Mohs (variable)" },
      { label: "Densidad", value: "2,4–2,8 g/cm³" },
    ],
    tags: ["argilita", "arcilla", "fisible", "esquisto de Burgess", "lutita negra", "fósiles", "shale"],
  },
  conglomerate: {
    name: "Conglomerado",
    aka: "Roca clástica (grava)",
    summary: "Un hormigón natural de cantos rodados arrastrados por aguas poderosas.",
    description:
      "El conglomerado está formado por gravas y cantos redondeados (de más de 2 mm) dentro de una matriz de arena y cemento. Cuando los fragmentos son angulosos en vez de redondeados, la roca se llama brecha.",
    formation:
      "El redondeo de los clastos indica que fueron arrastrados por ríos rápidos o por el oleaje. La grava se acumula en cauces fluviales, abanicos aluviales y playas, y luego queda enterrada y cementada.",
    age: "Hay conglomerados en todo el registro geológico, desde depósitos arcaicos hasta gravas fluviales actuales.",
    facts: [
      "El róver Curiosity de la NASA encontró conglomerado en Marte en 2012, prueba de que allí corrieron arroyos de agua.",
      "Los espectaculares picos de Montserrat, en Cataluña, son de un grueso conglomerado del Eoceno.",
      "En Gran Bretaña, los conglomerados de colores se apodan «puddingstone» porque recuerdan a un pudin de ciruelas.",
    ],
    properties: [
      { label: "Tamaño de clasto", value: "> 2 mm, redondeado" },
      { label: "Matriz", value: "Arena, limo y cemento" },
      { label: "Densidad", value: "2,2–2,7 g/cm³" },
      { label: "Ambiente", value: "Ríos, abanicos aluviales, playas" },
    ],
    tags: ["clástica", "grava", "cantos", "brecha", "pudinga", "Marte"],
  },
  chalk: {
    name: "Creta",
    aka: "Caliza de microfósiles",
    summary: "Roca blanca y blanda hecha de innumerables placas microscópicas de algas.",
    description:
      "La creta es una variedad de caliza blanda, blanca y porosa formada casi por completo por cocolitos, placas microscópicas de calcita que desprenden algas marinas unicelulares. En su interior suelen aparecer nódulos oscuros de sílex.",
    formation:
      "Durante el Cretácico Superior, mares cálidos cubrían gran parte de Europa. Los cocolitos llovieron sobre el fondo marino durante millones de años y formaron capas de cientos de metros de espesor.",
    age: "La mayor parte de la creta clásica se formó en el Cretácico Superior, hace aproximadamente 100–66 millones de años.",
    facts: [
      "El periodo Cretácico debe su nombre a la creta: «creta» significa tiza en latín.",
      "Los acantilados blancos de Dover son de creta del Cretácico Superior, con bandas de nódulos de sílex.",
      "La «tiza» de las pizarras escolares hoy suele fabricarse con yeso o carbonato de calcio, no con creta natural.",
    ],
    properties: [
      { label: "Mineral principal", value: "Calcita (cocolitos)" },
      { label: "Porosidad", value: "Alta (~35–45 %)" },
      { label: "Dureza", value: "Muy blanda, deleznable" },
      { label: "Prueba del ácido", value: "Burbujea con fuerza" },
    ],
    tags: ["cocolito", "Dover", "Cretácico", "sílex", "acantilados blancos", "tiza"],
  },
  coal: {
    name: "Carbón",
    aka: "Roca sedimentaria orgánica",
    summary: "Antiguos bosques pantanosos comprimidos en una roca negra y combustible.",
    description:
      "El carbón es una roca combustible negra o parda formada sobre todo por carbono procedente de restos vegetales. Según aumentan el calor y la presión, pasa del blando lignito a la hulla (carbón bituminoso) y a la dura y brillante antracita.",
    formation:
      "La materia vegetal se acumula en pantanos encharcados donde la falta de oxígeno frena la descomposición y forma turba. El enterramiento durante millones de años compacta y calienta la turba, expulsa agua y gases y concentra el carbono.",
    age: "Los grandes depósitos de carbón se formaron después de que las plantas terrestres se extendieran. Buena parte del carbón del mundo se formó en el Carbonífero (359–299 Ma); también hay depósitos importantes del Pérmico, el Cretácico y el Paleógeno.",
    facts: [
      "El periodo Carbonífero debe literalmente su nombre al carbón.",
      "Hacen falta varios metros de turba para formar un solo metro de carbón.",
      "En las capas de carbón y a su alrededor suelen aparecer hojas, cortezas e incluso troncos de árboles en pie fosilizados de los bosques del Carbonífero.",
    ],
    properties: [
      { label: "Composición", value: "Sobre todo carbono (orgánico)" },
      { label: "Rangos", value: "Lignito → hulla → antracita" },
      { label: "Densidad", value: "1,1–1,5 g/cm³" },
      { label: "Dureza", value: "~1–2,5 Mohs" },
    ],
    tags: ["turba", "antracita", "lignito", "Carbonífero", "pantano", "combustible"],
  },
};

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPA_URL = "https://woktnrwblzqukdojkxlt.supabase.co";
const SUPA_KEY = "sb_publishable_MEqZjUptMyOAoZWyQGIimw_Sa2Sq9p3";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const ESTRUCTURAS = [
  {
    id:"expositivo", cat:"Fuente · Versículo a versículo", nombre:"Expositivo", icono:"📖", color:"#C9912A",
    desc:"Exposición consecutiva de un pasaje completo. Las divisiones nacen del texto mismo, no del predicador.",
    puntos:["Sección 1 del pasaje","Sección 2 del pasaje","Sección 3 del pasaje"],
    flujo:["Contexto histórico","Sección 1","Sección 2","Sección 3","Aplicación final"],
    guia:{intro:"Ubica el pasaje en su contexto histórico y literario. ¿Quién escribió, a quién, en qué situación?",p1:"Primera sección: exégesis fiel + aplicación directa al oyente de hoy.",p2:"Segunda sección: ¿qué dice, qué significa, cómo conecta con lo anterior?",p3:"Tercera sección: clímax o resolución del pasaje. Aquí suele estar la gran idea.",conclusion:"Aplica TODO el pasaje. Resume la gran idea y llama a una respuesta concreta."}
  },
  {
    id:"textual", cat:"Fuente · 1–2 versículos", nombre:"Textual", icono:"✦", color:"#E8B449",
    desc:"Las divisiones del bosquejo nacen directamente de 1 o 2 versículos clave. Clásico en la tradición protestante.",
    puntos:["Primera verdad del texto","Segunda verdad del texto","Tercera verdad del texto"],
    flujo:["Texto central","Análisis del versículo","División en puntos","Ilustración","Aplicación"],
    guia:{intro:"Lee el versículo central. Genera expectativa: ¿qué verdad profunda esconde esta frase?",p1:"Primera verdad que el versículo revela. Exégesis breve + ilustración.",p2:"Segunda verdad: profundiza o contrasta con la primera.",p3:"Tercera verdad: lleva a la acción. El punto de aplicación más fuerte.",conclusion:"Regresa al versículo central. Muestra cómo todo apunta a una sola gran idea."}
  },
  {
    id:"tematico", cat:"Fuente · Multi-texto", nombre:"Temático", icono:"◈", color:"#5A7ED4",
    desc:"Un tema central explorado en múltiples textos bíblicos. Ideal para series y mensajes de ocasión.",
    puntos:["Aspecto 1 del tema","Aspecto 2 del tema","Aspecto 3 del tema"],
    flujo:["Planteamiento del tema","Aspecto 1","Aspecto 2","Aspecto 3","Conclusión temática"],
    guia:{intro:"¿Por qué este tema es urgente HOY para tu congregación específica?",p1:"Primer ángulo del tema. Un texto bíblico clave lo ilumina.",p2:"Segundo ángulo: contraste, profundidad o tensión que resuelve el primero.",p3:"Tercer ángulo: la respuesta bíblica definitiva o la aplicación más práctica.",conclusion:"Reto concreto: ¿qué va a hacer el oyente con este tema esta semana?"}
  },
  {
    id:"textual-tematico", cat:"Fuente · Fusión texto + tema", nombre:"Textual-Temático", icono:"⊗", color:"#A87B3E",
    desc:"Los puntos fluyen tanto del texto como del tema. Muy flexible y el más usado en la práctica pastoral.",
    puntos:["Punto nacido del texto","Punto nacido del tema","Punto de aplicación"],
    flujo:["Texto base","Tema derivado","Punto 1 (texto)","Punto 2 (tema)","Conclusión mixta"],
    guia:{intro:"Presenta tanto el texto como el tema. El oyente sabe qué vamos a explorar y desde dónde.",p1:"Primer punto: nace del texto. Exégesis fiel al pasaje.",p2:"Segundo punto: desarrolla el tema con apoyo de otros textos o ilustraciones.",p3:"Tercer punto: une texto y tema en una aplicación práctica poderosa.",conclusion:"Sintetiza: el texto confirma el tema, el tema ilumina el texto. Llama a decisión."}
  },
  {
    id:"biografico", cat:"Propósito · Personaje bíblico", nombre:"Biográfico", icono:"👤", color:"#8B5CF6",
    desc:"Se construye sobre la vida de un personaje bíblico. Sus virtudes y crisis se convierten en principios eternos.",
    puntos:["Contexto y llamado del personaje","Su crisis o virtud central","El principio eterno que deja"],
    flujo:["Introducción al personaje","Contexto y llamado","Crisis o virtud","Principio eterno","Aplicación personal"],
    guia:{intro:"Presenta al personaje de forma que el oyente se identifique antes de conocer su historia.",p1:"¿Quién era, de dónde venía, cuál era su llamado? Contexto que da peso a lo que viene.",p2:"El momento decisivo: su gran crisis, virtud o fracaso. El corazón del mensaje.",p3:"¿Qué principio eterno extrae su historia para nosotros hoy, 2000 años después?",conclusion:"Aplicación directa: ¿en qué parte de tu vida te identificas con este personaje?"}
  },
  {
    id:"doctrinal", cat:"Propósito · Construcción teológica", nombre:"Doctrinal", icono:"⊕", color:"#6B7280",
    desc:"Desarrolla una doctrina bíblica sistemáticamente. Para congregaciones que necesitan madurez espiritual.",
    puntos:["¿Qué enseña la Biblia?","¿Por qué importa esta doctrina?","¿Cómo vivir esta verdad?"],
    flujo:["Introducción a la doctrina","Base bíblica","Implicaciones teológicas","Aplicación práctica","Reto de vida"],
    guia:{intro:"¿Por qué esta doctrina es urgente y práctica hoy? Empieza con la necesidad, no con definiciones.",p1:"¿Qué dice claramente la Escritura sobre este tema? Base bíblica sólida.",p2:"¿Qué implicaciones tiene para entender a Dios, al ser humano y la salvación?",p3:"¿Cómo transforma concretamente la manera de vivir, pensar y relacionarse?",conclusion:"Un reto de aplicación doctrinal específico para esta semana."}
  },
  {
    id:"evangelistico", cat:"Propósito · Para no creyentes", nombre:"Evangelístico", icono:"✝", color:"#3D8A5E",
    desc:"Diseñado para llevar a personas no creyentes al arrepentimiento. El llamado ES el clímax del mensaje.",
    puntos:["La condición humana sin Dios","La solución en Cristo","La decisión que se requiere"],
    flujo:["Puente con el oyente","El problema del pecado","La solución en Cristo","El costo","El llamado"],
    guia:{intro:"Construye un puente emocional con el oyente antes de hablar de Dios. Parte de su realidad.",p1:"La condición humana: el vacío, la búsqueda, el pecado — sin ser acusatorio.",p2:"La solución: Jesucristo. El evangelio con claridad, sin jerga religiosa.",p3:"La decisión: ¿qué implica seguir a Cristo? Honestidad sin manipulación.",conclusion:"El llamado: claro, directo, sin presión pero sin ambigüedad. Un paso concreto."}
  },
  {
    id:"ocasional", cat:"Propósito · Evento especial", nombre:"De ocasión", icono:"★", color:"#D45858",
    desc:"Para bodas, funerales, bautismos, graduaciones. El tono y el texto se adaptan completamente al evento.",
    puntos:["Significado del evento","La perspectiva bíblica","La bendición o reto específico"],
    flujo:["Saludo y contexto","Significado del evento","Perspectiva bíblica","Bendición o reto","Oración de cierre"],
    guia:{intro:"Reconoce el evento con calidez. Las personas vienen con emociones fuertes — recíbelas primero.",p1:"¿Qué significa este momento en la vida de las personas presentes? Dótalo de peso.",p2:"¿Qué dice la Biblia sobre este tipo de momento? Un texto que hable directo al evento.",p3:"Bendición concreta o reto específico para quienes son protagonistas del evento.",conclusion:"Oración pastoral. Breve, sincera, que recoja todo lo dicho y lo entregue a Dios."}
  },
  {
    id:"tres-puntos", cat:"Estructura · Deductivo clásico", nombre:"Tres Puntos", icono:"⟁", color:"#1D9E75",
    desc:"La tesis se anuncia al inicio y se desarrolla con puntos claros. El formato más enseñado en seminarios del mundo.",
    puntos:["Punto 1","Punto 2","Punto 3"],
    flujo:["Proposición central","Punto 1","Punto 2","Punto 3","Conclusión"],
    guia:{intro:"Anuncia la gran idea desde el inicio. El oyente sabe a dónde vas. Genera expectativa con claridad.",p1:"Primera verdad que sostiene la proposición. Exégesis + ilustración + aplicación parcial.",p2:"Segunda verdad: profundiza, contrasta o amplía la primera.",p3:"Tercera verdad: la de mayor carga de aplicación. Lleva al oyente al umbral de la decisión.",conclusion:"Sintetiza las tres verdades en una sola frase. Llama a una decisión o acción concreta."}
  },
  {
    id:"inductivo", cat:"Estructura · Inductivo", nombre:"Inductivo", icono:"↗", color:"#0EA5E9",
    desc:"Comienza con experiencias particulares del oyente. La gran verdad bíblica emerge solo en la conclusión.",
    puntos:["Experiencia particular 1","Exploración bíblica","La gran idea revelada"],
    flujo:["Experiencia del oyente","Tensión o pregunta","Exploración 1","Exploración 2","Gran idea al final"],
    guia:{intro:"Empieza con una situación o pregunta concreta que el oyente reconoce en su propia vida.",p1:"Primera exploración: ¿por qué las respuestas comunes no funcionan? Generando tensión.",p2:"Segunda exploración: acercarse a la respuesta bíblica sin revelarla todavía.",p3:"Llegada: la Escritura finalmente responde. La gran idea que el oyente ya estaba buscando.",conclusion:"La gran verdad revelada. El oyente la recibe como descubrimiento propio, no como imposición."}
  },
  {
    id:"lowry", cat:"Estructura · Narrativo dramático", nombre:"Lowry Loop", icono:"↺", color:"#D45858",
    desc:"El sermón como trama dramática (Eugene Lowry). De la tensión al evangelio. Ideal para narrativas bíblicas.",
    puntos:["OOPS — La tensión","UGH — El análisis","AHA — El giro","WHEE — El evangelio"],
    flujo:["OOPS: la tensión","UGH: el análisis","AHA: el giro","WHEE: el evangelio","YEAH: consecuencias"],
    guia:{intro:"OOPS — Planta una contradicción o paradoja que el oyente no puede ignorar. Rompe el equilibrio.",p1:"UGH — Profundiza la tensión. ¿Por qué no podemos resolverlo solos?",p2:"AHA — El giro inesperado. Dios irrumpe con una perspectiva que cambia todo.",p3:"WHEE — El evangelio como resolución. La gracia que hace lo que nosotros no podíamos.",conclusion:"YEAH — Las consecuencias de vivir desde esta revelación. La vida que ahora es posible."}
  },
  {
    id:"me-we", cat:"Estructura · Conversacional", nombre:"Me·We·God·You·We", icono:"◎", color:"#0F6E56",
    desc:"Andy Stanley. Un texto, una idea, tono conversacional. Alta conexión con audiencias contemporáneas.",
    puntos:["ME — mi historia personal","WE — nuestra lucha colectiva","GOD — la respuesta bíblica","YOU — tu decisión específica"],
    flujo:["ME: tu historia","WE: la lucha universal","GOD: la Biblia","YOU: tu decisión","WE: visión colectiva"],
    guia:{intro:"ME — Comparte TU historia personal con este tema. Vulnerabilidad auténtica, sin moralizar.",p1:"ME a WE — Conecta tu experiencia con la experiencia universal. 'Todos luchamos con esto.'",p2:"GOD — ¿Qué dice la Biblia? Un solo texto, trabajado en profundidad.",p3:"YOU — Aplicación individual específica. No general: ¿qué vas a hacer TÚ esta semana?",conclusion:"WE — Visión colectiva. ¿Qué sería posible si todos vivieran esta verdad? Termina con esperanza."}
  },
  {
    id:"problema-solucion", cat:"Estructura · Pastoral práctico", nombre:"Problema–Solución", icono:"◉", color:"#F59E0B",
    desc:"Nombra una necesidad real del oyente, profundiza hasta que duele, y revela la respuesta de Dios.",
    puntos:["El problema identificado","La raíz profunda","La solución de Dios"],
    flujo:["Identificar el problema","Agudizar la tensión","La raíz bíblica","La solución de Dios","Pasos concretos"],
    guia:{intro:"Nombra el problema con precisión. El oyente debe decir internamente: 'eso soy yo exactamente.'",p1:"¿Qué es exactamente este problema? Defínelo con claridad. Valida el dolor del oyente.",p2:"¿Cuál es la raíz más profunda? Ve más allá del síntoma hacia la causa espiritual real.",p3:"La respuesta que Dios da a ESTE problema específico. No genérica: concreta y bíblica.",conclusion:"Pasos concretos hacia la solución. El oyente sale con un plan, no solo con inspiración."}
  },
  {
    id:"homilia", cat:"Forma · Comentario seguido", nombre:"Homilía", icono:"Ω", color:"#7A6B52",
    desc:"La forma más antigua de predicación cristiana. Comenta progresivamente una unidad literaria bíblica.",
    puntos:["Comentario sección 1","Comentario sección 2","Comentario sección 3"],
    flujo:["Lectura del texto","Comentario progresivo","Aplicación por sección","Síntesis final"],
    guia:{intro:"Lee el pasaje completo en voz alta. Breve contextualización histórica y literaria.",p1:"Comenta la primera unidad de sentido: ¿qué dice, qué significa, cómo aplica? Todo en uno.",p2:"Segunda unidad de sentido: progresa naturalmente. El comentario fluye con el texto.",p3:"Tercera unidad: lleva el comentario hacia la aplicación más práctica y contemporánea.",conclusion:"Síntesis: ¿qué ha revelado Dios a través de este pasaje hoy? Una sola idea final clara."}
  },
  {
    id:"narrativo", cat:"Forma · Historia como vehículo", nombre:"Narrativo", icono:"▶", color:"#8B5CF6",
    desc:"La narración bíblica es el motor. El predicador no explica la historia, la cuenta de tal manera que el oyente la vive.",
    puntos:["La escena y el conflicto","El clímax de la historia","La resolución y el principio"],
    flujo:["Escena y contexto","El conflicto","La tensión máxima","La resolución","El principio eterno"],
    guia:{intro:"Empieza IN MEDIAS RES — en medio de la acción. No expliques, muestra. Haz que el oyente vea la escena.",p1:"Construye el conflicto. Cada personaje tiene motivaciones. La tensión debe crecer.",p2:"El clímax: el momento de mayor tensión o decisión. Hazlo lento, detallado, cinematográfico.",p3:"La resolución: ¿qué pasa? ¿Qué revela sobre Dios y sobre el ser humano?",conclusion:"El principio eterno que emerge de la historia. Breve y poderoso. La historia lo demostró ya."}
  },
  {
    id:"triple-apelacion", cat:"Forma · Apelación integral", nombre:"Triple Apelación", icono:"△", color:"#D4537E",
    desc:"Apela a intelecto (¿qué creer?), emoción (¿qué sentir?) y voluntad (¿qué hacer?). Sermón completo y transformador.",
    puntos:["La verdad a creer (intelecto)","La emoción a sentir (corazón)","La acción a tomar (voluntad)"],
    flujo:["Introducción","Verdad — intelecto","Emoción — corazón","Acción — voluntad","Conclusión integradora"],
    guia:{intro:"Presenta el tema de forma que abra las tres dimensiones: hace pensar, sentir y querer actuar.",p1:"La verdad a creer: exégesis clara, teología accesible. Apela al intelecto sin ser académico.",p2:"La emoción a sentir: historias, imágenes, empatía. Apela al corazón sin ser manipulador.",p3:"La acción a tomar: pasos concretos y decisiones específicas. Apela a la voluntad con claridad.",conclusion:"Integra las tres: verdad (intelecto) + lo que Dios siente por ti (corazón) + lo que debes hacer (voluntad)."}
  },
];

// ─── 12 PRÉDICAS DE EJEMPLO ───────────────────────────────────────────────────
const EJEMPLOS = {
  expositivo:{titulo:"La tormenta que Jesús calma",pasaje:"Marcos 4:35-41",tema:"Mostrar que Jesús tiene autoridad sobre todo aquello que nos aterra, y que la fe no es la ausencia de miedo sino confiar en quien está en la barca.",estructuraTipo:"expositivo",revelacion:"Al leer este pasaje noté que los discípulos no gritaron por la tormenta sino por la calma. 'Quién es este?' esa pregunta me reveló que el verdadero problema no era el viento sino no conocer a Jesús lo suficiente.",nucleo:"La tormenta no es tu problema. Tu problema es no saber quién va contigo en la barca.",estructura:{intro:"Quiero que imagines la peor tormenta de tu vida. No la de lluvia y rayos — la interior. La que te quita el sueño. Todos hemos estado ahí. Hoy vamos a leer sobre una tormenta real donde los pescadores más experimentados de Israel creyeron que iban a morir. Pero lo que Jesús va a hacer no es solo calmar el clima.",p1:{t:"El contexto: la barca y los que van dentro (vv.35-36)",v:"Marcos 4:35-36",d:"Era al anochecer — Jesús había predicado toda la jornada y estaba tan cansado que se quedó dormido sobre una almohada. Con él iban sus discípulos y también otras barcas. El texto nos recuerda que nadie navega solo. La fe se vive en comunidad."},p2:{t:"La crisis: cuando la tormenta es demasiado grande (vv.37-38)",v:"Marcos 4:37-38",d:"Los discípulos eran pescadores del mar de Galilea — conocían las tormentas. Si ellos tenían miedo, la situación era objetivamente peligrosa. Y Jesús dormía. La pregunta que hacen es la misma nuestra: ¿No te importa que perecemos? Dios parece dormido cuando más lo necesitamos."},p3:{t:"La revelación: quién es este (vv.39-41)",v:"Marcos 4:39-41",d:"Jesús se levanta y le dice al mar: Calla, enmudece. El mar obedece. Entonces les pregunta: ¿Por qué estáis amedrentados? Y ellos se llenan de un temor mayor — porque la calma fue más aterradora que la tormenta. Descubrir quién es Jesús produce más temor reverente que cualquier crisis."},conclusion:"La pregunta de Jesús no es por qué tuvieron miedo de la tormenta sino por qué no confiaron en él. Dios no prometió que no habría tormentas. Prometió estar en la barca."},ilustraciones:[{tipo:"Analogía",texto:"Un piloto experimentado no se alarma con la turbulencia. No porque no sea real, sino porque sabe que el avión fue diseñado para soportarla. La fe madura no niega la tormenta — sabe en qué está viajando."},{tipo:"Ejemplo bíblico",texto:"En Job 38, cuando Dios finalmente le habla a Job, no le da explicaciones. Le hace preguntas sobre la creación. La respuesta de Dios a la tormenta de Job fue revelar quién era Él."}],aplicacion:["Esta semana identifica tu tormenta actual. Escríbela con nombre propio. Luego escribe al lado: Jesús está en esta barca.","Memoriza Marcos 4:39. La próxima vez que la ansiedad llegue de noche, decláralo en voz alta."],llamado:"Si hoy sientes que Dios está dormido mientras tu mundo se cae, Él está en la barca. La misma voz que calmó el mar de Galilea puede calmar lo que hoy te tiene aterrado."
  },
  textual:{titulo:"Todo lo puedo — Filipenses 4:13",pasaje:"Filipenses 4:13",tema:"Recuperar el significado original de este versículo y mostrar que el poder de Cristo no es para hacer lo que yo quiero sino para contentarme en cualquier circunstancia.",estructuraTipo:"textual",revelacion:"Este versículo es el más sacado de contexto en el deporte. Pero cuando lo leí en su contexto — Pablo en prisión, hablando de contentamiento — la promesa es mucho más profunda.",nucleo:"El poder de Cristo no te da lo que quieres. Te hace capaz de vivir bien sin lo que quieres.",estructura:{intro:"'Todo lo puedo en Cristo que me fortalece.' Cuántas veces has visto ese versículo en una camiseta deportiva. Es el versículo más citado y probablemente el más malentendido del Nuevo Testamento. Hoy lo vamos a leer en contexto — y lo que vamos a descubrir es una promesa mucho más radical que ganar un partido.",p1:{t:"PRIMERA VERDAD: Pablo lo escribe desde la cárcel",v:"Filipenses 4:11-12",d:"Antes del versículo 13 hay contexto que cambia todo. Pablo dice: He aprendido a contentarme, cualquiera que sea mi situación. Lo escribe encadenado, esperando juicio. No es un atleta antes de la competencia. Es un preso hablando de paz interior."},p2:{t:"SEGUNDA VERDAD: En Cristo cambia el sujeto",v:"Filipenses 4:13",d:"La frase clave es en Cristo que me fortalece. No dice yo puedo todo. Dice que la fuente está fuera de él. Es una declaración de dependencia radical, no de autosuficiencia. Pablo lo escribe para decir: en Cristo encuentro la fuerza para contentarme incluso aquí."},p3:{t:"TERCERA VERDAD: El contentamiento es una habilidad aprendida",v:"Filipenses 4:11",d:"He aprendido a contentarme. El verbo griego es manthano — el mismo de donde viene discípulo. El contentamiento no es un sentimiento que llega solo. Es una disciplina espiritual que se practica. Lo que Cristo da es la capacidad de aprender eso en cualquier circunstancia."},conclusion:"La promesa es mejor que ganar. La promesa es que Cristo te puede dar una paz que no depende de los resultados. ¿No es eso lo que realmente necesitas?"},ilustraciones:[{tipo:"Historia personal",texto:"Conocí a una mujer que había perdido su trabajo, su matrimonio y su salud en el mismo año. Cité este versículo y me dijo: lo tengo en la pared hace 10 años y nunca me ha funcionado. Le expliqué el contexto. Lloró. Entonces la promesa es que puedo estar bien aquí, en esto. Sí. Exactamente eso."}],aplicacion:["Lee Filipenses 4:10-13 completo esta semana, no solo el versículo 13.","Identifica una circunstancia donde no has podido encontrar contentamiento. Ora: Señor, enséñame a estar contento aquí."],llamado:"El contentamiento que Pablo describe no es resignación. Es una paz activa que solo viene de una fuente. ¿Quieres aprender eso? Jesús es el maestro."
  },
  tematico:{titulo:"El miedo — tres respuestas bíblicas",pasaje:"2 Timoteo 1:7 · Salmos 56:3 · Isaías 41:10",tema:"Mostrar que la Biblia no ignora el miedo sino que lo confronta con tres verdades: el Espíritu que da poder, la promesa de presencia, y la fe como acción.",estructuraTipo:"tematico",revelacion:"La palabra no temas aparece 365 veces en la Biblia — una por cada día del año. Dios sabía que íbamos a necesitarlo.",nucleo:"El antídoto bíblico para el miedo no es la valentía — es conocer a Quién está contigo.",estructura:{intro:"¿Cuándo fue la última vez que el miedo te paralizó? No el miedo al peligro físico — sino el que te hace no hablar cuando deberías, no actuar cuando es el momento. Hoy vamos a ver qué dice la Biblia sobre ese miedo.",p1:{t:"PRIMERO: Dios nos dio un espíritu diferente",v:"2 Timoteo 1:7",d:"Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio. El Espíritu Santo que vive en ti no produce cobardía. Entonces cuando el miedo te paraliza, no viene de tu nueva naturaleza — viene de la vieja."},p2:{t:"SEGUNDO: La promesa de la presencia activa",v:"Isaías 41:10",d:"No temas, porque yo estoy contigo. No dice que no habrá peligro. Dice que no estarás solo en él. La diferencia entre el miedo que destruye y el que podemos enfrentar es la presencia."},p3:{t:"TERCERO: La fe como respuesta activa al miedo",v:"Salmos 56:3",d:"En el día que temo, yo en ti confío. David no dice cuando tenga miedo, confiaré. Dice en el día que temo — reconoce que el día va a llegar. La fe bíblica no es la ausencia de miedo. Es la decisión de confiar en Dios en el mismo momento en que el miedo llega."},conclusion:"El miedo va a llegar. La Biblia no promete que no. Pero tienes un Espíritu que no produce cobardía, una presencia que no te abandona, y la posibilidad de confiar en el momento en que el miedo toca la puerta."},ilustraciones:[{tipo:"Analogía",texto:"El miedo es como el frío. No desaparece porque decides no sentirlo. Pero puedes abrigarte. La fe es el abrigo — no elimina el frío, pero te protege lo suficiente para seguir caminando."}],aplicacion:["Esta semana escribe tu miedo más grande en un papel. Debajo escribe Isaías 41:10. Ponlo donde lo veas todos los días.","Identifica una acción que has postergado por miedo. Esta semana da el primer paso."],llamado:"Si hoy el miedo es más grande que tu fe, la fe del tamaño de un grano de mostaza es suficiente. Díselo a Dios ahora mismo."
  },
  "textual-tematico":{titulo:"La oveja perdida y el Dios que no se cansa de buscar",pasaje:"Lucas 15:1-7",tema:"Mostrar desde la parábola que la iniciativa de la salvación siempre es de Dios, aplicado a las personas que sentimos que ya se perdieron.",estructuraTipo:"textual-tematico",revelacion:"El pastor deja las 99 para ir por una. En nuestra lógica eso es irresponsable. En la lógica de Dios, es exactamente lo correcto.",nucleo:"Hay alguien en tu vida que tú ya diste por perdido. Dios no.",estructura:{intro:"Piensa en alguien que se alejó de la fe. Un hijo. Un amigo. ¿Sigues orando por esa persona o ya la diste por perdida? Hoy Jesús cuenta una historia que va a incomodar tu teología de la pérdida.",p1:{t:"DEL TEXTO: El pastor deja las 99",v:"Lucas 15:4-5",d:"El pastor deja las 99 en el desierto para ir por la que se perdió. No las deja en un lugar seguro — las deja expuestas. Y cuando la encuentra, la pone sobre sus hombros gozoso. No la regaña. No le exige explicaciones. La carga. Eso es el evangelio en una imagen."},p2:{t:"DEL TEMA: Las personas que ya dimos por perdidas",v:"Lucas 15:7",d:"Habrá más gozo en el cielo por un pecador que se arrepiente que por noventa y nueve justos. El cielo celebra más una recuperación que noventa y nueve casos perfectos. ¿Cuánto tiempo llevas sin orar por esa persona?"},p3:{t:"LA APLICACIÓN: Tú puedes ser el camino del pastor",v:"1 Corintios 9:22",d:"Dios busca a los perdidos — y a veces usa personas. No esperes a que esa persona vuelva sola. El pastor fue. Orar, llamar, visitar, perdonar. Ser el camino que el pastor usa para llegar a la oveja."},conclusion:"No hay persona tan perdida que Dios haya dejado de buscarla. Esta semana elige una persona. Y empieza a orar con la misma terquedad del pastor que deja las 99."},ilustraciones:[{tipo:"Historia personal",texto:"Por 7 años oré por mi padre que se había alejado de la fe. En el séptimo año me llamó un domingo por la noche llorando. Quiero volver. No sé cómo funciona la matemática de la oración. Pero sé que el cielo celebró ese domingo."}],aplicacion:["Escribe el nombre de la persona por quien vas a orar esta semana. 7 días consecutivos.","Si es posible, da un paso concreto: un mensaje, una llamada. Sin sermón, solo presencia."],llamado:"¿Hay alguien en tu corazón cuyo nombre llevas cargando hace años? Ese peso es el Espíritu Santo que no se ha rendido. ¿Te unes a la búsqueda?"
  },
  biografico:{titulo:"Gedeón — cómo Dios usa a los que se sienten insuficientes",pasaje:"Jueces 6:11-16",tema:"Mostrar a través de Gedeón que Dios no busca personas capaces sino disponibles, y que la inseguridad no es obstáculo para el llamado.",estructuraTipo:"biografico",revelacion:"Lo primero que Gedeón dice cuando el ángel lo llama es: soy el menor de mi familia. Y lo primero que Dios le dice es: ve con esta tu fuerza. La fuerza que Dios ve es exactamente lo que Gedeón no puede ver en sí mismo.",nucleo:"Dios no te llama porque eres suficiente. Te llama para que descubras que Él lo es.",estructura:{intro:"¿Alguna vez has sentido que Dios se equivocó de persona? Hoy quiero presentarte a alguien que pensó exactamente lo mismo. Gedeón está escondido en un lagar trillando trigo porque tenía tanto miedo de los enemigos que trabajaba escondido. Y es a ese hombre al que Dios decide llamar.",p1:{t:"Quién era Gedeón: triple insignificancia",v:"Jueces 6:11-15",d:"Israel llevaba 7 años bajo opresión madianita. Gedeón pertenecía a la tribu de Manasés — la más pequeña. Y dentro de esa tribu, su familia era la menor. Y dentro de esa familia, él era el último. Cuando el ángel lo llama varón esforzado, Gedeón responde con incredulidad: ¿Cómo? ¿Yo? Es la respuesta más honesta que cualquier llamado puede recibir."},p2:{t:"Su crisis: la pregunta que cambia todo",v:"Jueces 6:13,16",d:"Gedeón le hace a Dios la misma pregunta que todos queremos hacer: ¿Por qué nos ha sobrevenido todo esto? Y Dios no lo regaña — le responde. Yo estaré contigo. No le explica el plan completo. Le da una sola promesa: mi presencia. Y con eso tiene que ser suficiente."},p3:{t:"El principio eterno: Dios se glorifica en la debilidad reconocida",v:"1 Corintios 1:27",d:"Gedeón derrota a los madianitas con 300 hombres y con cántaros y antorchas como armas. Dios diseñó la victoria así a propósito: para que nadie pudiera atribuírsela. Lo necio del mundo escogió Dios para avergonzar a los sabios."},conclusion:"La próxima vez que sientas que no eres suficiente para lo que Dios te pide, recuerda: tampoco lo era Gedeón. La pregunta no es si eres suficiente. Es si vas a responder al llamado."},ilustraciones:[{tipo:"Analogía",texto:"Un vaso pequeño puesto bajo una catarata recibe exactamente la misma agua que un barril. El tamaño del recipiente no limita el agua disponible — solo lo que puede retener. Dios no busca recipientes grandes. Busca recipientes dispuestos."}],aplicacion:["Escribe cuál es el llamado específico que has rechazado por sentirte insuficiente. Nómbralo.","Esta semana da un paso en esa dirección. Solo el siguiente paso."],llamado:"Gedeón estaba escondido cuando Dios lo encontró. ¿En qué lugar te has escondido tú? Hoy es el día de salir del lagar."
  },
  doctrinal:{titulo:"La gracia — lo que Dios da sin que lo merezcas",pasaje:"Efesios 2:8-9 · Romanos 5:8 · Tito 2:11",tema:"Construir una comprensión bíblica sólida de la gracia como favor inmerecido, no como permiso para pecar, y mostrar sus implicaciones para la vida cristiana.",estructuraTipo:"doctrinal",revelacion:"La mayoría de los creyentes creen en la gracia en teoría pero viven como si tuvieran que ganársela. Eso produce creyentes agotados que sirven desde el miedo.",nucleo:"La gracia no es la excusa para vivir como quieras. Es el poder para vivir como Dios quiere.",estructura:{intro:"¿Cuántas veces esta semana pensaste que Dios estaba decepcionado de ti? ¿Cuántas veces postergaste orar porque sentías que primero tenías que mejorar? Eso tiene un nombre teológico: es vivir bajo la ley en vez de la gracia.",p1:{t:"¿QUÉ DICE LA BIBLIA? La gracia es favor inmerecido",v:"Efesios 2:8-9 · Romanos 5:8",d:"Por gracia sois salvos por medio de la fe; no por obras, para que nadie se gloríe. La palabra griega charis es favor que se da sin obligación. No es un préstamo. No es un salario. Es un regalo. Y Romanos 5:8 lo confirma: siendo aún pecadores, Cristo murió por nosotros. No cuando mejoramos. Cuando éramos lo opuesto."},p2:{t:"¿POR QUÉ IMPORTA? La gracia cambia la motivación",v:"Tito 2:11-12",d:"La gracia de Dios se ha manifestado enseñándonos a vivir sobria, justa y piadosamente. La gracia no produce libertinaje — produce transformación. Cuando entiendes que no tienes que ganarte el amor de Dios, dejas de servir por miedo y empiezas a servir por amor."},p3:{t:"¿CÓMO VIVIR ESTO? La gracia como práctica diaria",v:"Hebreos 4:16",d:"Acerquémonos confiadamente al trono de la gracia. La respuesta práctica a la doctrina de la gracia es la oración sin vergüenza. No esperes estar listo. No esperes haber mejorado. La gracia significa que puedes acercarte ahora, en el estado en que estás."},conclusion:"Si hoy sientes que Dios te tiene en lista de espera hasta que te comportes mejor, eso no es el evangelio. El evangelio dice que la bienvenida ya está dada. ¿La estás recibiendo hoy?"},ilustraciones:[{tipo:"Analogía",texto:"La gracia es como el oxígeno. No lo ves ni lo sientes directamente, pero sin él no puedes hacer nada. Muchos creyentes intentan vivir la vida cristiana con respiración propia. La gracia es el oxígeno espiritual."}],aplicacion:["Esta semana cada mañana declara en voz alta: soy aceptado por Dios no por lo que hago sino por lo que Cristo hizo.","Identifica un área donde estás sirviendo a Dios por miedo. ¿Cómo se vería desde amor?"],llamado:"La gracia ya fue dada. No hay nada que hacer para merecerla. Solo hay que recibirla. ¿La estás recibiendo hoy o la estás ganando?"
  },
  evangelistico:{titulo:"El vacío que no cierra — y el único que puede llenarlo",pasaje:"Juan 4:13-14 · Eclesiastés 3:11",tema:"Mostrar a personas que no conocen a Dios que el vacío que sienten es una invitación — y que Jesús es la única respuesta que ha durado.",estructuraTipo:"evangelistico",revelacion:"Eclesiastés 3:11 dice que Dios puso eternidad en el corazón del hombre. Eso explica por qué ninguna cosa temporal puede llenarnos del todo.",nucleo:"El vacío que sientes no es una falla. Es la firma del Creador diciéndote que fuiste hecho para más.",estructura:{intro:"Hay una sensación que conozco muy bien. Logras algo que querías mucho — el trabajo, la relación, el número en la cuenta — y en vez de llenarte, hay un momento de silencio extraño. Un y ahora qué. Como si el premio fuera más pequeño que lo que tu corazón esperaba. Si alguna vez has sentido eso, hoy quiero hablar contigo.",p1:{t:"El problema: fuimos diseñados para más",v:"Eclesiastés 3:11",d:"Salomón, el hombre más rico de la historia antigua, dijo: ha puesto eternidad en el corazón de ellos. Hay algo en nosotros que no puede ser saciado por nada temporal. No porque seamos codiciosos — sino porque fuimos hechos para algo eterno."},p2:{t:"La solución: lo que Jesús le ofreció a una mujer sedienta",v:"Juan 4:13-14",d:"Jesús habla con una mujer samaritana — cinco matrimonios fallidos, viviendo con alguien que no era su marido. Y le dice: el que bebiere del agua que yo le daré no tendrá sed jamás. No le ofrece una religión. Le ofrece una fuente interna que nunca se seca."},p3:{t:"La decisión: qué se requiere para recibirlo",v:"Juan 1:12",d:"A todos los que le recibieron, les dio potestad de ser hechos hijos de Dios. No dice a los que mejoraron primero. Dice a los que le recibieron. La mujer del pozo corrió al pueblo a decir: venid, ved a un hombre que me ha dicho todo lo que he hecho. Eso es todo lo que se necesita: encontrarte con Jesús tal como eres."},conclusion:"El vacío es real. No te estoy diciendo que te lo imaginas. Te estoy diciendo que tiene solución. Y que esa solución tiene nombre: Jesús."},ilustraciones:[{tipo:"Analogía",texto:"Un pez fuera del agua salta y lucha. No porque sea testarudo sino porque su naturaleza exige agua. Nosotros somos así con Dios. Podemos vivir fuera de la relación con Él — pero siempre habrá algo en nosotros buscando."}],aplicacion:["Si tomaste la decisión de recibir a Cristo hoy, cuéntaselo a alguien esta semana.","Consigue una Biblia y empieza a leer el evangelio de Juan — 1 capítulo por día."],llamado:"Si hoy quieres recibir a Jesús, puedes hacerlo con una oración simple: Jesús, vengo tal como soy. Lléname tú. Si oraste eso, bienvenido. Todo cambia a partir de aquí."
  },
  ocasional:{titulo:"Hoy comienza el resto de su vida — sermón de boda",pasaje:"Génesis 2:24 · Efesios 5:25 · 1 Corintios 13:4-7",tema:"Celebrar el pacto de los novios, recordarles que el matrimonio es un pacto ante Dios, y darles herramientas bíblicas para que dure.",estructuraTipo:"ocasional",revelacion:"El matrimonio en la Biblia no es solo un contrato social — es un pacto que refleja la relación de Cristo con su iglesia.",nucleo:"Hoy no se casan solos. Hay un tercer Invitado en esta boda.",estructura:{intro:"Hay pocas cosas más hermosas que ver a dos personas elegirse. No por necesidad, no por obligación — por amor. Hoy han decidido elegirse el uno al otro delante de Dios y de todos nosotros. Y eso merece ser celebrado. Pero también comprendido.",p1:{t:"El significado: lo que es un pacto",v:"Génesis 2:24",d:"Dios inventó el matrimonio. Y lo diseñó como un pacto — no un contrato. Un contrato se rompe cuando la otra parte no cumple. Un pacto se mantiene porque ambos lo eligieron ante Dios, sin cláusulas de escape."},p2:{t:"La perspectiva bíblica: el amor como decisión",v:"1 Corintios 13:4-7",d:"El amor es sufrido, es benigno. Este amor no es el del enamoramiento — ese viene y va. Este amor es el que se elige cuando el enamoramiento duerme. El amor bíblico es un verbo, no un sustantivo."},p3:{t:"El reto: poner a Dios en el centro",v:"Eclesiastés 4:12",d:"Cordón de tres dobleces no se rompe pronto. El tercer cordón es Dios. Un matrimonio que ora junto, que busca a Dios juntos, que se perdona desde la gracia — ese matrimonio tiene un recurso que ninguna terapia puede reemplazar."},conclusion:"Lo que comienza hoy es una aventura. Van a ser el mejor y el peor versión del otro en algún momento. En esos días, recuerden este pacto. Recuerden a Quién lo hicieron."},ilustraciones:[{tipo:"Analogía",texto:"Un árbol que crece en tierra rica puede verse bien aunque sus raíces sean superficiales. La primera tormenta lo derriba. Un matrimonio que solo cultiva lo externo puede verse bien hasta que llega la tormenta real. Las raíces espirituales son las que mantienen en pie lo que el viento quiere tumbar."}],aplicacion:["Oren juntos esta noche — aunque sea 2 minutos. Háganlo un hábito.","Lean Efesios 5:22-33 juntos y conversen sobre lo que cada uno puede aplicar."],llamado:"Oremos juntos por estos esposos. Señor, bendice este hogar. Sé el tercer cordón que nadie puede romper."
  },
  "tres-puntos":{titulo:"Tres razones por las que la oración funciona aunque no lo parezca",pasaje:"Lucas 18:1-8",tema:"Devolver la confianza en la oración a creyentes que han dejado de orar porque sienten que sus oraciones no son escuchadas.",estructuraTipo:"tres-puntos",revelacion:"La parábola de la viuda ante el juez injusto es la más honesta que Jesús contó sobre la oración. No promete respuestas inmediatas. Promete que Dios sí escucha.",nucleo:"Dios no tarda en responderte. Tarda en responderte de la manera que tú quieres.",estructura:{intro:"¿Has dejado de orar por algo? No porque no quieras — sino porque llevas tanto tiempo orando sin resultado que ya no sabes si tiene sentido seguir. Hoy Jesús va a responder directamente a ese agotamiento. La parábola la introdujo Lucas con estas palabras: sobre la necesidad de orar siempre, y no desmayar.",p1:{t:"PRIMERO: Dios no es el juez injusto — es lo opuesto",v:"Lucas 18:6-7",d:"¿Y acaso Dios no hará justicia a sus escogidos, que claman a él día y noche? El argumento de Jesús es de menor a mayor. Si un juez injusto finalmente hace justicia por cansancio, cuánto más un Padre que te ama responderá a tus oraciones. El problema no es la disposición de Dios. Nunca lo ha sido."},p2:{t:"SEGUNDO: La demora no es negativa — es formadora",v:"Hebreos 11:13",d:"Los héroes de la fe murieron sin haber recibido lo prometido. La demora de Dios no es abandono — es proceso. La pregunta no es si Dios escuchó. Es si estás creciendo mientras esperas."},p3:{t:"TERCERO: La fe se demuestra en la perseverancia",v:"Lucas 18:8",d:"Cuando venga el Hijo del Hombre, ¿hallará fe en la tierra? Jesús no pregunta si hallará personas religiosas. Pregunta si hallará personas que todavía estén orando cuando Él regrese. La perseverancia en la oración es la demostración más clara de que realmente creemos que Dios existe y le importa."},conclusion:"No dejes de orar. No porque tus oraciones vayan a cambiarlo todo mañana. Sino porque orar es la declaración de que confías en Alguien más grande que tus circunstancias."},ilustraciones:[{tipo:"Analogía",texto:"Una semilla no da señales visibles de vida durante semanas. Si la desenterras para revisar si está funcionando, interrumpes el proceso. La oración es así. El trabajo más importante sucede bajo tierra, invisible."}],aplicacion:["Retoma una oración que abandonaste. Escríbela y vuelve a presentarla ante Dios hoy.","Haz un diario de oración por 30 días. Al final del mes, relée."],llamado:"¿Hay algo por lo que llevas tiempo sin orar? Hoy es el día de retomarlo. Jesús dijo que no desmayes."
  },
  inductivo:{titulo:"¿Por qué no puedo cambiar lo que quiero cambiar?",pasaje:"Romanos 7:15-25",tema:"Explorar inductivamente el dilema del creyente que quiere hacer el bien pero sigue fallando, para llegar a la liberación del Espíritu en Romanos 8.",estructuraTipo:"inductivo",revelacion:"Pablo en Romanos 7 describe exactamente la experiencia que todos tenemos pero nadie habla: el hago lo que no quiero. Y Pablo sí tenía una respuesta.",nucleo:"El problema no es la fuerza de voluntad. Es que estás peleando con fuerza propia contra un enemigo que vive adentro.",estructura:{intro:"¿Has tomado la misma decisión más de una vez? Esta vez sí voy a cambiar. Funciona unos días. Y luego, sin saber cómo, estás en el mismo lugar. Hablo del mal genio que explota aunque prometiste no hacerlo. La ansiedad que regresa aunque oras. ¿Por qué nos pasa esto? ¿Somos simplemente malos?",p1:{t:"¿Por qué las respuestas comunes no funcionan?",v:"Romanos 7:15",d:"Porque lo que hago, no lo entiendo; pues no hago lo que quiero, sino lo que aborrezco, eso hago. Pablo era el apóstol más disciplinado de la historia. Lo que demuestra que el problema no es la falta de disciplina ni de buenas intenciones. Es algo más profundo."},p2:{t:"¿Qué dice la Biblia sobre la causa real?",v:"Romanos 7:17-20",d:"Pablo nombra la causa: el pecado que mora en mí. Hay una naturaleza dentro del creyente que no ha sido erradicada todavía — solo desalojada del trono. La batalla no es entre tu decisión y tus hábitos. Es entre el Espíritu que vive en ti y la vieja naturaleza que sigue operando."},p3:{t:"La respuesta que Dios diseñó",v:"Romanos 8:1-4",d:"Ahora pues, ninguna condenación hay para los que están en Cristo Jesús, los que andan conforme al Espíritu. La solución no es más esfuerzo. Es vivir en dependencia activa del Espíritu Santo. La libertad no viene de luchar más fuerte. Viene de rendirse al Espíritu."},conclusion:"El dilema de Romanos 7 es el estado del creyente que pelea con fuerza propia. Romanos 8 describe al creyente que aprende a vivir en el Espíritu. ¿Estás dispuesto a dejar de intentarlo con tu propia fuerza?"},ilustraciones:[{tipo:"Analogía",texto:"Intentar cambiar con fuerza de voluntad es como intentar salir de arenas movedizas luchando. Entre más luchas, más te hundes. La salida no es luchar más fuerte — es dejar de luchar y aferrarte a lo que está fuera de las arenas."}],aplicacion:["Esta semana, en vez de prometerte hoy no lo voy a hacer, ora cada mañana: Espíritu Santo, tú maneja esto hoy, yo no puedo.","Lee Romanos 8:1-17 completo. Toma nota de cuántas veces aparece la palabra Espíritu."],llamado:"La condenación de Romanos 7 no es tu morada permanente. Romanos 8:1 dice ninguna condenación. ¿Estás dispuesto a caminar en el Espíritu?"
  },
  lowry:{titulo:"El hijo que nunca se fue — la trampa de la obediencia sin amor",pasaje:"Lucas 15:25-32",tema:"Revelar que dentro de la iglesia existe una forma de perdición que nadie predica: la del que nunca se fue pero está resentido y vacío.",estructuraTipo:"lowry",revelacion:"El Espíritu me detuvo en el versículo 25: El hijo mayor estaba en el campo. Mientras el padre corría a abrazar al pródigo, el mayor estaba trabajando. Y cuando llegó y escuchó la fiesta — no entró. Furioso.",nucleo:"Puedes estar en la casa del Padre toda la vida y nunca haber disfrutado al Padre.",estructura:{intro:"OOPS — Hoy le voy a hablar al que lleva años aquí. Al que nunca faltó un domingo, da sus diezmos, sirve en el ministerio — pero por dentro carga algo que se activa cuando ven que a otro le va bien. Algo que duele cuando alguien que no se lo merece recibe una bendición. Ese algo tiene nombre. Y hoy lo vamos a sacar a la luz.",p1:{t:"UGH — El diagnóstico: servir sin disfrutar",v:"Lucas 15:29",d:"Tantos años te sirvo sin haber jamás transgredido tu mandamiento, y nunca me has dado ni un cabrito. Escucha el vocabulario: te sirvo. No te amo. Este hijo había reducido su relación con el padre a una transacción laboral. Y lo que no sabía es que el padre ya le había dicho: todas mis cosas son tuyas."},p2:{t:"AHA — El giro: el padre sale a buscarlo",v:"Lucas 15:28",d:"Cuando el padre sabe que el hijo mayor está afuera furioso, no lo manda llamar. Sale él. El mismo padre que corrió hacia el pródigo, sale hacia el que se quedó. Y lo que le dice es lo más tierno de toda la parábola: Hijo, tú siempre has estado conmigo, y todas mis cosas son tuyas. No le dice tienes razón. Le dice: hijo. La identidad lo cambia todo."},p3:{t:"WHEE — El evangelio: volver a ser hijo",v:"Lucas 15:31 · Romanos 8:15",d:"El error del hijo mayor no era que servía — era que servía desde la identidad equivocada. Se había olvidado de que era hijo. No recibisteis el espíritu de esclavitud para estar otra vez en temor, sino el espíritu de adopción. La solución no es servir más. Es volver a ser hijo."},conclusion:"YEAH — La parábola termina sin decirnos si el hijo mayor entró a la fiesta. Lucas lo dejó abierto. Porque el final lo escribes tú. ¿Vas a seguir afuera cargando resentimiento? ¿O vas a entrar y descubrir que el padre también salió a buscarte?"},ilustraciones:[{tipo:"Analogía",texto:"Imagina que alguien te regala una casa enorme. Pero tú decides vivir en el garaje y trabajar como mayordomo porque sientes que no te la mereces todavía. Así vive el creyente con mentalidad de esclavo: heredero que se trata a sí mismo como sirviente."},{tipo:"Historia personal",texto:"Conocí a un hermano que llevaba 14 años en la misma iglesia. Un día vino a decirme que se iba. Después de mucho silencio me dijo: estoy cansado de dar sin recibir. Cuando hablamos más profundo, descubrimos que había 14 años sirviendo para ganarse el amor de Dios. Y nunca había entendido que ya lo tenía desde antes de servir. Ese día nació de nuevo — por segunda vez."}],aplicacion:["Esta semana hazte esta pregunta honesta: ¿estoy sirviendo a Dios por amor o por miedo a su rechazo?","Lee en voz alta Lucas 15:31 una vez al día esta semana."],llamado:"Si hoy reconociste al hijo mayor en ti, hay una sola cosa que hacer: entrar a la fiesta. El padre ya salió a buscarte. La puerta está abierta."
  },
  "me-we":{titulo:"Cuando la comparación te roba la vida",pasaje:"Gálatas 6:4-5",tema:"Confrontar la cultura de comparación y mostrar el camino bíblico hacia una identidad que no necesita competir.",estructuraTipo:"me-we",revelacion:"El antídoto bíblico para la comparación no es sentirse superior. Es estar tan enfocado en tu propio llamado que no te queda tiempo para medir el de otros.",nucleo:"La comparación es el robo más silencioso que existe — te quita el gozo de tu propia historia.",estructura:{intro:"ME — Voy a ser honesto. Hay mañanas en que abro Instagram y en 3 minutos ya me siento insuficiente. El ministerio de alguien parece más grande. El matrimonio parece más feliz. Y lo más ridículo es que sé que esas fotos son editadas — pero de todas formas el daño ya está hecho. La comparación es silenciosa y venenosa.",p1:{t:"WE — Todos lo vivimos aunque no lo confesamos",v:"Proverbios 14:30",d:"El corazón apacible es vida de la carne; mas la envidia es carcoma de los huesos. Nosotros le decimos motivación o estándares altos. Pero la raíz es la misma: mirar la vida del otro para medir la nuestra. Sucede en la iglesia más que afuera."},p2:{t:"GOD — Lo que Dios dice sobre tu historia",v:"Gálatas 6:4-5",d:"Cada uno someta a prueba su propia obra. Pablo propone algo radical: que tu punto de referencia seas tú mismo, no los demás. Cada persona tiene una historia diseñada para ella. Compararla con la de otro es como comparar una novela de misterio con un libro de poesía. No compiten."},p3:{t:"YOU — Una pregunta para esta semana",v:"Juan 21:22",d:"Cuando Pedro le pregunta a Jesús sobre el destino de Juan, Jesús responde: ¿Y a ti qué? Sígueme tú. Esa frase es el antídoto perfecto. La pregunta que Jesús te hace hoy es: ¿me estás siguiendo a mí o estás mirando hacia el lado?"},conclusion:"WE — Imagina una iglesia donde nadie entra comparándose sino celebrando lo que Dios está haciendo en cada historia. Una comunidad así sería imposible de detener. Eso empieza con cada uno de nosotros esta semana."},ilustraciones:[{tipo:"Analogía",texto:"Dos corredores en una maratón. Uno corre mirando siempre a los que están adelante — tropieza y se desanima. El otro corre mirando hacia adelante, pendiente de su propio paso. La comparación te hace correr la carrera de otro en lugar de la tuya."}],aplicacion:["Esta semana, cuando sientas el impulso de compararte, pregunta: Jesús, ¿qué quieres TÚ de mí hoy?","Considera tomar un descanso de 3 días de redes sociales. Observa cómo cambia tu estado de ánimo."],llamado:"¿Con quién te estás comparando? Ese es el nombre que hoy le entregas a Dios. Para que dejes de medir tu vida por la de esa persona."
  },
  "problema-solucion":{titulo:"Por qué no puedes perdonar — y el único camino que funciona",pasaje:"Mateo 18:21-35 · Efesios 4:32",tema:"Confrontar la incapacidad de perdonar, identificar la raíz real del problema, y mostrar que el perdón bíblico es posible pero no por las razones que creemos.",estructuraTipo:"problema-solucion",revelacion:"La razón por la que no podemos perdonar no es que la herida sea demasiado grande. Es que no hemos comprendido el tamaño de lo que Dios nos ha perdonado a nosotros.",nucleo:"No puedes dar lo que no has recibido. El perdón que le debes a otros ya te lo dieron a ti.",estructura:{intro:"Hay alguien en tu vida a quien no has podido perdonar. Quizás llevas años intentándolo. Te has dicho que ya lo hiciste — pero cuando el nombre aparece, algo en tu pecho se aprieta. Y lo peor es que sientes culpa por no poder perdonar. Como si fuera una falla espiritual tuya. Hoy quiero hablar de eso directamente.",p1:{t:"EL PROBLEMA: el perdón que ordenamos pero no podemos dar",v:"Mateo 18:21-22",d:"Pedro pregunta: ¿Cuántas veces perdonaré? ¿Hasta siete? Y Jesús responde: setenta veces siete. La mayoría escuchamos eso y nos sentimos peor — porque si Jesús manda perdonar 490 veces y yo no puedo perdonar una, ¿qué dice eso de mí? El problema es que intentamos obedecer un mandamiento sin la fuente que lo hace posible."},p2:{t:"LA RAÍZ: no hemos comprendido cuánto nos han perdonado",v:"Mateo 18:23-30",d:"Un hombre le debía al rey una cantidad imposible. El rey lo perdona todo. Inmediatamente ese hombre va y manda a la cárcel a alguien que le debe el equivalente a un día de salario. La raíz del problema no es la magnitud de la ofensa recibida — es que olvidó la magnitud de la ofensa que le fue perdonada."},p3:{t:"LA SOLUCIÓN: perdonar desde la deuda perdonada",v:"Efesios 4:32",d:"Perdonaos unos a otros, como Dios también os perdonó a vosotros en Cristo. La palabra como es la clave. No perdonamos esforzándonos. Perdonamos meditando en lo que Cristo hizo por nosotros. El perdón fluye de la gratitud, no del esfuerzo."},conclusion:"El perdón no es decir que lo que hicieron estuvo bien. Es liberar a esa persona del tribunal de tu corazón — porque tú también fuiste liberado. ¿Hay alguien que necesitas liberar hoy?"},ilustraciones:[{tipo:"Analogía",texto:"El no perdonar es como tomar veneno esperando que el otro se muera. La amargura no daña al que te hirió — te daña a ti. El perdón no es un regalo para ellos. Es una liberación para ti."}],aplicacion:["Escribe el nombre de la persona que no has perdonado. Debajo escribe: Dios me perdonó más. Lee eso en voz alta.","Ora esta semana: Señor, muéstrame cuánto me has perdonado a mí. Deja que esa revelación haga el trabajo."],llamado:"¿Hay alguien a quien hoy necesitas liberar? El perdón empieza como una decisión y luego se convierte en experiencia. ¿Estás dispuesto a dar ese primer paso?"
  },
  homilia:{titulo:"Homilía sobre el Salmo 23 — El Señor es mi pastor",pasaje:"Salmos 23:1-6",tema:"Comentar progresivamente el Salmo 23 para mostrar que la vida cristiana no es la ausencia de valles sino la presencia de un Pastor que conoce el camino.",estructuraTipo:"homilia",revelacion:"Llevamos el Salmo 23 a los funerales. Pero David lo escribió en vida — en medio del valle. Eso lo cambia todo.",nucleo:"El Señor no te saca del valle. Te acompaña en él — y eso es suficiente.",estructura:{intro:"Salmo 23. El texto más conocido de toda la Biblia. Lo hemos escuchado en funerales, en momentos de crisis. Pero hoy quiero leerlo fresco — como si fuera la primera vez. Porque hay cosas en este salmo que suelen pasar desapercibidas cuando lo leemos de memoria.",p1:{t:"Comentario vv.1-3 — El pastor que provee y restaura",v:"Salmos 23:1-3",d:"El Señor es mi pastor — en presente: ES. No fue. No será si me comporto bien. Es. Y la consecuencia directa es nada me faltará. No dice nada me sobrará — dice que lo necesario estará. Restaurará mi alma: el verbo hebreo shub significa volver, hacer volver. Dios no solo suple necesidades externas — devuelve lo interno que se pierde en el camino."},p2:{t:"Comentario v.4 — El valle y la presencia",v:"Salmos 23:4",d:"Aunque ande en valle de sombra de muerte, no temeré mal alguno. El salmo no promete evitar el valle — promete compañía en él. Nota el cambio: en los versículos anteriores David habla de Dios en tercera persona. Aquí de repente cambia a segunda: tú. Como si en el valle la distancia desapareciera. El pastor se acerca más cuando el camino se oscurece."},p3:{t:"Comentario vv.5-6 — La mesa y la persecución",v:"Salmos 23:5-6",d:"Aderezas mesa delante de mí en presencia de mis angustiadores. Dios prepara un banquete en medio de los que te persiguen. No después de la batalla — durante. La bondad y la misericordia me seguirán todos los días. El hebreo de seguirán tiene connotación de perseguir activamente. La bondad de Dios no te espera — te persigue."},conclusion:"David escribió este salmo en algún valle real. La promesa no es que no habrá valles. La promesa es que hay un Pastor que los conoce mejor que tú, que camina más rápido que el miedo, y que ya está esperándote en el otro lado."},ilustraciones:[{tipo:"Ejemplo bíblico",texto:"David era literalmente pastor antes de ser rey. Sabía lo que significaba cargar una oveja herida, buscar la que se perdía en la oscuridad. Cuando escribe el Señor es mi pastor, no es metáfora vacía — es la experiencia de alguien que conoce los dos lados de esa relación."}],aplicacion:["Lee el Salmo 23 esta semana en una versión diferente de la que conoces. La Nueva Traducción Viviente puede abrir dimensiones nuevas.","Identifica en qué valle estás actualmente. Relee el versículo 4 con ese contexto específico en mente."],llamado:"¿Cuál es tu valle hoy? No tienes que decirlo en voz alta. Nómbralo en tu corazón. Y después léelo: aunque ande en valle de sombra de muerte, no temeré, porque tú estarás conmigo."
  },
  narrativo:{titulo:"La noche que Pedro se hundió — y lo que Jesús hizo después",pasaje:"Mateo 14:22-33",tema:"Usar la narrativa de Pedro caminando sobre el agua para mostrar que los momentos de hundimiento no son el final — son donde Jesús actúa.",estructuraTipo:"narrativo",revelacion:"Pedro es el único que se atreve a salir de la barca. Y también el único que se hunde. Los que más se arriesgan son los que más necesitan la mano de Jesús — y también los que más la experimentan.",nucleo:"Jesús no te salva cuando caminas perfecto sobre el agua. Te salva cuando te hundes.",estructura:{intro:"Es de madrugada. El mar de Galilea está negro. Los discípulos llevan horas remando contra el viento — Mateo dice estaban fatigados. Y entonces ven algo caminando sobre el agua hacia ellos. Gritan de terror. Creen que es un fantasma. Y entonces Pedro hace lo que nadie más en la historia haría.",p1:{t:"La escena: Si eres tú, manda que yo vaya",v:"Mateo 14:28-29",d:"Pedro pide permiso para salir. Y Jesús dice una sola palabra: Ven. Pedro sale. Y camina. En toda la historia registrada, solo dos personas han caminado sobre el agua — Jesús y Pedro. Pero nadie recuerda eso. Todos recuerdan que Pedro se hundió. Y hay algo profundamente injusto en eso."},p2:{t:"El clímax: cuando las olas son más grandes que la fe",v:"Mateo 14:30",d:"Pero al ver el fuerte viento, tuvo miedo; y comenzando a hundirse, dio voces diciendo: ¡Señor, sálvame! El texto dice que vio el fuerte viento. Cambió de enfoque. En el instante en que cambió lo que miraba, cambió lo que pisaba. Y el hundirse fue progresivo — comenzando a hundirse. Así es como la mayoría nos alejamos."},p3:{t:"La resolución: la mano que llega antes de que pidas",v:"Mateo 14:31",d:"Al momento Jesús, extendiendo la mano, asió de él. Al momento. No esperó a que Pedro terminara de hundirse. No esperó a que aprendiera la lección. Extendió la mano al momento. Y luego le dice: ¡Hombre de poca fe! ¿Por qué dudaste? No es una regañada — es una pregunta de ternura. La mano llegó antes que la pregunta."},conclusion:"Pedro es el único que se hundió — pero también el único que caminó. Y la mano de Jesús lo sostuvo exactamente cuando más la necesitaba. Tu hundimiento de hoy no es el final de tu historia. Es el momento en que la mano se extiende."},ilustraciones:[{tipo:"Analogía",texto:"Un escalador sabe que la cuerda de seguridad no sirve cuando sube sin problemas. Sirve cuando resbala. El seguro no es para los momentos de perfección — es para los momentos de caída. La gracia de Dios funciona igual."}],aplicacion:["¿En qué área de tu vida estás comenzando a hundirte? Identifica el momento en que cambiaste de enfocar a Jesús a enfocar la tormenta.","Practica la oración de Pedro: cuando el miedo llegue, di en voz alta: Señor, sálvame. Dos palabras."],llamado:"¿Te estás hundiendo? Eso es exactamente el momento para el que Jesús extendió la mano. No esperes a tocar fondo. Llámalo ahora."
  },
  "triple-apelacion":{titulo:"La resurrección — por qué cambia absolutamente todo",pasaje:"1 Corintios 15:12-22 · Juan 11:25",tema:"Presentar la resurrección de Cristo no como un dato histórico sino como una realidad que transforma la manera de vivir, enfrentar el dolor y encarar la muerte.",estructuraTipo:"triple-apelacion",revelacion:"1 Corintios 15:19 dice: si en esta vida solamente esperamos en Cristo, somos los más dignos de lástima. Pablo no dice que la fe sin resurrección es incompleta. Dice que sería patética.",nucleo:"Si la resurrección es real, cambia absolutamente todo. Si no lo es, nada de esto vale la pena.",estructura:{intro:"Hoy quiero hablar de algo que la iglesia celebra una vez al año pero debería vivir cada día: la resurrección de Jesús. No como una historia bonita para Pascua. Como la afirmación más radical que alguien puede hacer — y como la realidad que, si es verdad, cambia absolutamente cada área de tu existencia.",p1:{t:"LA VERDAD A CREER — lo que la resurrección afirma",v:"1 Corintios 15:12-22",d:"Si Cristo no resucitó, vuestra fe es vana. No hay versión suavizada del evangelio sin resurrección. O Cristo resucitó físicamente — cuerpo, tumba vacía, apariciones verificables — o todo lo que creemos se desmorona. La resurrección no es un mito. Es el evento más verificado de la historia antigua."},p2:{t:"LA EMOCIÓN A SENTIR — lo que la resurrección hace con el dolor",v:"Juan 11:25 · Romanos 8:18",d:"Yo soy la resurrección y la vida. Jesús no dice esto desde un podio académico. Lo dice frente a una tumba, con una mujer llorando a su lado. La resurrección no elimina el dolor. Pero le da un horizonte diferente. Las aflicciones del tiempo presente no son comparables con la gloria venidera. Eso no es negación. Es esperanza con fundamento."},p3:{t:"LA ACCIÓN A TOMAR — lo que la resurrección exige de tu vida",v:"1 Corintios 15:58",d:"Estad firmes y constantes, creciendo en la obra del Señor siempre, sabiendo que vuestro trabajo en el Señor no es en vano. Si Cristo resucitó, nada de lo que haces en su nombre se pierde. Cada acto de bondad, cada oración — tiene peso eterno."},conclusion:"La resurrección cambia todo. Para tu mente: cambia lo que sabes sobre Dios. Para tu corazón: cambia cómo enfrentas el dolor. Para tu voluntad: cambia el valor de cada decisión que tomes hoy. ¿La estás viviendo o solo creyéndola?"},ilustraciones:[{tipo:"Historia personal",texto:"Estuve en el funeral de un creyente que había perdido a su hijo joven. Esperaba devastación total. En algún momento me dijo: si la resurrección es verdad — y lo es — esto no es el final. La resurrección no quitó el dolor. Pero cambió su tamaño."}],aplicacion:["Esta semana lee 1 Corintios 15 completo. Toma notas de lo que te sorprende.","Identifica una área de tu vida donde estás actuando como si este mundo fuera todo lo que hay. ¿Cómo cambiaría desde la perspectiva de la resurrección?"],llamado:"La resurrección es verdad. ¿Cuál de las tres dimensiones necesitas que sea más real en tu vida hoy? Eso es lo que le vamos a pedir a Dios ahora."
  }
};

const GRUPOS = [
  { label:"Por fuente del mensaje", ids:["expositivo","textual","tematico","textual-tematico"] },
  { label:"Por sujeto o propósito", ids:["biografico","doctrinal","evangelistico","ocasional"] },
  { label:"Por estructura lógica",  ids:["tres-puntos","inductivo","lowry","me-we","problema-solucion"] },
  { label:"Por forma de presentación", ids:["homilia","narrativo","triple-apelacion"] },
];

const STEPS = ["Pasaje","Estructura","Revelación","Bosquejo","Desarrollo","Ilustraciones","Aplicación","Vista Final"];

function newDraft() {
  return {
    id: "s" + Date.now(),
    titulo:"", pasaje:"", tema:"", estructuraTipo:"",
    revelacion:"", nucleo:"",
    estructura:{ intro:"", p1:{t:"",v:"",d:""}, p2:{t:"",v:"",d:""}, p3:{t:"",v:"",d:""}, p4:{t:"",v:"",d:""}, conclusion:"" },
    ilustraciones:[{ tipo:"Historia personal", texto:"" }],
    aplicacion:["","",""],
    llamado:"",
  };
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const gold = "#C9912A";
const s = {
  wrap:{ fontFamily:"'Georgia',serif", color:"#F0E5CC", background:"#0E0B06", minHeight:"100vh", display:"flex", flexDirection:"column" },
  header:{ borderBottom:"1px solid #3D2E18", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#171109", position:"sticky", top:0, zIndex:100 },
  logo:{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:700, letterSpacing:"0.14em", color:"#E8B449" },
  main:{ flex:1, padding:"28px 20px", maxWidth:700, margin:"0 auto", width:"100%" },
  h1:{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:700, color:"#F0E5CC", marginBottom:6, lineHeight:1.2 },
  h2:{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:"#F0E5CC", marginBottom:6 },
  label:{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#C9912A", marginBottom:6, display:"block" },
  hint:{ fontSize:13, color:"#7A6B52", marginBottom:8 },
  input:{ width:"100%", background:"#1E1710", border:"1px solid #3D2E18", borderRadius:6, padding:"10px 14px", color:"#F0E5CC", fontFamily:"Georgia,serif", fontSize:15, outline:"none", marginBottom:16 },
  textarea:{ width:"100%", background:"#1E1710", border:"1px solid #3D2E18", borderRadius:6, padding:"10px 14px", color:"#F0E5CC", fontFamily:"Georgia,serif", fontSize:15, outline:"none", marginBottom:16, minHeight:100, resize:"vertical" },
  btnPrimary:{ background:gold, border:"none", color:"#1A0F00", borderRadius:6, padding:"11px 24px", fontFamily:"Georgia,serif", fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:"0.05em" },
  btnSecondary:{ background:"none", border:"1px solid #5A4525", color:"#D4C4A0", borderRadius:6, padding:"10px 20px", fontFamily:"Georgia,serif", fontSize:14, cursor:"pointer" },
  btnGhost:{ background:"none", border:"1px solid #3D2E18", color:"#D4C4A0", borderRadius:4, padding:"6px 14px", fontFamily:"Georgia,serif", fontSize:13, cursor:"pointer" },
  divider:{ display:"flex", alignItems:"center", gap:10, margin:"20px 0", color:"#5A4525", fontSize:11, letterSpacing:"0.25em", textTransform:"uppercase" },
  card:{ background:"#231B0E", border:"1px solid #3D2E18", borderRadius:8, padding:"16px 20px", marginBottom:12 },
  pill:{ fontSize:11, padding:"2px 10px", borderRadius:20, background:"#1E1710", border:"1px solid #3D2E18", color:"#7A6B52", display:"inline-block", marginRight:4, marginBottom:4 },
  prayerBox:{ background:"#171109", border:"1px solid #3D2E18", borderLeft:"3px solid #C9912A", borderRadius:6, padding:"16px 20px", marginBottom:24, fontSize:15, color:"#D4C4A0", fontStyle:"italic", lineHeight:1.6 },
};

function Divider({ label }) {
  return <div style={s.divider}><span style={{flex:1,height:1,background:"#3D2E18"}}></span>{label}<span style={{flex:1,height:1,background:"#3D2E18"}}></span></div>;
}

function Field({ label, hint, children }) {
  return <div style={{marginBottom:4}}>
    <label style={s.label}>{label}</label>
    {hint && <div style={s.hint}>{hint}</div>}
    {children}
  </div>;
}

// ─── STEP 0: PASAJE ──────────────────────────────────────────────────────────
function StepPasaje({ draft, update }) {
  return <>
    <div style={s.prayerBox}>Antes de comenzar, tómate un momento en oración.<br/><em>¿A qué texto o tema te está llevando el Espíritu Santo?</em></div>
    <span style={s.label}>Paso 01</span>
    <div style={s.h1}>El Pasaje</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:24}}>Define el texto bíblico y el tema general de tu mensaje.</p>
    <Field label="Título del mensaje" hint="Dale un nombre memorable (puedes cambiarlo después)">
      <input style={s.input} value={draft.titulo} onChange={e=>update("titulo",e.target.value)} placeholder="Ej: El poder de la fe inquebrantable"/>
    </Field>
    <Field label="Texto principal" hint="El pasaje bíblico que será la base de tu mensaje">
      <input style={s.input} value={draft.pasaje} onChange={e=>update("pasaje",e.target.value)} placeholder="Ej: Juan 11:1-44 · La resurrección de Lázaro"/>
    </Field>
    <Field label="Tema o propósito" hint="¿Cuál es el corazón de lo que Dios quiere decir?">
      <textarea style={s.textarea} value={draft.tema} onChange={e=>update("tema",e.target.value)} placeholder="Ej: Mostrar que Dios llega a tiempo, incluso cuando parece tarde..."/>
    </Field>
  </>;
}

// ─── STEP 1: ESTRUCTURA ──────────────────────────────────────────────────────
function StepEstructura({ draft, update }) {
  const sel = draft.estructuraTipo;
  const selObj = ESTRUCTURAS.find(x => x.id === sel);
  return <>
    <span style={s.label}>Paso 02 · Obligatorio</span>
    <div style={s.h1}>Elige tu Estructura</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:20}}>Elige una de las <strong style={{color:gold}}>12 estructuras homiléticas</strong> antes de continuar. Define el esqueleto de tu predica.</p>

    {sel && selObj ? <div style={{background:selObj.color+"18",border:`2px solid ${selObj.color}`,borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:22}}>{selObj.icono}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:selObj.color,marginBottom:2}}>{selObj.cat}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#F0E5CC"}}>✓ {selObj.nombre}</div>
      </div>
      <button style={s.btnGhost} onClick={()=>update("estructuraTipo","")}>Cambiar</button>
    </div> : <div style={{border:"1px dashed #5A4525",borderRadius:8,padding:12,textAlign:"center",color:"#7A6B52",fontSize:14,marginBottom:20}}>
      Toca una tarjeta para elegir tu estructura
    </div>}

    {GRUPOS.map(g => {
      const ests = g.ids.map(id=>ESTRUCTURAS.find(x=>x.id===id)).filter(Boolean);
      return <div key={g.label}>
        <Divider label={g.label}/>
        {ests.map(e => {
          const active = sel === e.id;
          return <div key={e.id} onClick={()=>update("estructuraTipo",e.id)} style={{background:active?e.color+"18":"#231B0E",border:`${active?2:1}px solid ${active?e.color:"#3D2E18"}`,borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"border-color .15s"}}>
            <div style={{width:38,height:38,flexShrink:0,borderRadius:8,border:`1px solid ${e.color}`,background:active?e.color:e.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginTop:2}}>
              <span style={active?{color:"#fff"}:{}}>{e.icono}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                <span style={{fontFamily:"Georgia,serif",fontSize:15,color:active?e.color:"#F0E5CC"}}>{e.nombre}</span>
                {active && <span style={{fontSize:11,background:e.color,color:"#fff",borderRadius:20,padding:"2px 10px",fontWeight:700}}>✓ Seleccionada</span>}
              </div>
              <p style={{fontSize:13,color:"#D4C4A0",lineHeight:1.5,marginBottom:6}}>{e.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {e.flujo.map((f,i)=><span key={i} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#1E1710",border:`1px solid ${active?e.color:"#3D2E18"}`,color:active?e.color:"#7A6B52"}}>{i+1}. {f}</span>)}
              </div>
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #3D2E18"}}>
                <button onClick={ev=>{ev.stopPropagation();viewDemo(e.id);}} style={{background:"none",border:`1px solid ${e.color}`,color:e.color,borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:12,fontFamily:"Georgia,serif"}}>
                  📖 Ver ejemplo de predica
                </button>
              </div>
            </div>
          </div>;
        })}
      </div>;
    })}
  </>;
}

// ─── STEP 2: REVELACIÓN ──────────────────────────────────────────────────────
function StepRevelacion({ draft, update }) {
  return <>
    <span style={s.label}>Paso 03</span>
    <div style={s.h1}>La Revelación</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:20}}>Esta es la parte más sagrada. No es IA, es Dios hablándote a ti.</p>
    {draft.pasaje && <div style={{background:"#1E1710",border:"1px solid #3D2E18",borderRadius:6,padding:"8px 14px",marginBottom:20,fontSize:14,color:gold}}>📖 {draft.pasaje}</div>}
    <div style={s.prayerBox}><em>"Lámpara es a mis pies tu palabra, y lumbrera a mi camino."</em><br/><span style={{fontSize:13,color:"#7A6B52"}}>Salmos 119:105</span></div>
    <Field label="¿Qué te habló Dios en este pasaje?" hint="Escribe libremente lo que el Espíritu Santo puso en tu corazón. Sin filtros.">
      <textarea style={{...s.textarea,minHeight:130}} value={draft.revelacion} onChange={e=>update("revelacion",e.target.value)} placeholder="Al leer este pasaje, Dios me mostró que..."/>
    </Field>
    <Field label="Mensaje central (1 sola frase)" hint="Si solo pudieras decir UNA cosa hoy, ¿cuál sería?">
      <input style={s.input} value={draft.nucleo} onChange={e=>update("nucleo",e.target.value)} placeholder="Ej: Dios no llega tarde, llega justo a tiempo para revelar su gloria."/>
    </Field>
  </>;
}

// ─── STEP 3: BOSQUEJO ────────────────────────────────────────────────────────
function StepBosquejo({ draft, update }) {
  const eObj = ESTRUCTURAS.find(x=>x.id===draft.estructuraTipo) || ESTRUCTURAS[0];
  const pts = eObj.puntos;
  const pids = pts.map((_,i)=>"p"+(i+1));
  const g = eObj.guia;
  const hints = [g.p1,g.p2,g.p3,g.p4].filter(Boolean);

  return <>
    <span style={s.label}>Paso 04</span>
    <div style={s.h1}>El Bosquejo</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:16}}>Organiza tu mensaje siguiendo la estructura elegida.</p>

    <div style={{background:eObj.color+"14",border:`1px solid ${eObj.color}40`,borderRadius:8,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{fontSize:20}}>{eObj.icono}</span>
      <div>
        <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:eObj.color,marginBottom:2}}>{eObj.cat}</div>
        <div style={{fontSize:14,color:"#D4C4A0"}}>{eObj.desc}</div>
        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
          {eObj.flujo.map((f,i)=><span key={i} style={{...s.pill,borderColor:eObj.color+"40",color:eObj.color}}>{i+1}. {f}</span>)}
        </div>
      </div>
    </div>

    {draft.nucleo && <div style={{...s.prayerBox,fontStyle:"normal",marginBottom:20}}><span style={{fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",color:gold,display:"block",marginBottom:4}}>Mensaje Central</span><em style={{fontSize:17,color:"#F0E5CC"}}>"{draft.nucleo}"</em></div>}

    <Field label="Introducción" hint={g.intro}>
      <textarea style={s.textarea} value={draft.estructura.intro} onChange={e=>update("estructura",{...draft.estructura,intro:e.target.value})} placeholder="¿Con qué vas a abrir?"/>
    </Field>

    <Divider label="Los puntos principales"/>

    {pids.map((pid,i)=><div key={pid} style={{...s.card,marginBottom:12}}>
      <div style={{fontSize:12,letterSpacing:"0.14em",textTransform:"uppercase",color:gold,marginBottom:8}}>{pts[i]}</div>
      <Field label="Título / Enunciado" hint={hints[i]||""}>
        <input style={s.input} value={draft.estructura[pid]?.t||""} onChange={e=>update("estructura",{...draft.estructura,[pid]:{...draft.estructura[pid],t:e.target.value}})} placeholder="Escribe el título de este punto..."/>
      </Field>
    </div>)}

    <Field label="Conclusión y llamado" hint={g.conclusion}>
      <textarea style={s.textarea} value={draft.estructura.conclusion} onChange={e=>update("estructura",{...draft.estructura,conclusion:e.target.value})} placeholder="¿Cómo vas a cerrar?"/>
    </Field>
  </>;
}

// ─── STEP 4: DESARROLLO ──────────────────────────────────────────────────────
function StepDesarrollo({ draft, update }) {
  const eObj = ESTRUCTURAS.find(x=>x.id===draft.estructuraTipo) || ESTRUCTURAS[0];
  const pts = eObj.puntos;
  const pids = pts.map((_,i)=>"p"+(i+1));

  return <>
    <span style={s.label}>Paso 05</span>
    <div style={s.h1}>El Desarrollo</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:20}}>Desarrolla cada punto con versículos y contenido. Aquí va la carne del mensaje.</p>
    {pids.map((pid,i)=><div key={pid} style={{...s.card,marginBottom:16}}>
      <div style={{fontSize:12,letterSpacing:"0.14em",textTransform:"uppercase",color:gold,marginBottom:8}}>
        {pts[i]}{draft.estructura[pid]?.t ? ` — ${draft.estructura[pid].t}` : ""}
      </div>
      <Field label="Versículo(s) de apoyo">
        <input style={s.input} value={draft.estructura[pid]?.v||""} onChange={e=>update("estructura",{...draft.estructura,[pid]:{...draft.estructura[pid],v:e.target.value}})} placeholder="Ej: Juan 11:25-26 · Romanos 8:28"/>
      </Field>
      <Field label="Desarrollo y contenido">
        <textarea style={{...s.textarea,minHeight:110}} value={draft.estructura[pid]?.d||""} onChange={e=>update("estructura",{...draft.estructura,[pid]:{...draft.estructura[pid],d:e.target.value}})} placeholder="Explica este punto... ¿Qué dice la Escritura? ¿Qué significa? ¿Cómo conecta?"/>
      </Field>
    </div>)}
  </>;
}

// ─── STEP 5: ILUSTRACIONES ───────────────────────────────────────────────────
const TIPOS_ILLUS = ["Historia personal","Testimonio","Analogía","Dato o estadística","Ejemplo bíblico"];

function StepIlustraciones({ draft, update }) {
  const illus = draft.ilustraciones;
  const set = (i,field,val) => {
    const n=[...illus]; n[i]={...n[i],[field]:val}; update("ilustraciones",n);
  };
  const add = () => update("ilustraciones",[...illus,{tipo:"Historia personal",texto:""}]);
  const del = i => update("ilustraciones",illus.filter((_,j)=>j!==i));

  return <>
    <span style={s.label}>Paso 06</span>
    <div style={s.h1}>Las Ilustraciones</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:20}}>Las ilustraciones hacen que el mensaje viva. Historias, analogías y ejemplos que conectan verdades eternas con la realidad de tu congregación.</p>
    {illus.map((il,i)=><div key={i} style={{...s.card,display:"flex",gap:12,marginBottom:10}}>
      <div style={{flex:1}}>
        <select style={{...s.input,marginBottom:8}} value={il.tipo} onChange={e=>set(i,"tipo",e.target.value)}>
          {TIPOS_ILLUS.map(t=><option key={t}>{t}</option>)}
        </select>
        <textarea style={{...s.textarea,marginBottom:0}} value={il.texto} onChange={e=>set(i,"texto",e.target.value)} placeholder="Escribe tu historia, ejemplo o analogía..."/>
      </div>
      <button onClick={()=>del(i)} style={{background:"none",border:"none",color:"#7A6B52",cursor:"pointer",fontSize:18,padding:4,flexShrink:0}}>✕</button>
    </div>)}
    <button onClick={add} style={{...s.btnGhost,width:"100%",padding:"12px",fontFamily:"Georgia,serif",fontSize:15,borderStyle:"dashed",color:gold}}>+ Agregar ilustración</button>
  </>;
}

// ─── STEP 6: APLICACIÓN ──────────────────────────────────────────────────────
function StepAplicacion({ draft, update }) {
  const aplics = draft.aplicacion;
  const set = (i,val) => { const n=[...aplics]; n[i]=val; update("aplicacion",n); };
  const add = () => update("aplicacion",[...aplics,""]);

  return <>
    <span style={s.label}>Paso 07</span>
    <div style={s.h1}>La Aplicación</div>
    <p style={{fontSize:15,color:"#7A6B52",marginBottom:20}}>Un buen mensaje transforma. Define los pasos prácticos que tu congregación puede dar esta semana.</p>
    <Field label="Pasos prácticos" hint="¿Qué pueden hacer en casa, en su familia, en su trabajo?">
      {aplics.map((a,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#231B0E",border:`1px solid ${gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:gold,flexShrink:0}}>{i+1}</div>
        <input style={{...s.input,marginBottom:0,flex:1}} value={a} onChange={e=>set(i,e.target.value)} placeholder="Esta semana voy a..."/>
      </div>)}
      <button onClick={add} style={{...s.btnGhost,borderStyle:"dashed",color:gold,fontFamily:"Georgia,serif",fontSize:14,marginTop:4}}>+ Agregar paso</button>
    </Field>
    <Field label="Llamado al altar / Oración final" hint="¿A qué decisión vas a llamar a las personas?">
      <textarea style={s.textarea} value={draft.llamado} onChange={e=>update("llamado",e.target.value)} placeholder="Voy a invitar a las personas que... a pasar al frente / a tomar la decisión de..."/>
    </Field>
  </>;
}


// ─── SERMON TIMER ─────────────────────────────────────────────────────────────
function SermonTimer({ secs, running, onToggle, onReset }) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s2 = secs % 60;
  const fmt = n => String(n).padStart(2,"0");
  const display = h > 0 ? `${fmt(h)}:${fmt(m)}:${fmt(s2)}` : `${fmt(m)}:${fmt(s2)}`;
  const totalMins = secs / 60;
  const dot   = totalMins < 25 ? "#3D8A5E" : totalMins < 40 ? "#C9912A" : "#8B1A1A";
  const glow  = totalMins < 25 ? "#5DAE8255" : totalMins < 40 ? "#C9912A55" : "#C0202055";
  const label = totalMins < 25 ? "En tiempo"  : totalMins < 40 ? "Extendido"  : "Muy largo";

  return (
    <div style={{
      background:"#0E0B06",border:`1.5px solid ${dot}`,borderRadius:12,
      padding:"12px 16px",marginBottom:16,
      display:"flex",alignItems:"center",gap:12,position:"relative",
      boxShadow:`0 0 16px ${glow}`,transition:"border-color .5s,box-shadow .5s"
    }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      <div style={{width:10,height:10,borderRadius:"50%",background:dot,boxShadow:`0 0 6px ${dot}`,flexShrink:0,
        animation:running?"pulse 1.5s ease-in-out infinite":"none"}}/>
      <div style={{flex:1}}>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:26,fontWeight:700,color:dot,letterSpacing:"0.1em",lineHeight:1,marginBottom:2}}>{display}</div>
        <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7A6B52"}}>{running?label:"⏸ Pausado"}</div>
      </div>
      <div style={{display:"flex",gap:5,flexShrink:0}}>
        <button onClick={onToggle} style={{background:"#231B0E",border:`1px solid ${dot}40`,color:dot,borderRadius:6,padding:"5px 10px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer"}}>
          {running?"⏸":"▶"}
        </button>
        <button onClick={onReset} style={{background:"#231B0E",border:"1px solid #3D2E18",color:"#7A6B52",borderRadius:6,padding:"5px 10px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer"}} title="Reiniciar">↺</button>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,borderRadius:"0 0 12px 12px",background:"#231B0E",overflow:"hidden"}}>
        <div style={{height:"100%",width:Math.min(100,(totalMins/45)*100)+"%",background:dot,transition:"width 1s linear,background .5s"}}/>
      </div>
    </div>
  );
}

// ─── STEP 7: VISTA DE PREDICACIÓN ────────────────────────────────────────────
function StepVista({ draft, fontSize, setFontSize, theme, setTheme, timerSecs, timerRunning, onTimerToggle, onTimerReset }) {
  const [sectionMode, setSectionMode] = useState(false);
  const [sectionIdx,  setSectionIdx]  = useState(0);
  const [showControls,setShowControls]= useState(false);

  // Theme palettes
  const THEMES = {
    dark:  { bg:"#080500", card:"#120E06", border:"#2A1F0E", hdr:"#0A0700", text:"#D4C4A0", muted:"#7A6B52", accent:"#F0E5CC" },
    black: { bg:"#000000", card:"#0A0A0A", border:"#1A1A1A", hdr:"#050505", text:"#E0E0E0", muted:"#666",     accent:"#FFFFFF" },
    sepia: { bg:"#F5EDD6", card:"#EDE0C4", border:"#D4C4A0", hdr:"#F0E6CC", text:"#3B2F1E", muted:"#7A6B52", accent:"#1A1108" },
    light: { bg:"#FAFAF8", card:"#F0EEE8", border:"#E0DAD0", hdr:"#F5F3EF", text:"#2C2218", muted:"#8A7A62", accent:"#1A1108" },
  };
  const T = THEMES[theme];

  const eObj = ESTRUCTURAS.find(x=>x.id===draft.estructuraTipo);
  const pts  = eObj ? eObj.puntos : [];
  const pids = pts.map((_,i)=>"p"+(i+1));
  const e    = draft.estructura;
  const roman = ["I","II","III","IV","V"];

  // ── Escala proporcional: todo el texto del mensaje escala con fontSize ──────
  // fs = base del predicador. Títulos y párrafos heredan proporciones fijas.
  const fs  = fontSize;                    // párrafos principales
  const fsT = Math.round(fs * 1.35);      // títulos de puntos
  const fsH = Math.round(fs * 1.65);      // h1 del mensaje
  const fsS = Math.round(fs * 0.82);      // texto secundario (pasaje, versículo)
  const fsL = Math.round(fs * 0.68);      // etiquetas pequeñas (uppercase)
  const LH  = 1.85;                        // line-height fijo cómodo

  // ── Build ordered sections array ─────────────────────────────
  const sections = [];

  // 0 — Portada
  sections.push({
    id:"portada", label:"Inicio",
    render: ()=>(
      <div style={{textAlign:"center",paddingBottom:28}}>
        {eObj && <div style={{
          display:"inline-flex",alignItems:"center",gap:6,
          background:eObj.color+"18",border:`1px solid ${eObj.color}40`,
          borderRadius:20,padding:"4px 14px",marginBottom:16,
          fontSize:fsL,letterSpacing:"0.14em",textTransform:"uppercase",color:eObj.color
        }}>{eObj.icono} {eObj.nombre}</div>}
        <h1 style={{fontFamily:"Georgia,serif",fontSize:fsH,fontWeight:700,color:T.accent,lineHeight:1.25,marginBottom:14}}>
          {draft.titulo||"Mensaje sin título"}
        </h1>
        {draft.pasaje && <div style={{fontFamily:"Georgia,serif",fontSize:fsS,color:gold,fontStyle:"italic",marginBottom:12}}>
          📖 {draft.pasaje}
        </div>}
        {draft.nucleo && <div style={{background:T.card,border:`1px solid ${gold}40`,borderLeft:`4px solid ${gold}`,borderRadius:"0 8px 8px 0",padding:"14px 20px",marginTop:16,textAlign:"left"}}>
          <div style={{fontSize:fsL,letterSpacing:"0.2em",textTransform:"uppercase",color:gold,marginBottom:6}}>Mensaje central</div>
          <em style={{fontFamily:"Georgia,serif",fontSize:fs,color:T.accent,lineHeight:LH}}>"{draft.nucleo}"</em>
        </div>}
      </div>
    )
  });

  // 1 — Introducción
  if(e.intro) sections.push({
    id:"intro", label:"Introducción",
    render: ()=>(
      <div>
        <SectionHead label="Introducción" icon="◆" T={T} fsL={fsL}/>
        <p style={{fontSize:fs,lineHeight:LH,color:T.text,fontFamily:"Georgia,serif",borderLeft:`2px solid ${T.border}`,paddingLeft:18}}>
          {e.intro}
        </p>
      </div>
    )
  });

  // Points
  pids.forEach((pid,i)=>{ if(e[pid]?.t) sections.push({
    id:pid, label: pts[i]||`Punto ${i+1}`,
    render: ()=>(
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`4px solid ${eObj?eObj.color:"#5A4525"}`,borderRadius:"0 10px 10px 0",padding:"22px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,background:eObj?eObj.color+"25":T.border,border:`1px solid ${eObj?eObj.color:"#5A4525"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:fsS,fontWeight:700,color:eObj?eObj.color:gold}}>
            {roman[i]||i+1}
          </div>
          <div style={{fontSize:fsL,letterSpacing:"0.16em",textTransform:"uppercase",color:eObj?eObj.color:T.muted}}>
            {pts[i]||`Punto ${i+1}`}
          </div>
        </div>
        <div style={{fontFamily:"Georgia,serif",fontSize:fsT,fontWeight:700,color:T.accent,lineHeight:1.3,marginBottom:10}}>{e[pid].t}</div>
        {e[pid].v && <div style={{display:"inline-flex",alignItems:"center",gap:6,background:gold+"14",border:`1px solid ${gold}30`,borderRadius:6,padding:"5px 12px",fontSize:fsS,color:gold,marginBottom:14,fontStyle:"italic"}}>📖 {e[pid].v}</div>}
        {e[pid].d && <p style={{fontSize:fs,lineHeight:LH,color:T.text,fontFamily:"Georgia,serif",margin:0}}>{e[pid].d}</p>}
      </div>
    )
  });});

  // Ilustraciones
  const illus = draft.ilustraciones.filter(x=>x.texto);
  if(illus.length>0) sections.push({
    id:"illus", label:"Ilustraciones",
    render: ()=>(
      <div>
        <SectionHead label="Ilustraciones" icon="◇" T={T} fsL={fsL}/>
        {illus.map((il,i)=><div key={i} style={{marginBottom:14,padding:"14px 18px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8}}>
          <div style={{fontSize:fsL,letterSpacing:"0.16em",textTransform:"uppercase",color:gold,marginBottom:6}}>{il.tipo}</div>
          <p style={{fontSize:fs,lineHeight:LH,color:T.text,fontFamily:"Georgia,serif",margin:0,fontStyle:"italic"}}>{il.texto}</p>
        </div>)}
      </div>
    )
  });

  // Aplicación
  const aplics = draft.aplicacion.filter(x=>x);
  if(aplics.length>0) sections.push({
    id:"aplic", label:"Aplicación",
    render: ()=>(
      <div>
        <SectionHead label="Aplicación práctica" icon="◈" T={T} fsL={fsL}/>
        {aplics.map((a,i)=><div key={i} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
          <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:T.card,border:`2px solid ${gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:fsS,fontWeight:700,color:gold,marginTop:2}}>{i+1}</div>
          <p style={{fontSize:fs,lineHeight:LH,color:T.text,fontFamily:"Georgia,serif",margin:0,paddingTop:4}}>{a}</p>
        </div>)}
      </div>
    )
  });

  // Conclusión
  if(e.conclusion) sections.push({
    id:"conclusion", label:"Conclusión",
    render: ()=>(
      <div>
        <SectionHead label="Conclusión" icon="◉" T={T} fsL={fsL}/>
        <p style={{fontSize:fs,lineHeight:LH,color:T.text,fontFamily:"Georgia,serif",borderLeft:`2px solid ${T.border}`,paddingLeft:18}}>{e.conclusion}</p>
      </div>
    )
  });

  // Llamado
  if(draft.llamado) sections.push({
    id:"llamado", label:"Llamado",
    render: ()=>(
      <div style={{background:T.card,border:`1px solid ${gold}60`,borderTop:`3px solid ${gold}`,borderRadius:"0 0 10px 10px",padding:"22px 24px"}}>
        <div style={{fontSize:fsL,letterSpacing:"0.2em",textTransform:"uppercase",color:gold,marginBottom:10}}>✦ Llamado al altar</div>
        <p style={{fontSize:fs,lineHeight:LH,color:T.accent,fontFamily:"Georgia,serif",fontStyle:"italic",margin:0}}>{draft.llamado}</p>
      </div>
    )
  });

  const total = sections.length;
  const cur   = Math.min(sectionIdx, total-1);
  const pct   = total > 1 ? Math.round((cur/(total-1))*100) : 100;

  // ── READING CONTROLS PANEL ───────────────────────────────────
  const themeLabels = {dark:"Oscuro",black:"Negro",sepia:"Sepia",light:"Claro"};
  const ControlsPanel = () => !showControls ? null : (
    <div style={{
      background:T.card,border:`1px solid ${T.border}`,
      borderRadius:12,padding:"18px 20px",marginBottom:20,
    }}>
      {/* Font size */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:T.muted,marginBottom:10}}>
          Tamaño de letra — {fontSize}px
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setFontSize(f=>Math.max(13,f-1))} style={{
            width:34,height:34,borderRadius:"50%",
            background:T.bg,border:`1px solid ${T.border}`,
            color:T.text,fontSize:18,cursor:"pointer",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>−</button>
          <div style={{flex:1,height:4,background:T.bg,borderRadius:4,overflow:"hidden"}}>
            <div style={{
              height:"100%",borderRadius:4,
              background:eObj?eObj.color:gold,
              width:((fontSize-13)/(28-13)*100)+"%",transition:"width .15s"
            }}/>
          </div>
          <button onClick={()=>setFontSize(f=>Math.min(28,f+1))} style={{
            width:34,height:34,borderRadius:"50%",
            background:T.bg,border:`1px solid ${T.border}`,
            color:T.text,fontSize:18,cursor:"pointer",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>+</button>
        </div>
        {/* Preview line */}
        <div style={{marginTop:10,fontFamily:"Georgia,serif",fontSize,color:T.text,lineHeight:1.7,
          padding:"8px 12px",background:T.bg,borderRadius:6,border:`1px solid ${T.border}`}}>
          "Dios no llega tarde..."
        </div>
      </div>

      {/* Theme selector */}
      <div>
        <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:T.muted,marginBottom:10}}>
          Tema de lectura
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {Object.entries(THEMES).map(([key,th])=>(
            <button key={key} onClick={()=>setTheme(key)} style={{
              background:th.bg,border:`2px solid ${key===theme?(eObj?eObj.color:gold):th.border}`,
              borderRadius:8,padding:"10px 12px",cursor:"pointer",
              display:"flex",alignItems:"center",gap:8,transition:"border-color .15s"
            }}>
              <div style={{width:18,height:18,borderRadius:"50%",background:th.text,flexShrink:0}}/>
              <span style={{fontFamily:"Georgia,serif",fontSize:13,color:th.text}}>{themeLabels[key]}</span>
              {key===theme && <span style={{marginLeft:"auto",fontSize:12,color:eObj?eObj.color:gold}}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── SECTION MODE UI ──────────────────────────────────────────
  if(sectionMode) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>

      {/* Top bar */}
      <div style={{background:T.hdr,borderBottom:`1px solid ${T.border}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button onClick={()=>{setSectionMode(false);setSectionIdx(0);}} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,padding:"6px 12px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer",flexShrink:0}}>
          ← Completo
        </button>
        <div style={{flex:1,height:4,background:T.card,borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",background:eObj?eObj.color:gold,width:pct+"%",transition:"width .3s",borderRadius:4}}/>
        </div>
        <button onClick={()=>setShowControls(c=>!c)} style={{
          background:showControls?(eObj?eObj.color+"25":"#2A1F0E"):"none",
          border:`1px solid ${showControls?(eObj?eObj.color:gold):T.border}`,
          color:showControls?(eObj?eObj.color:gold):T.muted,
          borderRadius:6,padding:"6px 12px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer",flexShrink:0
        }}>Aa</button>
      </div>

      {/* Timer — siempre visible en modo secciones */}
      <div style={{padding:"8px 16px 0",background:T.hdr,borderBottom:`1px solid ${T.border}`}}>
        <SermonTimer secs={timerSecs} running={timerRunning} onToggle={onTimerToggle} onReset={onTimerReset}/>
      </div>

      {/* Controls */}
      {showControls && <div style={{padding:"12px 16px",background:T.hdr,borderBottom:`1px solid ${T.border}`}}>
        <ControlsPanel/>
      </div>}

      {/* Section label pill */}
      <div style={{textAlign:"center",padding:"20px 16px 0"}}>
        <span style={{
          display:"inline-block",
          background:eObj?eObj.color+"18":T.card,
          border:`1px solid ${eObj?eObj.color+"40":T.border}`,
          borderRadius:20,padding:"4px 16px",
          fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",
          color:eObj?eObj.color:gold
        }}>{sections[cur]?.label||""}</span>
      </div>

      {/* Content — apply fontSize + theme text color */}
      <div style={{flex:1,padding:"24px 20px 120px",maxWidth:680,margin:"0 auto",width:"100%",fontSize,color:T.text}}>
        {sections[cur]?.render()}
      </div>

      {/* Bottom nav */}
      <div style={{
        background:T.hdr,borderTop:`1px solid ${T.border}`,
        padding:"14px 20px",
        display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
        flexShrink:0
      }}>
        <button
          onClick={()=>setSectionIdx(i=>Math.max(0,i-1))}
          disabled={cur===0}
          style={{
            background:"none",border:"1px solid #3D2E18",color:cur===0?"#2A1F0E":"#D4C4A0",
            borderRadius:8,padding:"12px 24px",fontFamily:"Georgia,serif",fontSize:15,
            cursor:cur===0?"default":"pointer",flex:1,transition:"color .15s"
          }}>← Anterior</button>

        {/* Dot indicators */}
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          {sections.map((_,i)=><div key={i} style={{
            width: i===cur?20:6, height:6, borderRadius:3,
            background: i===cur?(eObj?eObj.color:gold): i<cur?T.border:T.card,
            transition:"all .25s"
          }}/>)}
        </div>

        {cur===total-1
          ? <button
              onClick={()=>{setSectionMode(false);setSectionIdx(0);}}
              style={{background:gold,border:"none",color:"#1A0F00",borderRadius:8,padding:"12px 24px",fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,cursor:"pointer",flex:1}}>
              ✦ Fin
            </button>
          : <button
              onClick={()=>setSectionIdx(i=>Math.min(total-1,i+1))}
              style={{background:eObj?eObj.color:gold,border:"none",color:"#1A0F00",borderRadius:8,padding:"12px 24px",fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,cursor:"pointer",flex:1}}>
              Siguiente →
            </button>
        }
      </div>
    </div>
  );

  // ── FULL VIEW (default) ──────────────────────────────────────
  // Toggle button injected at top
  const toggleBtn = (
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      <button
        onClick={()=>{setSectionMode(true);setSectionIdx(0);}}
        style={{
          flex:1,
          background:T.card,border:`1px solid ${eObj?eObj.color+"40":T.border}`,
          borderRadius:8,padding:"11px",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          fontFamily:"Georgia,serif",fontSize:14,color:eObj?eObj.color:gold,
          cursor:"pointer",letterSpacing:"0.05em"
        }}>
        <span style={{fontSize:16}}>▶</span> Predicar por secciones ({total} partes)
      </button>
      <button
        onClick={()=>setShowControls(c=>!c)}
        style={{
          background:showControls?(eObj?eObj.color+"25":T.card):"none",
          border:`1.5px solid ${showControls?(eObj?eObj.color:gold):T.border}`,
          borderRadius:8,padding:"11px 16px",
          fontFamily:"Georgia,serif",fontSize:15,
          color:showControls?(eObj?eObj.color:gold):T.muted,
          cursor:"pointer",letterSpacing:"0.08em",fontWeight:700
        }}
        title="Ajustar fuente y tema">Aa</button>
    </div>
  );

  return <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontSize}}>
    <SermonTimer secs={timerSecs} running={timerRunning} onToggle={onTimerToggle} onReset={onTimerReset}/>
    {toggleBtn}
    {showControls && <ControlsPanel/>}

    {/* Render all sections in order */}
    {sections.map((sec,i)=>(
      <div key={sec.id} style={{marginBottom:32}}>
        {sec.render()}
      </div>
    ))}

    {/* ── CIERRE ──────────────────────────────────────── */}
    <div style={{textAlign:"center",padding:"24px 0 8px",borderTop:`1px solid ${T.border}`}}>
      <div style={{fontSize:20,color:gold,letterSpacing:"0.3em",marginBottom:8}}>✦ ✦ ✦</div>
      <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:T.muted}}>
        Preparado con MÉTODO PREDICA™
      </div>
    </div>
  </div>;
}

function SectionHead({ label, icon, T, fsL }) {
  const tColor = T ? T.muted : "#7A6B52";
  const line   = T ? T.border : "#2A1F0E";
  const sz     = fsL || 10;
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
    <span style={{fontSize:sz,color:gold}}>{icon}</span>
    <span style={{fontSize:sz,letterSpacing:"0.2em",textTransform:"uppercase",color:tColor}}>{label}</span>
    <div style={{flex:1,height:"0.5px",background:line}}/>
  </div>;
}

function Section({ label, children }) {
  return <div style={{marginBottom:20}}>
    <div style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#7A6B52",marginBottom:8,paddingBottom:8,borderBottom:"1px solid #3D2E18"}}>{label}</div>
    {children}
  </div>;
}


// ─── 12 SERMONES DE EJEMPLO ──────────────────────────────────────────────────
const DEMOS = [
  {
    id:"demo-expositivo", estructuraTipo:"expositivo",
    titulo:"La fe que mueve montañas — Hebreos 11 versículo a versículo",
    pasaje:"Hebreos 11:1-6 · El capítulo de la fe",
    tema:"La fe bíblica no es sentimiento ni optimismo, sino convicción activa basada en la Palabra de Dios.",
    revelacion:"Al estudiar Hebreos 11, el Espíritu me detuvo en el versículo 1. No es esperanza vaga. Es certeza. Convicción. La fe genuina siempre produce acción.",
    nucleo:"La fe verdadera no espera ver para creer — actúa porque ya está convencida.",
    estructura:{
      intro:"¿Cuántas veces has orado y en el fondo te has preguntado: ¿de verdad va a pasar? Hoy vamos al capítulo de la fe — Hebreos 11. Pero no vamos a correr. Vamos a detenernos en los primeros seis versículos.",
      p1:{t:"La fe tiene una definición precisa (v.1)",v:"Hebreos 11:1",d:"El autor no dice que la fe es creer que algo puede pasar. Dice que es certeza — hypostasis en griego, literalmente sustancia o fundamento. La fe tiene peso real. Abraham no negó que su cuerpo estaba muerto. Pero tenía certeza de que Dios era más real que su biología."},
      p2:{t:"La fe tiene un historial probado (vv.2-4)",v:"Hebreos 11:2-4",d:"Por ella alcanzaron buen testimonio los antiguos. Abel ofreció por fe. Enoc agradó a Dios sin templo, sin ley escrita, solo con fe. La fe no depende del contexto religioso externo, sino de la relación interna con Dios."},
      p3:{t:"La fe tiene un requisito fundamental (vv.5-6)",v:"Hebreos 11:6",d:"Sin fe es imposible agradar a Dios. No difícil. Imposible. Quien se acerca debe creer que Dios existe y que recompensa a quienes le buscan. Dos convicciones. Una sobre su existencia, otra sobre su carácter."},
      p4:{t:"",v:"",d:""},
      conclusion:"La fe bíblica no es un salto al vacío — es un paso firme sobre terreno reconocido como sólido. ¿En qué área necesitas pasar de esperanza vaga a fe activa?"
    },
    ilustraciones:[{tipo:"Analogía",texto:"Un ingeniero no espera que el puente aguante — lo sabe, porque estudió las especificaciones. Eso es fe bíblica: confianza basada en el conocimiento del carácter de Dios, no esperanza ciega."}],
    aplicacion:["Identifica un área donde tienes esperanza pero no fe activa. Escribe el paso concreto que daría alguien que realmente cree.","Lee Hebreos 11 completo y subraya la frase por fe cada vez que aparece."],
    llamado:"Si hoy reconoces que has vivido con esperanza religiosa pero sin la certeza de Hebreos 11, ora: Señor, aumenta mi fe. Pasa mi confianza de mi cabeza a mis pies."
  },
  {
    id:"demo-textual", estructuraTipo:"textual",
    titulo:"Todo lo puedo — Filipenses 4:13 sin malentendidos",
    pasaje:"Filipenses 4:13 · Todo lo puedo en Cristo que me fortalece",
    tema:"Recuperar el significado real de este versículo: no es promesa de éxito en todo, sino poder para contentarse en cualquier circunstancia.",
    revelacion:"Este versículo es uno de los más citados y más mal entendidos. Lo ponemos en ropa deportiva y en negocios. Pero Pablo lo escribió desde la cárcel.",
    nucleo:"El poder de Cristo no te garantiza ganar todo — te capacita para estar en paz en cualquier condición.",
    estructura:{
      intro:"¿Cuántas personas han citado Filipenses 4:13 antes de un partido pensando que Dios garantizaba el resultado? Hoy vamos a devolver este versículo a su contexto y descubrir que su significado real es mucho más poderoso.",
      p1:{t:"El todo que Pablo describe no es lo que creemos",v:"Filipenses 4:11-13",d:"El versículo 13 no está solo. Está dentro de un párrafo sobre contentamiento — aprender a estar satisfecho en toda circunstancia. El todo no se refiere a proyectos y metas. Se refiere a todos los estados de vida: abundancia y necesidad, honor y humillación, libertad y cadenas. Pablo estaba preso cuando escribió esto."},
      p2:{t:"En Cristo — la fuente importa tanto como el poder",v:"Filipenses 4:13 · Juan 15:5",d:"En Cristo no es frase decorativa. Es la clave. El poder no es autoayuda espiritual. Cristo no da energía para lograr los planes de Pablo — le da paz para abrazar el plan de Dios aunque duela. La misma palabra griega endunamoúnti aparece en Efesios 6 para la armadura de Dios. Es fuerza para aguantar, no solo para avanzar."},
      p3:{t:"He aprendido — la fe tiene que ejercitarse",v:"Filipenses 4:11",d:"Pablo dice he aprendido — en tiempo perfecto griego. El contentamiento no llega automáticamente con la conversión. Se aprende. Se practica en las crisis pequeñas para estar listo en las grandes. Cada vez que eliges paz en lugar de pánico, entrenas tu fe."},
      p4:{t:"",v:"",d:""},
      conclusion:"Filipenses 4:13 no es un versículo de estadio deportivo. Es el testimonio de un preso que encontró algo más sólido que sus circunstancias. ¿En qué situación necesitas esta clase de fuerza — no para ganar, sino para no quebrarte?"
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Una hermana perdió su trabajo, su mamá murió el mismo mes y su esposo pidió el divorcio. Me dijo: No entiendo nada. Pero estoy en paz. Eso es Filipenses 4:13 en carne y hueso."}],
    aplicacion:["Memoriza Filipenses 4:11-13 completo, no solo el versículo 13. El contexto es parte del mensaje.","Identifica la circunstancia donde más necesitas esta paz. Ora específicamente por ella esta semana."],
    llamado:"Si hay una circunstancia que te tiene al borde del quiebre, recibe este versículo completo: Cristo no te promete que vas a ganar. Te promete que no vas a quebrarte."
  },
  {
    id:"demo-tematico", estructuraTipo:"tematico",
    titulo:"El perdón que libera — por qué perdonar es para ti, no para el otro",
    pasaje:"Mateo 18:21-35 · Efesios 4:31-32 · Colosenses 3:13 · Lucas 23:34",
    tema:"El perdón bíblico no es un sentimiento ni aprobación del daño. Es una decisión liberadora que nos desata a nosotros mismos de la prisión del resentimiento.",
    revelacion:"He visto demasiadas personas destruidas no por lo que les hicieron, sino por lo que guardan adentro. El resentimiento es veneno que uno toma esperando que el otro muera.",
    nucleo:"Perdonar no es justificar el daño — es negarte a dejar que ese daño siga destruyéndote.",
    estructura:{
      intro:"Hay personas en esta sala que llevan años cargando algo que alguien les hizo. Hoy vamos a hablar del perdón — no el sentimental que pide fingir, sino el bíblico que puede devolverte la vida.",
      p1:{t:"El perdón que Dios ordena — no es opcional",v:"Efesios 4:31-32 · Colosenses 3:13",d:"Pablo no sugiere el perdón como buena idea. Lo ordena. Perdonaos como Dios os perdonó en Cristo. ¿Cómo perdona Dios? Sin que lo merezcamos, sin esperar que cambiemos primero. Colosenses añade: como el Señor os perdonó. No es metáfora — es el modelo."},
      p2:{t:"El perdón que Jesús enseña — la deuda cancelada",v:"Mateo 18:21-35",d:"Un siervo al que le perdonaron una deuda impagable salió y estranguló a otro que le debía poco. El mensaje: quien ha sido perdonado enormemente y no perdona pequeñeces, no ha entendido el evangelio. Cualquier deuda que alguien nos deba es astronómicamente menor a la que nos fue perdonada."},
      p3:{t:"El perdón que Jesús modeló — desde la cruz",v:"Lucas 23:34",d:"Padre, perdónalos porque no saben lo que hacen. Jesús dijo esto mientras lo clavaban. No después. En plena agonía. El perdón cristiano no espera que el dolor pase, no espera que el otro pida disculpas. Se decide en medio del sufrimiento. Y libera al que perdona antes que al perdonado."},
      p4:{t:"",v:"",d:""},
      conclusion:"Perdonar no significa que lo que te hicieron estuvo bien. Significa soltar el derecho a la venganza y ponerlo en manos de Dios. Esa decisión — tomada en oración — es lo que te devuelve la libertad."
    },
    ilustraciones:[{tipo:"Analogía",texto:"El resentimiento es tomar veneno esperando que el otro muera. La persona que te lastimó posiblemente duerme bien cada noche. El único que se libera cuando perdonas eres tú."},{tipo:"Testimonio",texto:"Una mujer pasó 11 años sin hablarle a su hermana por una traición. Un día decidió orar por ella — no porque la mereciera, sino porque estaba cansada de cargar ese peso. Me dijo: No la perdoné por ella. La perdoné para poder respirar."}],
    aplicacion:["Escribe el nombre de quien más te cuesta perdonar. Debajo escribe: Hoy decido no dejar que lo que me hiciste siga destruyéndome. Suelto esto a Dios.","Ora por esa persona durante 7 días seguidos — que Dios la bendiga genuinamente. Es difícil odiar a alguien por quien oras de verdad."],
    llamado:"Si hay alguien a quien no has podido perdonar y eso te ha costado años de paz, hoy puedes tomar la decisión. No tienes que sentirlo. Solo tienes que decidirlo."
  },
  {
    id:"demo-textual-tematico", estructuraTipo:"textual-tematico",
    titulo:"Cuando Dios dice no — aprendiendo a confiar en sus respuestas difíciles",
    pasaje:"2 Corintios 12:7-10 · Romanos 8:28",
    tema:"¿Qué hacemos cuando oramos fervientemente y Dios responde con un no? La teología del no divino desde la experiencia de Pablo.",
    revelacion:"Pablo oró tres veces. Tres veces. Y Dios dijo no. Si le pasó al apóstol más grande, ¿por qué nos sorprende que nos pase? Los no de Dios no son abandono — son arquitectura.",
    nucleo:"El no de Dios no es el fin de tu historia — es la protección de algo que todavía no ves.",
    estructura:{
      intro:"La oración más difícil de sostener no es la que no recibe respuesta — es la que recibe un no claro. ¿Qué haces con eso? ¿Qué dice la Biblia de las negativas de Dios?",
      p1:{t:"Pablo y el aguijón — el no que Dios explicó",v:"2 Corintios 12:7-9",d:"Pablo describe algo que le causaba sufrimiento real. Oró tres veces pidiendo que fuera quitado. Y Dios respondió: no. Pero explicó el porqué: Para que no me enaltezca sobremanera. El aguijón tenía función: mantener la humildad de quien había visto el tercer cielo. Dios no dijo no por descuido — dijo no por diseño."},
      p2:{t:"El no como arquitectura — Dios construye con lo que queremos quitar",v:"Romanos 8:28 · Génesis 50:20",d:"Todas las cosas ayudan a bien. No dice que todas las cosas son buenas. Dice que Dios las hace cooperar hacia un bien mayor. José fue vendido como esclavo — no quería eso. Cada no a su libertad fue un sí a una posición que salvaría naciones. El no de Dios frecuentemente es la pieza que necesita para que tu rompecabezas tenga sentido."},
      p3:{t:"La respuesta correcta al no — donde llegó Pablo",v:"2 Corintios 12:9-10",d:"Me gloriaré más bien en mis debilidades. Pablo no toleró el aguijón resignadamente. Lo recibió como vehículo de la gloria de Dios. Cuando soy débil, entonces soy fuerte. El poder de Cristo se perfecciona en la debilidad humana. Los no nos vacían de la autosuficiencia que impide que Dios actúe con toda su capacidad."},
      p4:{t:"",v:"",d:""},
      conclusion:"No todos los no de Dios vienen con explicación en esta vida. Pero lo que sí tenemos es su carácter como garantía: no dice no por descuido, por olvido, ni por falta de poder."
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Oré durante dos años por una puerta ministerial que nunca se abrió. En ese tiempo preparé materiales, estudié, cometí errores que me enseñaron más que cualquier éxito. Tres años después entendí que si esa puerta hubiera abierto cuando yo quería, habría entrado sin estar listo."}],
    aplicacion:["Escribe los no de Dios que más te han dolido. Junto a cada uno: ¿Qué aprendí que no habría recibido si el sí hubiera llegado antes?","Memoriza 2 Corintios 12:9 esta semana. Recítalo cuando sientas que Dios no responde."],
    llamado:"Si hoy cargas un no que todavía duele, haz esta oración: Señor, no entiendo. Pero confío en tu carácter. Lo que construyes con mis pérdidas es mejor que lo que yo construiría con mis ganancias."
  },
  {
    id:"demo-biografico", estructuraTipo:"biografico",
    titulo:"Elías: el profeta que quería morir — cuando los valientes se quiebran",
    pasaje:"1 Reyes 19:1-18 · El agotamiento de Elías bajo el enebro",
    tema:"El mismo Elías que llamó fuego del cielo quiso morir de agotamiento. Su historia normaliza el quebranto del siervo de Dios y muestra cómo Dios restaura.",
    revelacion:"Elías acababa de ganar su mayor victoria en el Carmelo. Y al día siguiente quería morir. La crisis espiritual no siempre llega en la derrota — a veces llega justo después del triunfo.",
    nucleo:"Dios no abandona a sus siervos cuando se quiebran — los alimenta, los deja descansar y los vuelve a enviar.",
    estructura:{
      intro:"¿Alguna vez has hecho algo grande para Dios y al día siguiente sentiste que no valía la pena? Hoy conocemos a un hombre que lo sintió — y tenía suficiente curriculum espiritual para saber que no debía. Eso no lo detuvo.",
      p1:{t:"El contexto y llamado — el hombre más valiente del momento",v:"1 Reyes 18:36-40 · 1 Reyes 19:1",d:"Elías acababa de protagonizar el momento más épico de su ministerio: el Carmelo. Solo contra 450 profetas de Baal. Cayó fuego del cielo, el pueblo cayó de rodillas. Y entonces llegó un mensaje de Jezabel: Mañana serás como uno de ellos. Una sola amenaza de una sola mujer después de una victoria sobre 450 profetas. Y Elías huyó."},
      p2:{t:"La crisis — agotamiento, miedo y deseos de morir",v:"1 Reyes 19:3-5",d:"Se fue por su vida. Caminó un día al desierto, se sentó bajo un enebro y pidió morir: Basta ya, Señor, quítame la vida. El agotamiento espiritual no distingue entre fuertes y débiles. Llega cuando la batalla ha sido demasiado larga, la soledad demasiado profunda y el cuerpo ya no sostiene lo que el espíritu exige. La depresión del siervo de Dios es real. No es falta de fe — es humanidad."},
      p3:{t:"La respuesta de Dios — ningún sermón, solo pan y sueño",v:"1 Reyes 19:5-8",d:"Dios lo dejó dormir. Luego lo despertó con pan recién horneado y agua. Levántate y come, porque largo camino te resta. No le predicó. No lo reprendió. No cuestionó su fe. Le dio comida. Le dio descanso. Y en el silencio de Horeb, en la voz apacible — no en el viento, no en el terremoto, no en el fuego — le preguntó: ¿Qué haces aquí, Elías? Y lo devolvió a su misión, con compañía: llama a Eliseo."},
      p4:{t:"",v:"",d:""},
      conclusion:"Si hoy estás bajo tu enebro — si has servido mucho y parte de ti quiere rendirse — el Dios de Elías es también tu Dios. Su primera respuesta no va a ser un sermón. Va a ser: come, duerme, descansa. Y cuando estés listo, te enviará de nuevo."
    },
    ilustraciones:[{tipo:"Analogía",texto:"El atleta más preparado se lesiona si no descansa. No por falta de entrenamiento — por exceso sin recuperación. Los siervos de Dios no somos la excepción. El descanso no es falta de fe. Es sabiduría."},{tipo:"Ejemplo bíblico",texto:"Juan el Bautista también dudó desde la cárcel: ¿Eres tú el que había de venir? El mismo que señaló al Cordero de Dios. El quebranto de los grandes siervos está en la Biblia para normalizarlo y mostrar la fidelidad de Dios con ellos."}],
    aplicacion:["Si estás en agotamiento espiritual, empieza por lo físico: duerme más, come mejor, descansa. Dios alimentó a Elías antes de hablarle.","Identifica si hay alguien que podría ser tu Eliseo — alguien que camine contigo. El ministerio solitario es el más vulnerable al quebranto."],
    llamado:"Si hoy te identificas con Elías bajo el enebro, puedes decirle a Dios exactamente cómo te sientes — basta ya incluido. Él solo viene, te toca y dice: Levántate y come."
  },
  {
    id:"demo-doctrinal", estructuraTipo:"doctrinal",
    titulo:"La gracia — lo que Dios da sin que nadie lo merezca",
    pasaje:"Efesios 2:1-10 · Tito 2:11-14 · Romanos 5:20-21",
    tema:"La gracia no es solo perdón de pecados pasados — es el poder que transforma el carácter, la motivación y la manera de vivir del creyente.",
    revelacion:"Muchos creyentes entienden la gracia como la puerta de entrada pero no como el combustible de toda la vida cristiana. Vivimos como si tuviéramos que ganarnos el favor de Dios. Eso no es gracia — es religión con vocabulario cristiano.",
    nucleo:"La gracia no solo te perdona al inicio — te transforma y te sostiene hasta el final.",
    estructura:{
      intro:"Si le preguntas a un creyente promedio qué es la gracia, dirá: es que Dios me perdonó. Verdad. Pero es solo una fracción. Hoy vamos a estudiarla para que cambie la manera en que te relacionas con Dios mañana.",
      p1:{t:"¿Qué enseña la Biblia sobre la gracia?",v:"Efesios 2:1-9 · Tito 2:11",d:"Efesios 2 la define en contraste: antes éramos muertos en delitos. No enfermos — muertos. Los muertos no pueden cooperar con su resurrección. La gracia no fue la ayuda que Dios nos dio para que hiciéramos el resto. Fue todo. Por gracia sois salvos por medio de la fe — esto no de vosotros, es don de Dios."},
      p2:{t:"¿Por qué importa esta doctrina hoy?",v:"Romanos 5:20-21 · Romanos 6:1-2",d:"Sin entender la gracia correctamente producimos dos herejías opuestas: el legalismo (trato de ganarme lo que ya me fue dado) y el libertinaje (puedo vivir como quiera). Pablo anticipó la segunda: ¿Pecaremos para que la gracia abunde? Y respondió con la palabra más fuerte de la carta: ¡De ninguna manera! La gracia genuina no da permiso para el pecado — produce odio al pecado."},
      p3:{t:"¿Cómo transforma la gracia la manera de vivir?",v:"Tito 2:12-14 · 2 Corintios 5:14",d:"La gracia nos enseña — es pedagógica. Enseña a renunciar a la impiedad y vivir sobria, justa y piadosamente. No produce pasividad moral — produce obediencia gozosa. La diferencia entre obedecer por miedo y obedecer por gracia es la motivación: uno obedece para no perder algo, el otro porque ya lo tiene todo."},
      p4:{t:"",v:"",d:""},
      conclusion:"La gracia de Dios no es doctrina para debatir — es el aire que el creyente respira. La pregunta ya no es ¿qué tengo que hacer para que Dios me acepte? sino ¿qué quiero hacer para quien ya me aceptó completamente?"
    },
    ilustraciones:[{tipo:"Analogía",texto:"Alguien paga tu deuda imposible sin que te lo merezcas. ¿Cómo tratarías a esa persona después? ¿Con indiferencia o con gratitud profunda? Eso es lo que la gracia produce en quien la recibe de verdad: no obligación, sino devoción."}],
    aplicacion:["Examina tu motivación para servir a Dios esta semana: ¿miedo, hábito o amor genuino? La respuesta revela cuánto has interiorizado la gracia.","Lee Efesios 2:1-10 en voz alta cada mañana. Deja que la verdad cambie cómo comienzas el día."],
    llamado:"Si has vivido el cristianismo como lista de requisitos para mantener el favor de Dios, hoy puedes descansar. La gracia dice: ya tienes su favor. Completamente. Para siempre."
  },
  {
    id:"demo-evangelistico", estructuraTipo:"evangelistico",
    titulo:"La pregunta que Dios le hace a todos — ¿Quién dices que soy yo?",
    pasaje:"Mateo 16:13-17 · Juan 14:6 · Romanos 10:9-10",
    tema:"En algún momento cada persona tiene que responder la misma pregunta que Jesús le hizo a Pedro. De esa respuesta depende todo lo demás.",
    revelacion:"Vivimos en una cultura que acepta a Jesús como maestro o filósofo. Pero Jesús nunca dejó esa opción abierta. Preguntó: ¿Quién decís que soy? Y la respuesta lo cambia todo.",
    nucleo:"Jesús no es una opción entre muchas — es la única respuesta a la pregunta más importante de tu vida.",
    estructura:{
      intro:"Pregunta directa antes de comenzar: ¿quién es Jesús para ti? No el de los cuadros ni el de la infancia. El real. Hoy vamos a escuchar la misma pregunta que él le hizo a sus discípulos — y que todavía hace.",
      p1:{t:"La condición humana — el vacío que todos conocemos",v:"Eclesiastés 3:11 · Romanos 3:23",d:"Dios puso eternidad en el corazón del hombre. Hay algo que sabe que existe algo más grande. Ese vacío lo llenamos con éxito, relaciones, placer — y ninguno lo llena permanentemente. Romanos 3:23: todos pecaron y están destituidos de la gloria de Dios. No acusación — diagnóstico. Un buen diagnóstico es el primer paso hacia el tratamiento."},
      p2:{t:"La solución — quién es Jesús realmente",v:"Juan 14:6 · Mateo 16:16-17",d:"Cuando Jesús preguntó quién decís que soy, Pedro respondió: Tú eres el Cristo, el Hijo del Dios viviente. Jesús lo confirmó. Luego dijo: yo soy el camino, la verdad y la vida. No un camino entre muchos. El camino. La verdad. La vida. O era Señor, o era mentiroso, o era lunático. Las tres opciones son posibles. La primera tiene peso histórico, evidencial y experiencial."},
      p3:{t:"La decisión — qué implica responder sí",v:"Romanos 10:9-10 · Lucas 9:23",d:"Jesús nunca ocultó el costo. Si alguno quiere venir en pos de mí, niéguese a sí mismo y tome su cruz. Seguirlo no es agregar una creencia. Es un cambio de señorío. Romanos 10:9-10: confesar con la boca que Jesús es el Señor y creer en el corazón que Dios lo resucitó. Dos actos — uno externo, uno interno — que juntos producen salvación."},
      p4:{t:"",v:"",d:""},
      conclusion:"La pregunta de Mateo 16 sigue abierta para ti hoy. ¿Quién es Jesús para ti? Si tu respuesta es quiero que sea mi Señor, hoy es el momento de comenzar esa conversación."
    },
    ilustraciones:[{tipo:"Analogía",texto:"Estás perdido y alguien dice: Yo conozco el camino. Puedes no creerle, seguirle a medias, o confiar completamente. Jesús no dice yo conozco un camino. Dice yo SOY el camino. La diferencia no es semántica — es absoluta."}],
    aplicacion:["Si tomaste la decisión hoy, díselo a alguien esta semana. La fe que no se confiesa es frágil.","Lee el Evangelio de Juan en 30 días — un capítulo por día. Deja que Jesús se presente en sus propias palabras."],
    llamado:"Si hoy quieres responder sí a la pregunta de Jesús, puedes hacer esta oración: Jesús, creo que eres quien dices ser. Perdóname. Sé el Señor de mi vida."
  },
  {
    id:"demo-ocasional", estructuraTipo:"ocasional",
    titulo:"Lo que Dios une — una palabra pastoral para una boda",
    pasaje:"Génesis 2:18-24 · Efesios 5:25-33 · Eclesiastés 4:9-12",
    tema:"El matrimonio es una institución divina que requiere gracia, compromiso y la presencia de Dios como tercera cuerda para sostenerse en el tiempo.",
    revelacion:"Lo más hermoso de oficiar bodas no es el vestido ni las flores. Es mirar a dos personas en el umbral de algo para lo que ningún ser humano está completamente preparado — y ver cómo la gracia los acompaña de todos modos.",
    nucleo:"El matrimonio no es el fin del camino de amor — es el comienzo del amor que requiere más valentía.",
    estructura:{
      intro:"Hoy es el día que muchos esperan como el más feliz de sus vidas. Y lo es. Pero lo que comienzan hoy no se sostiene con sentimientos — se sostiene con decisiones. Y eso es mucho mejor que los sentimientos, porque las decisiones pueden renovarse cada mañana.",
      p1:{t:"El origen — lo que Dios diseñó",v:"Génesis 2:18-24",d:"El matrimonio no fue una idea cultural. Fue Dios quien dijo: No es bueno que el hombre esté solo. Y Dios mismo construyó la primera unión. Cuando Adán vio a Eva, lo primero que hizo fue celebrar — en poesía. El matrimonio nació en un jardín, en presencia de Dios, como el ambiente donde dos seres humanos podían conocerse y multiplicar la imagen de Dios."},
      p2:{t:"El amor que se requiere — más allá del enamoramiento",v:"Efesios 5:25 · Eclesiastés 4:9-12",d:"Efesios 5:25 no dice si sienten amor, trátense bien. Dice amad como Cristo amó a la iglesia. El amor de Cristo no fue sentimiento — fue decisión sacrificial. Eso es lo que el matrimonio requiere. Eclesiastés 4 habla de la cuerda de tres dobleces que no se rompe fácilmente. Esa tercera cuerda es Dios. Las parejas que lo mantienen en el centro tienen algo que las sostiene cuando los dos hilos humanos están al límite."},
      p3:{t:"La bendición que les dejamos hoy",v:"Números 6:24-26",d:"Que el Señor los bendiga y los guarde. Que hagan de su hogar un lugar donde Dios sea bienvenido. Que aprendan a pedir perdón antes de que el sol se ponga. Que elijan el uno al otro todos los días, no solo hoy. Que cuando lleguen las tormentas — y llegarán — recuerden que se prometieron quedarse."},
      p4:{t:"",v:"",d:""},
      conclusion:"Lo que Dios une hoy, que su gracia lo sostenga mañana y por todos los años que vienen. Que este día no sea solo el más hermoso — sea el primero de una historia que sigue escribiéndose con fidelidad y perdón."
    },
    ilustraciones:[{tipo:"Analogía",texto:"El matrimonio es como un jardín: el día de la boda es cuando siembras. Los años siguientes son cuando riegas, podas, cuidas. Un jardín hermoso no es resultado de un día emocionante — es de años de atención fiel."}],
    aplicacion:["Para los novios: esta semana aparte 15 minutos cada noche para orar juntos. Es el hábito más poderoso con que pueden comenzar.","Para los presentes: si están casados, que este día sea recordatorio de sus propias promesas."],
    llamado:"Oremos por esta pareja. Padre, tú que eres el autor de este amor, sé también su sustentador. Que tu gracia sea suficiente para todos los días que vienen."
  },
  {
    id:"demo-tres-puntos", estructuraTipo:"tres-puntos",
    titulo:"Tres razones para no rendirse — cuando todo parece perdido",
    pasaje:"Romanos 5:3-5 · Santiago 1:2-4 · 2 Corintios 4:16-18",
    tema:"La Biblia no promete vida sin sufrimiento — promete que el sufrimiento tiene propósito y que hay razones concretas para seguir adelante.",
    revelacion:"Hay personas al borde de rendirse. No de renunciar a la fe, sino de soltar la esperanza y la lucha. El Espíritu me mostró que la Biblia habla directamente a ese estado — no con platitudes, sino con razones reales.",
    nucleo:"No te rindas — no porque sea fácil, sino porque el sufrimiento está produciendo algo que todavía no puedes ver.",
    estructura:{
      intro:"Le hablo hoy a alguien específico: a la persona que esta semana pensó Ya no puedo más. Que está cansada de luchar, de orar, de esperar. Este mensaje tiene tres razones concretas para que no te rindas hoy.",
      p1:{t:"El sufrimiento tiene un producto",v:"Romanos 5:3-5 · Santiago 1:2-4",d:"Pablo enumera una cadena: tribulación → paciencia → prueba → esperanza. No dice que el sufrimiento es bueno. Dice que produce algo bueno. Santiago confirma: la prueba de vuestra fe produce paciencia. Paciencia en griego — hypomone — no es pasividad. Es la capacidad de aguantar bajo presión sin quebrarse. Eso se construye en el sufrimiento y solo en el sufrimiento."},
      p2:{t:"Lo visible es temporal, lo invisible es eterno",v:"2 Corintios 4:16-18",d:"Pablo describe dos realidades paralelas: el hombre exterior que se desgasta y el hombre interior que se renueva. Las cosas que se ven son temporales, pero las que no se ven son eternas. Cuando estás en el peor momento, lo que ves es lo más engañoso. Lo que no ves — la obra de Dios en tu interior, la persona en que te estás convirtiendo — eso es lo más real. No tienes información completa."},
      p3:{t:"No estás solo en esto",v:"1 Corintios 10:13 · Hebreos 4:15-16",d:"No os ha sobrevenido ninguna tentación que no sea humana. Lo que vives no es único — otros han estado ahí y han salido. Y tienes un Sumo Sacerdote tentado en todo según vuestra semejanza. Jesús conoce el límite humano por experiencia propia. Hebreos 4:16 dice que puedes llegar confiadamente al trono de la gracia para hallar gracia en el oportuno socorro."},
      p4:{t:"",v:"",d:""},
      conclusion:"Tres razones para no rendirte: el sufrimiento está produciendo algo, lo que no ves es más real que lo que ves, y no estás solo. No pido que finjas estar bien. Pido que des un día más. Solo uno."
    },
    ilustraciones:[{tipo:"Analogía",texto:"El bambú chino pasa 4 años bajo tierra sin que nadie vea nada. En el año 5 crece 27 metros en 6 semanas. ¿Estaba muerto? No — construía el sistema de raíces que sostendría ese crecimiento explosivo."}],
    aplicacion:["Cuando llegue el pensamiento de rendirte, escribe: ¿Cuál es la razón más pequeña para dar un día más? Solo una. Solo hoy.","Busca a alguien de confianza y cuéntale cómo estás realmente. El aislamiento amplifica la desesperanza."],
    llamado:"Si hoy estás al borde de rendirte, pídele a Dios gracia para un día más. Solo uno. Y confía en que es suficiente."
  },
  {
    id:"demo-inductivo", estructuraTipo:"inductivo",
    titulo:"¿Por qué hacemos lo que no queremos? — Romanos 7 y la lucha interna",
    pasaje:"Romanos 7:15-25 · Gálatas 5:16-17",
    tema:"La lucha interna del creyente no es señal de falta de fe — es evidencia de vida espiritual. Y tiene solución.",
    revelacion:"La pregunta que más me hacen en consejería no es de doctrina — es la lucha interna: ¿Por qué sigo haciendo lo que sé que está mal? Pablo tuvo exactamente esa lucha, y su honestidad es uno de los textos más liberadores de la Biblia.",
    nucleo:"La guerra interior no es señal de que fallaste — es señal de que estás vivo espiritualmente. Y Cristo es la salida.",
    estructura:{
      intro:"Pregunta honesta para comenzar — no la respuesta correcta, la verdadera: ¿cuántas veces has hecho algo que prometiste no volver a hacer? Si la respuesta es muchas, bienvenido al club. Y bienvenido al pasaje de Romanos 7.",
      p1:{t:"Todos luchamos — la brecha entre el querer y el hacer",v:"Romanos 7:15,18-19",d:"Pablo, el apóstol más influyente, escribió esto: No hago el bien que quiero, sino el mal que no quiero, eso hago. Si Pablo luchó con esto, ¿por qué esperamos que nosotros no? La brecha entre lo que queremos ser y lo que somos en el peor momento es una experiencia humana universal. La Biblia lo llama la guerra entre la carne y el espíritu."},
      p2:{t:"La raíz — no es la voluntad, es el poder",v:"Romanos 7:23 · Gálatas 5:16-17",d:"Pablo identifica otra ley en mis miembros que pelea contra la ley de mi mente. El problema no es falta de información ni voluntad. Es que hay una tendencia — la carne — que jala en dirección contraria. Gálatas confirma: el deseo de la carne es contra el Espíritu. Esto no desaparece en la conversión. Se intensifica, porque ahora hay dos naturalezas en tensión activa. Luchar no te hace mal cristiano — te hace cristiano real."},
      p3:{t:"La salida — no esfuerzo, sino rendición",v:"Romanos 7:24-8:1 · Gálatas 5:16",d:"Pablo gritó: ¡Miserable de mí! Y respondió: ¡Gracias doy a Dios por Jesucristo! La solución no es esforzarse más — es rendirse a quien tiene el poder de transformar desde adentro. Gálatas 5:16 da la clave: Andad en el Espíritu y no satisfaréis los deseos de la carne. No dice luchen más fuerte contra la carne. Dice caminen en el Espíritu. La estrategia es positiva: no dejes de hacer X, sino llénate de Dios."},
      p4:{t:"",v:"",d:""},
      conclusion:"Aquí está la gran idea: la guerra interior no es evidencia de que Dios te abandonó — es evidencia de que estás vivo espiritualmente. La salida no es pelear más fuerte — es rendirte a quien ya ganó la guerra por ti."
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Durante años pensé que el hecho de que siguiera luchando significaba que mi conversión no había sido real. Hasta que leí Romanos 7 y me di cuenta de que Pablo describía exactamente mi experiencia. Eso no me liberó de la lucha. Me liberó de la vergüenza que me impedía buscar ayuda."}],
    aplicacion:["Cada vez que caigas en el patrón que quieres romper, di en voz alta: Gracias Señor porque no hay condenación para los que están en Cristo. Luego vuelve a caminar.","Identifica el contexto o disparador que activa la conducta que quieres cambiar. La batalla se gana antes, no durante."],
    llamado:"Hay salida. No por fuerza de voluntad. Por gracia. Por rendición. Por el poder del Espíritu que habita en ti. ¿Estás dispuesto a rendirte a él hoy?"
  },
  {
    id:"demo-lowry", estructuraTipo:"lowry",
    titulo:"El hijo que se quedó — la trampa de la obediencia sin amor",
    pasaje:"Lucas 15:25-32 · El hijo mayor de la parábola del hijo pródigo",
    tema:"Dentro de la iglesia existe una forma de perdición que nadie predica: la del que nunca se fue, cumple todo, sirve fielmente — pero por dentro está resentido y vacío.",
    revelacion:"El Espíritu me detuvo en el versículo 25: el hijo mayor estaba en el campo. Mientras el padre corría al pródigo, el mayor trabajaba. Y cuando llegó la fiesta, se negó a entrar. Hay personas en tu iglesia que llevan años en la casa pero hace mucho se fueron en su corazón.",
    nucleo:"Puedes estar en la casa del Padre toda la vida y nunca haber disfrutado al Padre — esa es la trampa más peligrosa de la religión.",
    estructura:{
      intro:"OOPS — Voy a hablarle al que nunca se fue. Al que lleva años en la iglesia sin faltar un domingo. Y sin embargo carga algo oscuro que no sabe nombrar. Algo que se activa cuando otro recibe una bendición. Que pregunta en silencio: ¿Y yo, Señor? Ese algo tiene nombre. Hoy lo sacamos a la luz.",
      p1:{t:"UGH — El siervo que no sabe que es hijo",v:"Lucas 15:29 · Isaías 29:13",d:"Tantos años te sirvo sin jamás transgredir tu mandamiento, y nunca me has dado ni un cabrito. No dice tantos años he vivido contigo. Dice te sirvo. La relación se redujo a un contrato laboral. Y lo más trágico: el padre le había dicho todas mis cosas son tuyas. Vivía en la abundancia sintiéndose pobre. Hay personas en la iglesia que llevan décadas sobre bendiciones que ven como salario, no como herencia."},
      p2:{t:"AHA — El padre sale a buscarlo",v:"Lucas 15:28b · Romanos 8:15",d:"Cuando el padre se entera de que el hijo mayor está afuera, furioso y negándose a entrar — sale él mismo. El mismo que corrió hacia el pródigo, ahora sale hacia el que se quedó. Porque Dios no tiene hijos favoritos. Y lo que le dice es la frase más tierna de toda la parábola: Hijo, tú siempre has estado conmigo, y todas mis cosas son tuyas. No empleado. Hijo. La identidad lo cambia todo."},
      p3:{t:"WHEE — La fiesta siempre estuvo abierta para él",v:"Lucas 15:31-32",d:"El padre no dice tienes razón, te fallé. Le revela una verdad que el hijo mayor había ignorado: Tú siempre has estado conmigo. La fiesta no era premio para el que mejor se portó — era celebración de la gracia que recupera lo perdido. Y el hijo mayor estaba invitado desde el primer momento. La puerta siempre estuvo abierta. Dios te dice lo mismo: la fiesta está pasando — y también para ti."},
      p4:{t:"",v:"",d:""},
      conclusion:"YEAH — La parábola termina incómoda: no sabemos si el hijo mayor entró. Y creo que es intencional. Porque el final lo escribes tú. Hoy Dios te pregunta: ¿vas a seguir afuera cargando resentimiento? ¿O vas a entrar? Entrar significa decirle: Me cansé de servir desde el miedo. Quiero ser hijo, no empleado."
    },
    ilustraciones:[{tipo:"Analogía",texto:"Alguien te regala una casa enorme. Pero tú decides vivir en el garaje y trabajar como mayordomo de tu propia casa porque sientes que no te la mereces. Así vive el cristiano con mentalidad de esclavo: heredero que se trata a sí mismo como sirviente."},{tipo:"Ejemplo bíblico",texto:"Jonás es el hijo mayor del Antiguo Testamento. Cuando Dios perdona a Nínive, Jonás se enoja: Sabía que eras misericordioso. El profeta fiel, furioso porque Dios fue bueno con quien en su opinión no lo merecía."}],
    aplicacion:["Pregúntate honestamente: ¿Estoy sirviendo a Dios por amor, o por miedo, costumbre o para sentirme mejor que otros?","Identifica a alguien cuya bendición te generó envidia. Ora por esa persona esta semana — que Dios genuinamente la bendiga."],
    llamado:"Si hay resentimiento, comparación o cansancio espiritual en ti, confiésalo silenciosamente al Señor: Señor, me cansé de ser empleado. Quiero volver a ser hijo."
  },
  {
    id:"demo-me-we", estructuraTipo:"me-we",
    titulo:"Cuando dejas de compararte — cómo recuperar tu propia historia",
    pasaje:"Gálatas 6:4 · 2 Corintios 10:12",
    tema:"La comparación es el ladrón más silencioso de la alegría. La Biblia tiene una alternativa radical: vivir desde tu propia historia con Dios.",
    revelacion:"Abrí Instagram y sentí una punzada que tardé en identificar: envidia. De alguien que considero mi amigo. Me asusté de mí mismo. Y empecé a buscar qué dice la Biblia sobre esto.",
    nucleo:"Dejar de compararte no es resignación — es el primer paso para vivir tu historia real con Dios.",
    estructura:{
      intro:"ME — Les voy a contar algo que me costó admitir. Vi el anuncio de algo que un amigo había logrado — algo que yo también quería. Y en vez de alegrarme, sentí un nudo en el pecho. Era envidia. Limpia, directa, de un amigo. Me quedé pensando: ¿qué clase de persona soy? Eso me llevó a buscar qué dice la Biblia sobre la comparación.",
      p1:{t:"WE — Todos lo hacemos, especialmente hoy",v:"2 Corintios 10:12",d:"Pablo escribió sobre personas que se miden a sí mismos por sí mismos. Y dijo: no son juiciosos. Pero hoy vivimos en el ambiente más diseñado para la comparación en la historia humana. Las redes son galerías de los mejores momentos de todos. Nuestro cerebro, que evolucionó para compararse con 50 personas de la aldea, ahora se compara con millones. El resultado es una epidemia de sensación de insuficiencia."},
      p2:{t:"GOD — Lo que dice la Biblia",v:"Gálatas 6:4 · Salmos 139:13-14",d:"Gálatas 6:4: Cada uno someta a prueba su propia obra, y tendrá motivo de gloriarse solo en sí mismo, y no en otro. La alternativa bíblica a la comparación no es indiferencia — es enfoque en tu propio camino. El Salmo 139 añade la razón teológica: fuiste formidable y maravillosamente hecho. No como producto en serie — como obra original. La comparación es una ofensa a la creatividad de Dios."},
      p3:{t:"YOU — ¿En qué área miras la vida del otro en lugar de construir la tuya?",v:"1 Corintios 12:7",d:"Hay algo específico que Dios te ha dado para hacer que nadie más puede hacer exactamente como tú. A cada uno le es dada la manifestación del Espíritu para provecho. Tu historia, tu personalidad, tus heridas, tus talentos — eso es exactamente lo que Dios usa. Cuando te comparas, dejas de cultivar tu parcela y te quedas mirando la del vecino. Las dos pierden."},
      p4:{t:"",v:"",d:""},
      conclusion:"WE — Imaginen una comunidad donde cada persona está tan enfocada en su propio llamado que ya no tiene tiempo de envidiar el del otro. Donde el logro del vecino se celebra. Esa comunidad empieza con una persona que decide soltar la comparación. Esa persona puede ser tú, hoy."
    },
    ilustraciones:[{tipo:"Analogía",texto:"Las flores no compiten entre sí. La rosa no trata de ser girasol. Cada una florece desde lo que es. La naturaleza que Dios creó no compite — colabora. Nosotros somos los únicos que medimos nuestro valor por el tamaño del jardín del otro."}],
    aplicacion:["Cada vez que sientas la comparación, pregúntate: ¿Qué estoy dejando de construir mientras miro lo que el otro construye?","Haz un inventario de 5 cosas únicas de tu historia o camino con Dios. No las compares — obsérvalas como dones."],
    llamado:"Si la comparación ha estado robando tu alegría, hoy puedes decidir una cosa: enfocarte en tu propia parcela. Porque la tuya necesita tu atención completa."
  },
  {
    id:"demo-problema-solucion", estructuraTipo:"problema-solucion",
    titulo:"El agotamiento espiritual — cuando ya no puedes más y no sabes por qué",
    pasaje:"Mateo 11:28-30 · Salmos 23 · Isaías 40:31",
    tema:"El agotamiento espiritual no es falta de fe — es señal de que algo necesita cambiar. Y Dios tiene una respuesta específica.",
    revelacion:"Noto un agotamiento en mi congregación que va más allá del físico. Es agotamiento del alma. Personas que oran pero no sienten nada. Que sirven sin alegría. El Espíritu me mostró que Jesús habló directamente a ese estado.",
    nucleo:"El descanso que Jesús ofrece no es inactividad — es una manera diferente de llevar la carga.",
    estructura:{
      intro:"¿Cuándo fue la última vez que te sentiste genuinamente lleno espiritualmente? No en el servicio, en tu día a día. Para muchas personas la respuesta es: no recuerdo. Y eso, aunque nadie lo dice en voz alta, es uno de los estados más comunes y silenciados dentro de la iglesia.",
      p1:{t:"El problema — el agotamiento espiritual real",v:"Mateo 11:28a · Apocalipsis 2:2-4",d:"Jesús dijo: Venid a mí todos los que estáis trabajados y cargados. La palabra griega kopiaō significa agotado por el trabajo. La iglesia de Éfeso en Apocalipsis 2 es la imagen perfecta: Has trabajado, has soportado, has perseverado... pero tienes contra ti que abandonaste tu primer amor. Puedes hacer todo bien y aun así estar vacío. Porque el problema no es la cantidad de actividad religiosa — es la ausencia de conexión."},
      p2:{t:"La raíz — cargamos lo que no nos toca cargar",v:"Mateo 11:28-30 · Gálatas 5:1",d:"Mi yugo es fácil y mi carga es ligera. Esta frase solo tiene sentido contrastada con la alternativa: el yugo que nosotros mismos nos ponemos. La expectativa de ser perfectos. La culpa que no soltamos. La responsabilidad de cargar lo que es de Dios y no nuestro. El agotamiento frecuentemente no viene de hacer demasiado para Dios — viene de cargar demasiado que no es de Dios."},
      p3:{t:"La solución — aprender de Jesús, no solo servirle",v:"Mateo 11:29 · Salmos 23:2-3",d:"Aprended de mí. La solución no es menos actividad — es un maestro diferente. Observar cómo vivía Jesús: despacio, con intención, con momentos de retiro, con límites claros. El Salmo 23 lo describe: pastos de reposo, aguas tranquilas — y restaura mi alma. La restauración requiere tiempo en la quietud con Dios. Isaías 40:31: los que esperan en el Señor renovarán sus fuerzas. Esperar no es inactividad — es soltar el control y recibir lo que solo Dios puede dar."},
      p4:{t:"",v:"",d:""},
      conclusion:"Si hoy estás agotado espiritualmente, no necesitas más disciplina religiosa — necesitas descanso real en la presencia de Dios. Hoy Jesús te hace la misma invitación: Ven a mí. No mejora. No esfuérzate más. Ven."
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Llegué al punto donde predicaba sobre la paz de Dios sin sentirla. Un amigo me preguntó: ¿Cuándo fue la última vez que estuviste con Dios sin tener que producir algo para él? No pude responder. Esa pregunta me cambió."},{tipo:"Analogía",texto:"Un hospital no puede operar si sus médicos están en colapso. Los cuidadores necesitan ser cuidados. No es debilidad — es sostenibilidad."}],
    aplicacion:["Agenda 20 minutos al día sin agenda espiritual: sin pedir, sin estudiar, sin interceder. Solo estar con Dios en silencio.","Identifica una carga que estás cargando y que en realidad le pertenece a Dios. Escríbela y entrégasela de forma concreta."],
    llamado:"Si reconoces ese agotamiento en ti, quiero invitarte a un solo acto: ven. No con tus fuerzas ni tu mejor versión. Ven exactamente como estás. Porque Jesús dijo venid a mí todos los que estáis cargados — y eso te incluye."
  },
  {
    id:"demo-homilia", estructuraTipo:"homilia",
    titulo:"Salmo 23 — el pastor que no falla (homilía versículo a versículo)",
    pasaje:"Salmos 23:1-6 · El salmo más conocido de la Biblia",
    tema:"El Salmo 23 no es solo un poema de consuelo — es una declaración teológica sobre el carácter de Dios que cubre toda la experiencia humana.",
    revelacion:"He leído el Salmo 23 cientos de veces. Pero esta vez me detuve en cada frase y pregunté: ¿qué implicación práctica tiene para la persona en el peor momento de su vida? El resultado fue asombroso.",
    nucleo:"El Dios que David describe en 6 versículos es suficiente para cada situación que puedas vivir.",
    estructura:{
      intro:"El Salmo 23 es posiblemente el texto más citado en funerales y hospitales. Pero hoy no lo vamos a leer solo para consolarnos — lo vamos a leer versículo a versículo para entender lo que David declaraba sobre Dios.",
      p1:{t:"Versículos 1-2 — Jehová es mi pastor, nada me faltará",v:"Salmos 23:1-2",d:"David no dice Jehová es un pastor. Dice mi pastor — posesivo, personal, presente. Y la consecuencia: nada me faltará. No promete que nunca habrá necesidad material. Dice que tendrá todo lo que verdaderamente necesita. En lugares de delicados pastos — en hebreo pastos verdes, evoca abundancia. Aguas de reposo — tranquilas, seguras. El pastor conoce cuáles aguas son peligrosas. Aplicación: ¿a quién o qué le estás pidiendo hoy que sea tu pastor? Solo uno de ellos no falla."},
      p2:{t:"Versículos 3-4 — En el valle de sombra de muerte",v:"Salmos 23:3-4",d:"Restaura mi alma — el verbo shub significa hacer volver. El alma que se alejó, el Dios la hace volver. Aunque ande en valle de sombra de muerte — tsalmávet en hebreo, oscuridad profunda, peligrosa. No metáfora de tristezas menores — es el fondo. Y ahí David dice dos cosas extraordinarias: no temeré — no niega el peligro, niega el miedo. Y tú estarás conmigo — en el valle, Dios pasa de ser distante a ser presente. Aplicación: ¿en qué valle estás hoy? Es exactamente ahí donde su presencia se vuelve más cercana."},
      p3:{t:"Versículos 5-6 — La mesa en presencia de mis angustiadores",v:"Salmos 23:5-6",d:"Aderezas mesa delante de mí en presencia de mis angustiadores. Un banquete en territorio enemigo. No después de la batalla — en medio de ella. Mi copa está rebosando — no llena al borde: rebosando. Y la conclusión: el bien y la misericordia me seguirán todos los días de mi vida. No espero que me sigan. Me seguirán. Y en la casa de Jehová moraré por largos días — la morada permanente con Dios es el destino final. Aplicación: ¿puedes hacer esta declaración tuya hoy?"},
      p4:{t:"",v:"",d:""},
      conclusion:"En 6 versículos David describió todo: provisión, restauración, guía, compañía en el valle, victoria sobre los enemigos, abundancia y morada eterna. La pregunta final es la misma del comienzo: ¿es Jehová tu pastor? ¿Posesivo, personal, presente?"
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Visité a una mujer en cuidados intensivos. Le pregunté si quería que leyera algo. Abrí en Salmos 23. Cuando llegué a aunque ande en valle de sombra de muerte, no temeré, vi que lloraba. No de miedo — de reconocimiento. El Salmo no le dio información nueva. Le recordó lo que sabía y necesitaba escuchar de nuevo."}],
    aplicacion:["Memoriza el Salmo 23 esta semana como declaración personal, no como ejercicio religioso.","Identifica en qué versículo del Salmo 23 estás viviendo hoy. Ora desde ese versículo específico."],
    llamado:"El Salmo 23 termina con una declaración de hogar: en la casa de Jehová moraré por largos días. Haz esa declaración tuya hoy: que no importa el valle que estés atravesando, el destino de tu vida es la presencia permanente de Dios."
  },
  {
    id:"demo-narrativo", estructuraTipo:"narrativo",
    titulo:"El día que Pedro caminó sobre el agua — y lo que pasó después",
    pasaje:"Mateo 14:22-33 · La caminata sobre el agua",
    tema:"La historia de Pedro sobre el agua no termina cuando se hunde — termina cuando Jesús lo sostiene. Y eso cambia lo que significa el fracaso en la fe.",
    revelacion:"Siempre me enfocaba en que Pedro miró el viento y se hundió. Pero el Espíritu me mostró que la historia real es lo que Jesús hizo a continuación: extendió la mano inmediatamente. Antes de que Pedro llegara al fondo.",
    nucleo:"Jesús no espera a que termines de hundirte para rescatarte — su mano llega mientras todavía estás cayendo.",
    estructura:{
      intro:"Son las tres de la mañana. El lago de Galilea está negro. El viento viene del norte con una fuerza que dobla los mástiles. Los doce llevan horas remando sin avanzar. Y entonces uno lo ve primero. Una figura. Caminando. Sobre el agua. El miedo se duplica: ¡Un fantasma! Y sobre el viento llega una voz: Soy yo. No temáis.",
      p1:{t:"Pedro pide lo imposible — y Jesús dice sí",v:"Mateo 14:28-29",d:"Lo que Pedro hace a continuación me asombra cada vez que lo leo. No dice gracias, qué alivio. Dice: Señor, si eres tú, manda que yo vaya a ti sobre las aguas. Y Jesús respondió con una sola palabra: Ven. No un sermón sobre la fe. Una invitación. Y Pedro soltó el borde de la barca. Dio un paso. Luego otro. El viento seguía rugiendo. Y Pedro caminaba. Sobre el agua. En medio de la tormenta."},
      p2:{t:"El momento en que todo cambia",v:"Mateo 14:30",d:"Viendo el fuerte viento, tuvo miedo. Una fracción de segundo de desviar la mirada del rostro de Jesús al viento. Y comenzó a hundirse. Pero hay algo que la mayoría pasa por alto: Pedro se hundía pero no era mudo. Señor, sálvame. Tres palabras. Las más importantes que dijo en su vida. No explicó por qué había fallado. No prometió hacerlo mejor. Simplemente pidió. Desde el fondo. Mientras se hundía. Ese es el grito de la fe imperfecta. Y es suficiente."},
      p3:{t:"La mano que llega inmediatamente",v:"Mateo 14:31-33",d:"Al momento Jesús, extendiendo la mano, le asió. Al momento. No después de que Pedro llegara al fondo. No después de que aprendiera la lección. Inmediatamente. La mano llegó mientras todavía estaba cayendo. Y lo que Jesús le dijo no fue ya te dije que ibas a fallar. Fue: ¿por qué dudaste? Una pregunta — no un juicio. Un diagnóstico — no una condena. Y los dos subieron juntos a la barca. La tormenta se calmó cuando Jesús y Pedro estaban juntos — no cuando Pedro caminó perfectamente."},
      p4:{t:"",v:"",d:""},
      conclusion:"La historia de Pedro sobre el agua no es sobre cómo tener suficiente fe para no hundirse. Es sobre cómo la mano de Jesús llega inmediatamente cuando te hundes y lo llamas. ¿Cuál es tu agua hoy? Y si comienzas a hundirte — ¿puedes confiar en que su mano llega al momento?"
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Di el paso de fe más grande de mi vida — y a los tres meses estaba hundiéndome. Pensé que había oído mal a Dios. Justo en el momento más oscuro, vino una ayuda que no esperaba, de donde no esperaba. No llegó cuando terminé de hundirme. Llegó mientras todavía caía."}],
    aplicacion:["Identifica el agua a la que Jesús te está llamando a salir de la barca. Escribe qué pasaría si dieras ese paso.","Si estás hundiéndote ahora mismo, practica las tres palabras de Pedro: Señor, sálvame. Y confía en que la mano llega."],
    llamado:"Si hoy estás en el agua y comienzas a hundirte, no tiene que ser el final. Puede ser el momento en que experimentas lo que Pedro experimentó: la mano inmediata de Jesús."
  },
  {
    id:"demo-triple-apelacion", estructuraTipo:"triple-apelacion",
    titulo:"Lo que Dios realmente piensa de ti — identidad vs. comportamiento",
    pasaje:"Romanos 8:1 · Efesios 1:3-7 · 1 Juan 3:1-2",
    tema:"Muchos creyentes definen su identidad por su comportamiento. La Biblia define el comportamiento por la identidad. Esa diferencia lo cambia todo.",
    revelacion:"La pregunta más frecuente en la vida espiritual no es ¿qué debo hacer? Es ¿quién soy yo? Y la respuesta determina absolutamente todo lo demás. La Biblia habla primero de identidad y luego de conducta — nosotros casi siempre lo hacemos al revés.",
    nucleo:"No eres lo que haces — eres lo que Dios dice que eres. Y lo que Dios dice que eres lo cambia todo lo que haces.",
    estructura:{
      intro:"Antes de que hagas nada hoy — antes de que decidas si eres suficientemente bueno o demasiado fallido — quiero que escuches tres declaraciones que la Biblia hace sobre ti. No sobre héroes de la fe. Sobre cualquier persona que ha puesto su confianza en Jesucristo.",
      p1:{t:"La verdad a creer — tu identidad legal ante Dios",v:"Romanos 8:1 · Efesios 1:3-7",d:"Ninguna condenación hay para los que están en Cristo Jesús. Declaración legal, no emocional. No dice ninguna condenación cuando te sientes bien. Dice ninguna. Efesios 1 acumula identidades: escogido antes de la fundación del mundo, adoptado como hijo, redimido, perdonado. No cosas que mereces — cosas que recibiste. Tu identidad ante Dios no es el resumen de tu comportamiento. Es el resultado de lo que Cristo hizo."},
      p2:{t:"La emoción a sentir — el afecto del Padre",v:"1 Juan 3:1",d:"Mirad cuál amor nos ha dado el Padre, para que seamos llamados hijos de Dios. Juan dice mirad — párate a contemplar esto. El amor que describe no es tolerancia divina. Es el amor que cambia el nombre: de extraños a hijos. ¿Cuándo fue la última vez que te detuviste a recibir el afecto de Dios, no para hacer algo con él, sino simplemente para ser amado? No como padre severo que revisa tus resultados. Como el padre del pródigo que corre antes de que llegues."},
      p3:{t:"La acción a tomar — vivir desde la identidad, no para ganarla",v:"1 Juan 3:2-3 · Romanos 12:1-2",d:"Todo aquel que tiene esta esperanza en él, se purifica a sí mismo. La conducta correcta nace de la identidad correcta, no al revés. No te purificas para ser hijo — te purificas porque ya lo eres. Ya no obedeces para que Dios te acepte. Obedeces porque ya te aceptó y eso produce gratitud que se convierte en obediencia. Esta semana: identifica una conducta que intentas cambiar por miedo o culpa. Cámbiala esta vez desde la identidad: soy hijo de Dios y esto no va con quién soy."},
      p4:{t:"",v:"",d:""},
      conclusion:"Lo que Dios piensa de ti no es el resumen de tu semana. Es una declaración que hizo sobre ti en Cristo. Eres amado. Eres aceptado. Eres su hijo. Y cuando eso entra de verdad — al intelecto, al corazón y a la voluntad — cambia absolutamente todo."
    },
    ilustraciones:[{tipo:"Historia personal",texto:"Durante años serví a Dios desde el miedo a no ser suficiente. Un pastor me preguntó: ¿Amarías a tu hijo más si sacara mejores notas? Inmediatamente dije no. Y él dijo: entonces ¿por qué crees que Dios te ama más cuando te portas mejor? Me derrumbé."},{tipo:"Analogía",texto:"Un árbol no produce fruto para demostrar que es árbol. Produce fruto porque es árbol. El fruto es consecuencia de la identidad, no prueba de ella. Así funciona la vida cristiana: primero la identidad, luego el fruto."}],
    aplicacion:["Escribe: Soy hijo/hija de Dios. Completamente amado/a. Completamente aceptado/a. Completamente perdonado/a. Ponlo donde lo veas cada mañana.","Identifica una conducta que quieres cambiar. Esta vez dite: Soy hijo de Dios y esto no va conmigo. No tengo que hacer esto."],
    llamado:"Si hoy te das cuenta de que has estado viviendo para ganarte lo que ya tienes, puedes descansar ahora mismo. No tienes que hacer nada para que Dios te ame más. Solo tienes que recibirlo. ¿Puedes hacer eso hoy?"
  }
];

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function StepsBar({ current }) {
  return <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:12,marginBottom:24}}>
    {STEPS.map((s,i)=><div key={i} style={{flexShrink:0,textAlign:"center",opacity:i>current?0.35:1}}>
      <div style={{width:32,height:32,borderRadius:"50%",border:`1.5px solid ${i===current?gold:i<current?"#3D8A5E":"#3D2E18"}`,background:i<current?"#3D8A5E":i===current?gold+"22":"#1E1710",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:i<current?"#fff":i===current?gold:"#7A6B52",margin:"0 auto 4px"}}>
        {i<current?"✓":(i+1)}
      </div>
      <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:i===current?gold:"#7A6B52",maxWidth:60}}>{s}</div>
    </div>)}
  </div>;
}


// ─── SUPABASE HELPERS ────────────────────────────────────────────────────────

// Upsert a single sermon to Supabase
async function dbSaveSermon(userId, sermon) {
  const row = {
    id:            sermon.id,
    user_id:       userId,
    titulo:        sermon.titulo || "",
    pasaje:        sermon.pasaje || "",
    tema:          sermon.tema || "",
    estructura:    JSON.stringify(sermon.estructura || {}),
    revelacion:    sermon.revelacion || "",
    nucleo:        sermon.nucleo || "",
    ilustraciones: JSON.stringify(sermon.ilustraciones || []),
    aplicacion:    JSON.stringify(sermon.aplicacion || []),
    llamado:       sermon.llamado || "",
    completado:    sermon.completado || false,
    estructura_tipo: sermon.estructuraTipo || "",
  };
  const { error } = await supabase.from("sermones").upsert(row, { onConflict:"id" });
  if(error) console.error("dbSaveSermon error:", error.message);
}

// Save all sermons (used on logout/bulk operations)
async function dbSaveSermons(userId, sermons) {
  for(const s of sermons) await dbSaveSermon(userId, s);
}

// Delete a sermon from Supabase
async function dbDeleteSermon(sermonId) {
  const { error } = await supabase.from("sermones").delete().eq("id", sermonId);
  if(error) console.error("dbDeleteSermon error:", error.message);
}

// Load all sermons for a user
async function dbLoadSermons(userId) {
  const { data, error } = await supabase
    .from("sermones")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if(error) { console.error("dbLoadSermons error:", error.message); return []; }
  return (data||[]).map(row => ({
    id:             row.id,
    titulo:         row.titulo,
    pasaje:         row.pasaje,
    tema:           row.tema,
    estructura:     safeJson(row.estructura, {}),
    revelacion:     row.revelacion,
    nucleo:         row.nucleo,
    ilustraciones:  safeJson(row.ilustraciones, []),
    aplicacion:     safeJson(row.aplicacion, []),
    llamado:        row.llamado,
    completado:     row.completado,
    estructuraTipo: row.estructura_tipo,
  }));
}

// Save/load reading preferences
async function dbSavePrefs(userId, prefs) {
  const { error } = await supabase.from("preferencias")
    .upsert({ user_id:userId, font_size:prefs.fontSize, theme:prefs.theme }, { onConflict:"user_id" });
  if(error) console.error("dbSavePrefs error:", error.message);
}
async function dbLoadPrefs(userId) {
  const { data } = await supabase.from("preferencias").select("*").eq("user_id", userId).single();
  return data ? { fontSize: data.font_size, theme: data.theme } : null;
}

function safeJson(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login");
  const [nombre, setNombre]   = useState("");
  const [iglesia, setIglesia] = useState("");
  const [user, setUser]       = useState("");
  const [pass, setPass]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const field = {
    width:"100%", background:"#1A1108",
    border:"1px solid #3D2E18", borderRadius:8,
    padding:"12px 16px", color:"#F0E5CC",
    fontFamily:"Georgia,serif", fontSize:15,
    outline:"none", marginBottom:14,
    boxSizing:"border-box"
  };
  const btn = {
    width:"100%", background:gold, border:"none",
    color:"#1A0F00", borderRadius:8, padding:"13px",
    fontFamily:"Georgia,serif", fontSize:16, fontWeight:700,
    cursor:"pointer", letterSpacing:"0.05em", marginTop:4
  };

  const submit = async () => {
    setError(""); setLoading(true);
    const email = user.trim().toLowerCase();
    if(!email || !pass){ setError("Ingresa email y contraseña."); setLoading(false); return; }

    if(mode==="register"){
      if(!nombre.trim()){ setError("Ingresa tu nombre."); setLoading(false); return; }
      if(pass.length < 6){ setError("La contraseña debe tener al menos 6 caracteres."); setLoading(false); return; }

      // 1. Crear cuenta en Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password:pass });
      if(error){ setError(error.message); setLoading(false); return; }

      const uid = data.user?.id;
      if(!uid){ setError("Error al crear la cuenta. Intenta de nuevo."); setLoading(false); return; }

      // 2. Crear perfil
      await supabase.from("perfiles").insert({ id:uid, nombre:nombre.trim(), iglesia:iglesia.trim() });

      // 3. Cargar demos como primeros sermones
      const demos = DEMOS.map(d=>({...d}));
      for(const d of demos) await dbSaveSermon(uid, d);

      setLoading(false);
      onAuth(uid, { nombre:nombre.trim(), iglesia:iglesia.trim(), email }, demos);

    } else {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password:pass });
      if(error){ setError("Email o contraseña incorrectos."); setLoading(false); return; }

      const uid = data.user?.id;

      // Cargar perfil
      const { data:perfil } = await supabase.from("perfiles").select("*").eq("id",uid).single();

      // Cargar sermones
      const sermones = await dbLoadSermons(uid);

      setLoading(false);
      onAuth(uid, { nombre: perfil?.nombre||email, iglesia: perfil?.iglesia||"", email }, sermones);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#080500",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"Georgia,serif"
    }}>
      {/* Logo */}
      <div style={{textAlign:"center", marginBottom:36}}>
        <div style={{fontSize:36, color:gold, marginBottom:8, letterSpacing:"0.1em"}}>✦</div>
        <div style={{fontSize:22, fontWeight:700, color:"#F0E5CC", letterSpacing:"0.08em"}}>MÉTODO PREDICA™</div>
        <div style={{fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase", color:"#7A6B52", marginTop:6}}>
          Sistema del Predicador
        </div>
      </div>

      {/* Card */}
      <div style={{
        width:"100%", maxWidth:400,
        background:"#0E0B06",
        border:"1px solid #3D2E18",
        borderRadius:14, padding:"32px 28px"
      }}>
        {/* Tabs */}
        <div style={{display:"flex", marginBottom:28, borderBottom:"1px solid #2A1F0E"}}>
          {[["login","Iniciar sesión"],["register","Crear cuenta"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setError("");}} style={{
              flex:1, background:"none", border:"none",
              padding:"10px 0", cursor:"pointer",
              fontFamily:"Georgia,serif", fontSize:14,
              color: mode===m ? gold : "#5A4525",
              borderBottom: mode===m ? `2px solid ${gold}` : "2px solid transparent",
              marginBottom:-1, transition:"color .15s"
            }}>{l}</button>
          ))}
        </div>

        {/* Fields */}
        {mode==="register" && <>
          <label style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7A6B52",display:"block",marginBottom:6}}>Tu nombre</label>
          <input style={field} value={nombre} onChange={e=>setNombre(e.target.value)}
            placeholder="Ej: Juan Martínez" onKeyDown={e=>e.key==="Enter"&&submit()}/>

          <label style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7A6B52",display:"block",marginBottom:6}}>Iglesia (opcional)</label>
          <input style={field} value={iglesia} onChange={e=>setIglesia(e.target.value)}
            placeholder="Ej: Iglesia Roca Viva" onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </>}

        <label style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7A6B52",display:"block",marginBottom:6}}>Email</label>
        <input style={field} type="email" value={user} onChange={e=>setUser(e.target.value)}
          placeholder="pastor@iglesia.com" autoCapitalize="none" onKeyDown={e=>e.key==="Enter"&&submit()}/>

        <label style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7A6B52",display:"block",marginBottom:6}}>Contraseña</label>
        <input style={field} type="password" value={pass} onChange={e=>setPass(e.target.value)}
          placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>

        {error && <div style={{
          background:"#3B0D0D", border:"1px solid #8B1A1A",
          borderRadius:6, padding:"10px 14px", marginBottom:14,
          fontSize:13, color:"#F09595"
        }}>⚠ {error}</div>}

        <button style={btn} onClick={submit} disabled={loading}>
          {loading ? "..." : mode==="login" ? "Entrar →" : "Crear mi cuenta →"}
        </button>

        {mode==="login" && <div style={{textAlign:"center",marginTop:16,fontSize:12,color:"#5A4525"}}>
          ¿Primera vez? <button onClick={()=>{setMode("register");setError("");}} style={{background:"none",border:"none",color:gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12}}>Crea tu cuenta</button>
        </div>}
      </div>

      <div style={{marginTop:28,fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"#2A1F0E"}}>
        Prepara tu corazón · Prepara tu mensaje
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [userId, setUserId]     = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView]         = useState("home");
  const [step, setStep]         = useState(0);
  const [draft, setDraft]       = useState(null);
  const [sermons, setSermons]   = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [query, setQuery]       = useState("");
  const [booting, setBooting]   = useState(true);
  const [fontSize, setFontSize] = useState(17);
  const [theme,    setTheme]    = useState("dark");
  const [timerSecs, setTimerSecs]     = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Start timer when entering presentation mode (step===7), stop on exit
  useEffect(() => {
    if(timerRunning) {
      timerRef.current = setInterval(() => setTimerSecs(s => s+1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const update = useCallback((field, val) => {
    setDraft(d=>({...d,[field]:val}));
  }, []);

  // ── Auto-login: restore Supabase session ─────────────────────
  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession();
      if(session) {
        const uid = session.user.id;
        const email = session.user.email;
        const { data:perfil } = await supabase.from("perfiles").select("*").eq("id",uid).single();
        const sermones = await dbLoadSermons(uid);
        const prefs = await dbLoadPrefs(uid);
        if(prefs){ if(prefs.fontSize) setFontSize(prefs.fontSize); if(prefs.theme) setTheme(prefs.theme); }
        setUserId(uid);
        setUserData({ nombre: perfil?.nombre||email, iglesia: perfil?.iglesia||"", email });
        setSermons(sermones);
      }
      setBooting(false);
    })();

    // Listen for auth state changes (token refresh, logout from another tab)
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((event) => {
      if(event === "SIGNED_OUT"){
        setUserId(null); setUserData(null); setSermons([]);
        setView("home"); setDraft(null); setStep(0);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Persist reading prefs to Supabase whenever they change ─────
  useEffect(() => {
    if(booting || !userId) return;
    dbSavePrefs(userId, { fontSize, theme });
  }, [fontSize, theme, booting, userId]);

  // ── Auth handlers ─────────────────────────────────────────────
  const handleAuth = async (uid, udata, sermones) => {
    setUserId(uid);
    setUserData(udata);
    setSermons(sermones || []);
    // Load reading prefs from Supabase
    const prefs = await dbLoadPrefs(uid);
    if(prefs){
      if(prefs.fontSize) setFontSize(prefs.fontSize);
      if(prefs.theme)    setTheme(prefs.theme);
    }
    setView("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null); setUserData(null); setSermons([]);
    setView("home"); setDraft(null); setStep(0); setTimerRunning(false);
  };

  // Booting splash
  if(booting) return (
    <div style={{minHeight:"100vh",background:"#080500",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontSize:32,color:gold,letterSpacing:"0.1em"}}>✦</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:14,letterSpacing:"0.2em",textTransform:"uppercase",color:"#3D2E18"}}>Cargando...</div>
    </div>
  );

  // Show auth gate if not logged in
  if(!userId) return <AuthScreen onAuth={handleAuth}/>;

  const startNew = () => { setDraft(newDraft()); setStep(0); setView("builder"); };

  const save = (d) => {
    setSermons(prev=>{
      const idx=prev.findIndex(x=>x.id===d.id);
      let next;
      if(idx>=0){ next=[...prev]; next[idx]=d; }
      else { next=[d,...prev]; }
      return next;
    });
    // Save just this sermon to Supabase
    if(userId) dbSaveSermon(userId, d);
  };

  const viewDemo = (estructuraTipo) => {
    const demo = DEMOS.find(x=>x.estructuraTipo===estructuraTipo);
    if(!demo) return;
    setDraft({...demo});
    setStep(7);
    setView("builder");
  };

  const next = () => {
    if(step===1 && !draft.estructuraTipo){ alert("Por favor selecciona una estructura antes de continuar."); return; }
    const d={...draft};
    save(d);
    if(step<7) setStep(s=>s+1);
  };
  const prev = () => { if(step>0){ save(draft); setStep(s=>s-1); } };
  const goHome = () => { if(draft) save(draft); setView("home"); setTimerRunning(false); };
  const editSermon = (id) => { const s=sermons.find(x=>x.id===id); if(s){ setDraft({...s}); setStep(7); setView("builder"); setTimerSecs(0); setTimerRunning(true); } };
  const delSermon = (id) => setDeleteId(id);
  const confirmDelete = () => {
    const toDelete = deleteId;
    setSermons(prev=>prev.filter(x=>x.id!==toDelete));
    dbDeleteSermon(toDelete);
    setDeleteId(null);
  };

  if(view==="home") return <div style={s.wrap}>
    <div style={s.header}>
      <div style={s.logo}>✦ MÉTODO PREDICA™</div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{
            width:30,height:30,borderRadius:"50%",
            background:gold+"22",border:"1px solid "+gold+"40",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:700,color:gold,flexShrink:0
          }}>{(userData&&userData.nombre||userId||"?")[0].toUpperCase()}</div>
          <div style={{display:"flex",flexDirection:"column",lineHeight:1.2}}>
            <span style={{fontSize:13,color:"#D4C4A0",fontFamily:"Georgia,serif"}}>{userData&&userData.nombre||userId}</span>
            {userData&&userData.iglesia && <span style={{fontSize:11,color:"#5A4525"}}>{userData.iglesia}</span>}
          </div>
        </div>
        <button style={{...s.btnGhost,fontSize:12,padding:"5px 12px",color:"#5A4525",borderColor:"#2A1F0E"}} onClick={handleLogout}>Salir</button>
        <button style={s.btnGhost} onClick={startNew}>+ Nuevo</button>
      </div>
    </div>
    <div style={s.main}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:13,letterSpacing:"0.2em",textTransform:"uppercase",color:gold,marginBottom:8}}>Sistema del Predicador</div>
        <div style={s.h1}>Bienvenido, {userData&&userData.nombre ? userData.nombre.split(" ")[0] : userId}</div>
        <p style={{fontSize:15,color:"#7A6B52",marginBottom:24}}>Prepara cada mensaje guiado por el Espíritu Santo,<br/>con método y excelencia pastoral.</p>
        <button style={s.btnPrimary} onClick={startNew}>✦ Preparar Nuevo Mensaje</button>
      </div>

      {sermons.length>0 ? (()=>{
        const q=query.toLowerCase().trim();
        const eObjFor=id=>ESTRUCTURAS.find(x=>x.id===id);
        const filtered=q
          ? sermons.filter(sm=>
              (sm.titulo||"").toLowerCase().includes(q)||
              (sm.pasaje||"").toLowerCase().includes(q)||
              (sm.tema||"").toLowerCase().includes(q)||
              (sm.nucleo||"").toLowerCase().includes(q)||
              (sm.revelacion||"").toLowerCase().includes(q)||
              ((eObjFor(sm.estructuraTipo)||{}).nombre||"").toLowerCase().includes(q)
            )
          : sermons;

        function highlight(text,q){
          if(!q||!text) return text||"";
          const idx=text.toLowerCase().indexOf(q);
          if(idx===-1) return text;
          return text.slice(0,idx)+"【"+text.slice(idx,idx+q.length)+"】"+text.slice(idx+q.length);
        }

        return <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {[["Total",sermons.length,gold],["Resultados",filtered.length,"#D4C4A0"]].map(([l,v,c])=>
              <div key={l} style={{background:"#231B0E",border:"1px solid #3D2E18",borderRadius:8,padding:"14px 18px",textAlign:"center"}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:26,color:c}}>{v}</div>
                <div style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#7A6B52"}}>{l}</div>
              </div>
            )}
          </div>

          <div style={{position:"relative",marginBottom:20}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#3D2E18",pointerEvents:"none"}}>✦</span>
            <input
              type="text"
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Buscar por título, pasaje, tema, estructura, mensaje central..."
              style={{
                width:"100%",background:"#0E0B06",border:"1px solid "+(query?"#3D2E18":"#231B0E"),
                borderRadius:8,padding:"11px 40px 11px 40px",
                color:"#7A6B52",fontFamily:"Georgia,serif",fontSize:14,outline:"none",
                transition:"border-color .15s"
              }}
            />
            {query && <button
              onClick={()=>setQuery("")}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#3D2E18",cursor:"pointer",fontSize:15,lineHeight:1,padding:2}}
            >✕</button>}
          </div>

          {query && <div style={{fontSize:12,color:"#7A6B52",marginBottom:14,letterSpacing:"0.05em"}}>
            {filtered.length===0
              ? "Ningún mensaje coincide con esa búsqueda"
              : `${filtered.length} mensaje${filtered.length!==1?"s":""} encontrado${filtered.length!==1?"s":""}`}
          </div>}

          <Divider label={query?"Resultados de búsqueda":"Todos los mensajes"}/>

          {filtered.length===0 && query && <div style={{textAlign:"center",padding:"32px 0",color:"#7A6B52"}}>
            <div style={{fontSize:32,marginBottom:10}}>🔎</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#D4C4A0",marginBottom:6}}>Sin resultados</div>
            <div style={{fontSize:13}}>Intenta con otro término: título, libro bíblico, tema o estructura.</div>
          </div>}

          {filtered.map(sm=>{
            const eObj=eObjFor(sm.estructuraTipo);
            const titleRaw=sm.titulo||"Mensaje sin título";
            const pasajeRaw=sm.pasaje||"Sin pasaje";
            const nucleoRaw=sm.nucleo||"";
            const tituloHL=query?highlight(titleRaw,q):titleRaw;
            const pasajeHL=query?highlight(pasajeRaw,q):pasajeRaw;
            const nucleoHL=query&&nucleoRaw&&nucleoRaw.toLowerCase().includes(q)?highlight(nucleoRaw,q):"";

            function renderHL(text){
              const parts=text.split(/【|】/);
              return parts.map((p,i)=>
                i%2===1
                  ? <mark key={i} style={{background:"#C9912A22",color:"#C9912A",borderRadius:2,padding:"0 2px"}}>{p}</mark>
                  : p
              );
            }

            return <div key={sm.id}
              onClick={()=>editSermon(sm.id)}
              style={{
                background:"#231B0E",
                border:"1px solid #3D2E18",
                borderRadius:8,padding:"14px 18px",marginBottom:8,
                display:"flex",alignItems:"flex-start",justifyContent:"space-between",
                cursor:"pointer",gap:12,transition:"border-color .15s"
              }}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#D4C4A0",marginBottom:4,lineHeight:1.3}}>
                  {renderHL(tituloHL)}
                </div>
                <div style={{fontSize:13,color:"#7A6B52",marginBottom:eObj||nucleoHL?6:0}}>
                  {renderHL(pasajeHL)}
                </div>
                {nucleoHL && <div style={{fontSize:12,color:"#7A6B52",fontStyle:"italic",marginBottom:4,lineHeight:1.4}}>
                  "{renderHL(nucleoHL)}"
                </div>}
                {eObj && <span style={{
                  display:"inline-block",fontSize:11,padding:"2px 8px",borderRadius:20,
                  background:eObj.color+"18",border:"1px solid "+eObj.color+"40",color:eObj.color,
                  marginTop:2
                }}>{eObj.icono} {eObj.nombre}</span>}
              </div>
              <button
                onClick={e=>{e.stopPropagation();delSermon(sm.id);}}
                style={{background:"none",border:"1px solid #5A4525",color:"#7A6B52",borderRadius:4,padding:"4px 10px",cursor:"pointer",fontSize:13,flexShrink:0,marginTop:2}}
              >✕</button>
            </div>;
          })}
        </>;
      })() : <div style={{textAlign:"center",padding:"40px 0",color:"#7A6B52"}}>
        <div style={{fontSize:40,marginBottom:12}}>📖</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#D4C4A0",marginBottom:8}}>Aún no tienes mensajes</div>
        <div style={{fontSize:14}}>Comienza preparando tu primer mensaje bíblico.</div>
      </div>}

      <div style={{marginTop:40,borderTop:"1px solid #3D2E18",paddingTop:20,textAlign:"center"}}>
        <div style={{fontSize:11,letterSpacing:"0.15em",color:"#7A6B52",textTransform:"uppercase",marginBottom:10}}>El Método</div>
        <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}>
          {["P·Pasaje","R·Revelación","E·Estructura","D·Desarrollo","I·Ilustraciones","C·Clamor","A·Armar"].map(l=><span key={l} style={{...s.pill,fontSize:12}}><span style={{color:gold}}>{l.split("·")[0]}</span><span style={{color:"#7A6B52"}}>·{l.split("·")[1]}</span></span>)}
        </div>
      </div>
    </div>

    {deleteId && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}}>
      <div style={{background:"#1A1108",border:"1px solid #5A4525",borderRadius:12,padding:"28px 28px 24px",maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
        <div style={{fontSize:36,marginBottom:12}}>🗑</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#F0E5CC",marginBottom:10}}>¿Eliminar este mensaje?</div>
        <div style={{fontSize:14,color:"#D4C4A0",marginBottom:6,lineHeight:1.5,fontStyle:"italic"}}>
          "{sermons.find(x=>x.id===deleteId)?.titulo||"Este mensaje"}"
        </div>
        <div style={{fontSize:13,color:"#5A4525",marginBottom:24}}>Esta acción no se puede deshacer.</div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={()=>setDeleteId(null)} style={{background:"none",border:"1px solid #5A4525",color:"#D4C4A0",borderRadius:6,padding:"10px 24px",fontFamily:"Georgia,serif",fontSize:14,cursor:"pointer"}}>Cancelar</button>
          <button onClick={confirmDelete} style={{background:"#8B1A1A",border:"none",color:"#FFD0D0",borderRadius:6,padding:"10px 24px",fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>Sí, eliminar</button>
        </div>
      </div>
    </div>}
  </div>;

  // ── PRESENTATION MODE (step 7 opened from library) ──────────────────────────
  if(step===7) return <div style={{...s.wrap,background:"#080500"}}>
    {/* Minimal sticky header */}
    <div style={{
      borderBottom:"1px solid #2A1F0E",padding:"12px 20px",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:"#0A0700",position:"sticky",top:0,zIndex:100
    }}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={goHome} style={{
          background:"none",border:"1px solid #3D2E18",color:"#7A6B52",
          borderRadius:6,padding:"6px 14px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer"
        }}>← Mensajes</button>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,letterSpacing:"0.12em",color:"#E8B449"}}>
        ✦ MÉTODO PREDICA™
      </div>
      <button onClick={()=>setStep(0)} style={{
        background:gold,border:"none",color:"#1A0F00",
        borderRadius:6,padding:"6px 16px",fontFamily:"Georgia,serif",
        fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:"0.05em"
      }}>✎ Editar</button>
    </div>

    {/* Sermon content */}
    <div style={{...s.main,paddingTop:32,maxWidth:680}}>
      <StepVista draft={draft} fontSize={fontSize} setFontSize={setFontSize} theme={theme} setTheme={setTheme} timerSecs={timerSecs} timerRunning={timerRunning} onTimerToggle={()=>setTimerRunning(r=>!r)} onTimerReset={()=>{setTimerSecs(0);setTimerRunning(true);}}/>
    </div>
  </div>;

  // ── EDITOR MODE (steps 0-6) ──────────────────────────────────────────────────
  const pct = Math.round((step/7)*100);
  return <div style={s.wrap}>
    <div style={s.header}>
      <div style={s.logo}>✦ MÉTODO PREDICA™</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {draft && <button onClick={()=>setStep(7)} style={{
          background:"none",border:`1px solid ${gold}40`,color:gold,
          borderRadius:6,padding:"5px 14px",fontFamily:"Georgia,serif",fontSize:13,cursor:"pointer"
        }}>Ver mensaje →</button>}
        <button style={s.btnGhost} onClick={goHome}>← Mis Mensajes</button>
      </div>
    </div>
    <div style={{height:3,background:"#1E1710"}}><div style={{height:"100%",background:gold,width:pct+"%",transition:"width .3s"}}/></div>
    <div style={s.main}>
      <StepsBar current={step}/>
      {step===0 && <StepPasaje draft={draft} update={update}/>}
      {step===1 && <StepEstructura draft={draft} update={update}/>}
      {step===2 && <StepRevelacion draft={draft} update={update}/>}
      {step===3 && <StepBosquejo draft={draft} update={update}/>}
      {step===4 && <StepDesarrollo draft={draft} update={update}/>}
      {step===5 && <StepIlustraciones draft={draft} update={update}/>}
      {step===6 && <StepAplicacion draft={draft} update={update}/>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:32,paddingTop:20,borderTop:"1px solid #3D2E18"}}>
        {step>0 ? <button style={s.btnSecondary} onClick={prev}>← Anterior</button> : <div/>}
        <button style={s.btnPrimary} onClick={next}>{step===6?"✦ Ver Mensaje":"Siguiente →"}</button>
      </div>
    </div>
  </div>;
}

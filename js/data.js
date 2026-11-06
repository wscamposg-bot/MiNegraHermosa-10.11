// Contenido de la aventura. Las respuestas de texto se comparan sin tildes.
const DEV_MODE = true;

const LEVELS = [
    {
        title: "El Inicio de Todo",
        emoji: "💜",
        type: "number",
        question: "Abre el primer candado con nuestra fecha especial.",
        placeholder: "Ej: 0105",
        answers: ["1011"],
        hint: "Piensa en el día y el mes de aniversario."
    },
    {
        title: "La Primera Cita",
        emoji: "👻",
        type: "options",
        question: "Octubre de 2022... ¿Dónde fue nuestra primera salida rodeados de historias de terror y acompañantes inesperados?",
        options: ["Monserrate", "Cementerio Central", "Parque Simón Bolívar", "La Candelaria"],
        answers: ["Cementerio Central"],
        hint: "Acuérdate de la ruta del terror..."
    },
    {
        title: "El Elíxir de esa Noche",
        emoji: "🍶",
        type: "text",
        question: "¿Qué bebida tradicional nos dieron en barriles pequeños aquella noche inolvidable en la que nos tomamos de la mano por primera vez?",
        placeholder: "Escribe tu respuesta...",
        answers: ["chicha"],
        hint: "Esa bebida tradicional está hecha a base de maíz..."
    },
    {
        title: "Nuestro Animal Espiritual",
        emoji: "🦣",
        type: "text",
        question: "¿Cuál es nuestro animal gigante, afelpado y especial que nos representa?",
        placeholder: "¿Cuál será?",
        answers: ["mamut"],
        hint: "Piensa en nuestro animal gigante..."
    },
    {
        title: "El Viaje Extremo",
        emoji: "🌊",
        type: "options",
        question: "¿En qué lugar hiciste deportes extremos, jugaste bingo y comiste cholao a inicios de este año?",
        options: ["Piscilago", "Flandes", "Útica", "Viotá"],
        answers: ["Utica"],
        hint: "Recuerda dónde comimos cholao y jugamos bingo..."
    },
    {
        title: "Sintonía de Sabores",
        emoji: "🍝",
        type: "text",
        question: "¿Cuál es ese plato que te mata de lo mucho que te fascina?",
        placeholder: "Un plato delicioso...",
        answers: ["lasagna", "lasaña", "pasta"],
        hint: "Es un plato italiano que te fascina..."
    },
    {
        title: "Nuestra Melodía",
        emoji: "🎶",
        type: "text",
        question: "Escribe el nombre de la canción que nos describe y representa nuestra historia.",
        placeholder: "Nombre de la canción...",
        answers: ["fantasia sideral"],
        hint: "Una canción de Bolero..."
    },
    {
        title: "La Promesa y los Apodos",
        emoji: "🔒",
        type: "text",
        question: "¿Cómo te dice el negro?",
        placeholder: "Tu apodo especial...",
        answers: ["negra", "morocha", "morochita"],
        hint: "Yo no te digo de esa forma..."
    }
];

const LETTER_TEXT = "Feliz 4 años, mi amor. 💜 Espero que esto te haga feliz, porque me encanta verte feliz. Y con lo poquito que tengo, voy a darte el mundo entero, de a poquitos, lentico, pero juntos. Sé que llegaremos muy lejos y espero seguir creciendo y mejorando junto al amor de mi vida, mi compañera del alma, mi ser, mi pilar. Lo eres todo, morocha hermosa. Te amo mucho, te amo demasiado, princesa hermosa. Gracias por estos 4 años y por seguir caminando a mi lado. 10-11, morochita.";

const GALLERY_PHOTOS = [
    { src: "assets/img/foto1.jpg", caption: "Primera Cita", alt: "Un recuerdo de nuestra primera cita" },
    { src: "assets/img/foto2.jpg", caption: "Nosotros bien bonitos", alt: "Nosotros juntos y felices" },
    { src: "assets/img/foto3.jpg", caption: "Piscilago", alt: "Un recuerdo de nuestra visita a Piscilago" },
    { src: "assets/img/foto4.jpg", caption: "Útica", alt: "Un recuerdo de nuestro viaje a Útica" },
    { src: "assets/img/foto5.jpg", caption: "Soatá", alt: "Un recuerdo de Soatá" },
    { src: "assets/img/foto6.jpg", caption: "Viotá", alt: "Un recuerdo de Viotá" },
    { src: "assets/img/foto7.jpg", caption: "Nuestras Salidas", alt: "Un recuerdo de nuestras salidas" },
    { src: "assets/img/foto8.jpg", caption: "Siempre Juntos", alt: "Un recuerdo de nosotros siempre juntos" }
];

const CONCERT_DATE = new Date(2027, 1, 26, 20, 0, 0);

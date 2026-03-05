import { BookInfo } from '../types/bible';

export const BIBLE_BOOKS: BookInfo[] = [
    // --- PENTATEUCO ---
    {
        id: 'genesis',
        name: 'Génesis',
        availableChapters: [1, 2, 3],
        category: 'Pentateuco',
        description: 'La creación, la caída y la promesa divina a los patriarcas.',
        participants: ['Dios', 'Narrador', 'Adán', 'Eva', 'Serpiente']
    },
    {
        id: 'exodus',
        name: 'Éxodo',
        availableChapters: [3, 4],
        category: 'Pentateuco',
        description: 'La liberación épica de Israel de la esclavitud en Egipto y la entrega de la Ley.',
        participants: ['Dios', 'Moisés', 'Narrador']
    },
    {
        id: 'levitico',
        name: 'Levítico',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Leyes ceremoniales y santidad del pueblo de Dios.',
        participants: ['Dios', 'Moisés']
    },
    {
        id: 'numeros',
        name: 'Números',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'El censo y el vagabundeo de Israel por el desierto.',
        participants: ['Moisés']
    },
    {
        id: 'deuteronomio',
        name: 'Deuteronomio',
        availableChapters: [],
        isLocked: true,
        category: 'Pentateuco',
        description: 'Repetición de la ley y despedida de Moisés.',
        participants: ['Moisés']
    },

    // --- HISTORIA ---
    { id: 'josue', name: 'Josué', availableChapters: [], isLocked: true, category: 'Historia', description: 'La conquista de la Tierra Prometida.', participants: ['Josué'] },
    { id: 'jueces', name: 'Jueces', availableChapters: [], isLocked: true, category: 'Historia', description: 'El ciclo de desobediencia y liberación de Israel.', participants: ['Gedeón', 'Sansón'] },
    { id: 'rut', name: 'Rut', availableChapters: [], isLocked: true, category: 'Historia', description: 'Una historia de redención y lealtad.', participants: ['Rut', 'Booz'] },
    { id: '1samuel', name: '1 Samuel', availableChapters: [], isLocked: true, category: 'Historia', description: 'El surgimiento de la monarquía en Israel.', participants: ['Samuel', 'Saúl', 'David'] },
    { id: '2samuel', name: '2 Samuel', availableChapters: [], isLocked: true, category: 'Historia', description: 'El reinado del rey David.', participants: ['David'] },
    { id: '1reyes', name: '1 Reyes', availableChapters: [], isLocked: true, category: 'Historia', description: 'El esplendor de Salomón y la división del reino.', participants: ['Salomón', 'Elías'] },
    { id: '2reyes', name: '2 Reyes', availableChapters: [], isLocked: true, category: 'Historia', description: 'La caída de los reinos y el ministerio de Eliseo.', participants: ['Eliseo'] },
    { id: '1cronicas', name: '1 Crónicas', availableChapters: [], isLocked: true, category: 'Historia', description: 'Genealogías y el legado de David.', participants: ['David'] },
    { id: '2cronicas', name: '2 Crónicas', availableChapters: [], isLocked: true, category: 'Historia', description: 'Desde Salomón hasta el exilio.', participants: ['Salomón'] },
    { id: 'esdras', name: 'Esdras', availableChapters: [], isLocked: true, category: 'Historia', description: 'El retorno del exilio y la reconstrucción del templo.', participants: ['Esdras'] },
    { id: 'nehemias', name: 'Nehemías', availableChapters: [], isLocked: true, category: 'Historia', description: 'La reconstrucción de los muros de Jerusalén.', participants: ['Nehemías'] },
    { id: 'ester', name: 'Ester', availableChapters: [], isLocked: true, category: 'Historia', description: 'La providencia divina salvando a su pueblo.', participants: ['Ester', 'Mardoqueo'] },

    // --- POESÍA ---
    { id: 'job', name: 'Job', availableChapters: [], isLocked: true, category: 'Poesía', description: 'El sufrimiento humano y la soberanía de Dios.', participants: ['Job', 'Dios'] },
    { id: 'salmos', name: 'Salmos', availableChapters: [], isLocked: true, category: 'Poesía', description: 'Cánticos de adoración, lamento y esperanza.', participants: ['David', 'Asaf'] },
    { id: 'proverbios', name: 'Proverbios', availableChapters: [], isLocked: true, category: 'Poesía', description: 'Sabiduría práctica para la vida.', participants: ['Salomón'] },
    { id: 'eclesiastes', name: 'Eclesiastés', availableChapters: [], isLocked: true, category: 'Poesía', description: 'La búsqueda de significado bajo el sol.', participants: ['Predicador'] },
    { id: 'cantares', name: 'Cantares', availableChapters: [], isLocked: true, category: 'Poesía', description: 'La belleza del amor humano y divino.', participants: ['Amado', 'Amada'] },

    // --- PROFETAS MAYORES ---
    { id: 'isaias', name: 'Isaías', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Visiones del Mesías y el juicio venidero.', participants: ['Isaías', 'Dios'] },
    { id: 'jeremias', name: 'Jeremías', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'El profeta llorón y el nuevo pacto.', participants: ['Jeremías'] },
    { id: 'lamentaciones', name: 'Lamentaciones', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Duelo por la caída de Jerusalén.', participants: ['Jeremías'] },
    { id: 'ezequiel', name: 'Ezequiel', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Visiones de la gloria de Dios en el exilio.', participants: ['Ezequiel'] },
    { id: 'daniel', name: 'Daniel', availableChapters: [], isLocked: true, category: 'Profetas Mayores', description: 'Fidelidad en Babilonia y visiones del fin.', participants: ['Daniel'] },

    // --- PROFETAS MENORES ---
    { id: 'oseas', name: 'Oseas', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El amor infalible de Dios.', participants: ['Oseas'] },
    { id: 'joel', name: 'Joel', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El día del Señor y la promesa del Espíritu.', participants: ['Joel'] },
    { id: 'amos', name: 'Amós', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Justicia social y juicio.', participants: ['Amós'] },
    { id: 'abdias', name: 'Abdías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Juicio contra Edom.', participants: ['Abdías'] },
    { id: 'jonas', name: 'Jonás', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'La misericordia de Dios hacia las naciones.', participants: ['Jonás'] },
    { id: 'miqueas', name: 'Miqueas', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Requerimientos de Dios y nacimiento en Belén.', participants: ['Miqueas'] },
    { id: 'nahum', name: 'Nahum', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Caída de Nínive.', participants: ['Nahum'] },
    { id: 'habacuc', name: 'Habacuc', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Diálogo con Dios sobre la injusticia.', participants: ['Habacuc'] },
    { id: 'sofonias', name: 'Sofonías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Juicio y restauración.', participants: ['Sofonías'] },
    { id: 'hageo', name: 'Hageo', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Exhortación a reconstruir el templo.', participants: ['Hageo'] },
    { id: 'zacarias', name: 'Zacarías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'Visiones del Mesías y el triunfo de Dios.', participants: ['Zacarías'] },
    { id: 'malaquias', name: 'Malaquías', availableChapters: [], isLocked: true, category: 'Profetas Menores', description: 'El mensajero del Señor.', participants: ['Malaquías'] },

    // --- EVANGELIOS ---
    { id: 'mateo', name: 'Mateo', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El evangelio del Rey de los judíos.', participants: ['Jesús', 'Mateo'] },
    { id: 'marcos', name: 'Marcos', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El Siervo sufriente.', participants: ['Jesús'] },
    { id: 'lucas', name: 'Lucas', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El Salvador de toda la humanidad.', participants: ['Jesús'] },
    { id: 'juan', name: 'Juan', availableChapters: [], isLocked: true, category: 'Evangelios', description: 'El Hijo de Dios entre nosotros.', participants: ['Jesús', 'Juan'] },

    // --- HISTORIA NT ---
    { id: 'hechos', name: 'Hechos', availableChapters: [], isLocked: true, category: 'Historia', description: 'El nacimiento y expansión de la iglesia.', participants: ['Pedro', 'Pablo', 'Espíritu Santo'] },

    // --- EPÍSTOLAS DE PABLO ---
    { id: 'romanos', name: 'Romanos', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La justicia de Dios por medio de la fe.', participants: ['Pablo'] },
    { id: '1corintios', name: '1 Corintios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Instrucciones para una iglesia en crisis.', participants: ['Pablo'] },
    { id: '2corintios', name: '2 Corintios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Defensa del ministerio apostólico.', participants: ['Pablo'] },
    { id: 'galatas', name: 'Gálatas', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Libertad en Cristo y contra el legalismo.', participants: ['Pablo'] },
    { id: 'efesios', name: 'Efesios', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La riqueza espiritual en Cristo y la armadura de Dios.', participants: ['Pablo'] },
    { id: 'filipenses', name: 'Filipenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Gozo en medio del sufrimiento.', participants: ['Pablo'] },
    { id: 'colosenses', name: 'Colosenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La preeminencia de Cristo.', participants: ['Pablo'] },
    { id: '1tesalonicenses', name: '1 Tesalonicenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'La venida del Señor.', participants: ['Pablo'] },
    { id: '2tesalonicenses', name: '2 Tesalonicenses', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Perseverancia ante el fin.', participants: ['Pablo'] },
    { id: '1timoteo', name: '1 Timoteo', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Consejos para un joven pastor.', participants: ['Pablo', 'Timoteo'] },
    { id: '2timoteo', name: '2 Timoteo', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Últimas palabras de Pablo.', participants: ['Pablo', 'Timoteo'] },
    { id: 'tito', name: 'Tito', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Organización de la iglesia en Creta.', participants: ['Pablo'] },
    { id: 'filemon', name: 'Filemón', availableChapters: [], isLocked: true, category: 'Epístolas de Pablo', description: 'Súplica por un esclavo fugitivo.', participants: ['Pablo'] },

    // --- EPÍSTOLAS GENERALES ---
    { id: 'hebreos', name: 'Hebreos', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'La superioridad de Cristo.', participants: ['Autor anónimo'] },
    { id: 'santiago', name: 'Santiago', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'La fe que actúa.', participants: ['Santiago'] },
    { id: '1pedro', name: '1 Pedro', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Esperanza en el sufrimiento.', participants: ['Pedro'] },
    { id: '2pedro', name: '2 Pedro', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Contra los falsos maestros.', participants: ['Pedro'] },
    { id: '1juan', name: '1 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Caminar en la luz y el amor.', participants: ['Juan'] },
    { id: '2juan', name: '2 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Permanecer en la verdad.', participants: ['Juan'] },
    { id: '3juan', name: '3 Juan', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Hospitalidad cristiana.', participants: ['Juan'] },
    { id: 'judas', name: 'Judas', availableChapters: [], isLocked: true, category: 'Epístolas Generales', description: 'Contender por la fe.', participants: ['Judas'] },

    // --- PROFECÍA ---
    { id: 'revelation', name: 'Apocalipsis', availableChapters: [], isLocked: true, category: 'Profecía', description: 'La victoria final de Jesucristo.', participants: ['Jesús', 'Juan', 'Ángeles'] }
];

export const READING_SPEEDS = [
    { label: 'Zen', val: 2.0, multiplier: 2.0 },
    { label: 'Norm', val: 1.0, multiplier: 1.0 },
    { label: 'Fast', val: 0.25, multiplier: 0.25 }
];

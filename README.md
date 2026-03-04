# Bible Chat NAAS 📖✨

Una aplicación de lectura bíblica inmersiva diseñada bajo el sistema **Neo-AIDA Accessible System (NAAS)**. Esta app transforma la lectura tradicional en una experiencia de chat interactiva, fluida y visualmente impactante.

## 🚀 Características Premium

- **Experiencia Inmersiva de Chat:** Lee la Biblia como si estuvieras en una conversación en tiempo real con sus protagonistas.
- **Diseño Adaptativo Extremo:** Optimizado para todo tipo de pantallas, desde móviles hasta monitores 4K Cinema.
- **Sistema NAAS v3.4:** Interfaz de alto contraste, tipografía premium (Space Grotesk) y jerarquía visual matemática.
- **Lectura Adaptativa Humana:** Los mensajes avanzan a un ritmo de lectura natural, calculando el tiempo según la longitud del texto.
- **Efectos de Sonido:** Micro-interacciones auditivas (pop y typing) para una mayor inmersión.
- **Navegación Inteligente:** Selector de libros dinámico y pausas estratégicas en títulos de sección.
- **Likes Interactivos:** Doble toque estilo Instagram para marcar tus versículos favoritos con un corazón dinámico.

## 🛠️ Stack Tecnológico

- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS (Diseño basado en utilidades)
- **Animaciones:** Framer Motion (Transiciones fluidas y estados dinámicos)
- **Iconos:** Lucide React
- **Datos:** JSON estructurado para capítulos y versículos

## 📦 Instalación y Desarrollo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/yojananyosef/bible-app-naas.git
   ```

2. Instala las dependencias (se recomienda Bun):
   ```bash
   bun install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   bun run dev
   ```

4. Construye para producción:
   ```bash
   bun run build
   ```

## 📂 Estructura de Datos

Los capítulos se almacenan en formato JSON en `public/data/[libro]/[capitulo].json` con la siguiente estructura:

```json
{
  "book": "Génesis",
  "chapter": 1,
  "title": "La Creación",
  "messages": [
    {
      "id": "g1_1",
      "speaker": "Narrador",
      "verse": 1,
      "text": "En el principio, Dios creó los cielos y la tierra."
    }
  ]
}
```

## 🎨 Principios de Diseño

- **AIDA:** Attention (Header/Title), Interest (Chat Feed), Desire (Interactivity), Action (Section Buttons).
- **Contraste:** Uso de negro puro `#0A0A0A` sobre fondo `#FAFAFA` para máxima legibilidad.
- **Acentos:** El color "Divine Yellow" `#FFD600` para resaltar a Dios y acciones principales.

---
Desarrollado con ❤️ para una experiencia bíblica moderna.

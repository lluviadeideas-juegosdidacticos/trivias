# Milestone: Trivia Manual Stable (marzo 2026)

**Estado actual:**
- HomeScreen funciona en modo manual, sin dado 3D.
- Interfaz clara, inputs manuales, botón "Ver pregunta" y navegación estable.

**Dado 3D:**
- Componente desacoplado y en desarrollo en: `src/trivia/dice-lab/DiceLab.js`
- No impacta la trivia ni la HomeScreen actual.

**Flujo productivo vigente:**
- El usuario ingresa manualmente 3 cifras (1-6) en las casillas.
- El botón "Ver pregunta" navega correctamente según el número generado.

**Pendientes futuros:**
- Integrar el dado 3D solo después de validación visual y funcional completa en el laboratorio.
- Mantener la trivia estable y publicable en modo manual hasta entonces.

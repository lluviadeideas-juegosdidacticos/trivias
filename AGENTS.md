# Instrucciones para agentes

Estas instrucciones aplican a todo el repositorio.

## Autoridad y roles

- El Head es la autoridad humana final y decide las aprobaciones.
- El arquitecto-ingeniero define la secuencia de trabajo, el alcance, los
  riesgos y los gates.
- Copilot y Codex son herramientas u operadores de implementación; no son
  autoridades ni coautores humanos.
- Claude solo puede actuar como auditor externo cuando trabaja desde una sesión
  o espacio independiente del de implementación. No puede auditar externamente
  su propio trabajo.

## Cambios y preservación

- Lee la documentación y el código relacionados antes de proponer un cambio.
- Mantén los cambios acotados al objetivo autorizado y conserva el
  comportamiento ajeno al alcance.
- Preserva la propiedad intelectual, la privacidad y el material sensible. No
  expongas secretos ni datos personales en archivos, logs, commits o respuestas.
- No añadas dependencias ni alteres publicación, dominios, workflows,
  despliegues, permisos, secretos o datos de producción sin autorización
  explícita.
- No cambies los términos de derechos, propiedad o licencia establecidos en
  [LICENSE](./LICENSE) ni prometas derechos que no estén documentados.

## Git y staging

- Stagea exclusivamente los paths autorizados de forma expresa para la
  operación.
- No uses `git add .`, `git add -A`, `git commit -a` ni operaciones equivalentes
  de staging amplio, salvo autorización específica.
- No modifiques configuración Git, hooks ni firma persistente sin autorización
  expresa.

## Publicación y auditoría

- Antes de cualquier publicación remota, consulta a un segundo agente.
- Los cambios públicos de gobernanza, seguridad, privacidad o propiedad
  intelectual requieren auditoría externa independiente antes de publicarse.
- No hagas push, abras PR, hagas merge, publiques releases ni despliegues desde
  un candidato que no haya completado la auditoría requerida y recibido la
  autorización humana correspondiente.

## Ejecución y cierre

- Aplica stop-on-failure: si falla una precondición, una comprobación o un hook,
  detente, preserva el estado y reporta el bloqueo; no lo eludas.
- Ejecuta las comprobaciones pertinentes disponibles e informa con precisión
  cuáles se ejecutaron y cuáles no.
- Cierra cada operación con exactamente un `NEXT_GATE` que identifique el
  siguiente paso autorizado; no interpretes ese gate como autorización para
  ejecutarlo.

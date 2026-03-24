// Script para convertir impacto-ambiental-v1-2.csv en src/trivia/data.js con 216 objetos reales
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvPath = path.resolve('data/impacto-ambiental-v1-2.csv');
const outPath = path.resolve('src/trivia/data.js');

const csvContent = fs.readFileSync(csvPath, 'utf8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

const questions = records.map((row, idx) => {
  // Determinar índice de respuesta correcta
  const correctLetter = (row['RESPUESTA CORRECTA'] || '').trim();
  const options = [row['RESPUESTAS A'], row['RESPUESTA B'], row['RESPUESTA C']];
  let answer = -1;
  if (['A', 'B', 'C'].includes(correctLetter)) answer = ['A', 'B', 'C'].indexOf(correctLetter);

  return {
    id: Number(row['ID JUEGO']),
    question: (row['PREGUNTA'] || '').trim(),
    options: options.map(opt => (opt || '').trim()),
    answer,
    intro: (row['TEXTO INTRODUCTORIO'] || '').trim(),
    explanation: (row['TEXTO FINAL'] || '').trim(),
    // Metadatos mínimos para trazabilidad
    sourceGuide: 'Impacto Ambiental v1.2',
    sourceFile: 'impacto-ambiental-v1-2.csv',
    sourceRow: idx + 2, // +2 por encabezado y base 1
    importBatch: new Date().toISOString().slice(0, 10),
    status: 'approved',
  };
});

// Serializar a JS
const js = 'export const questions = ' + JSON.stringify(questions, null, 2) + ';\n';
fs.writeFileSync(outPath, js, 'utf8');

// Evidencia
console.log('Total filas CSV:', records.length);
console.log('Total objetos generados:', questions.length);
console.log('Primeras 3 filas convertidas:');
console.log(JSON.stringify(questions.slice(0, 3), null, 2));
console.log('Últimas 3 filas convertidas:');
console.log(JSON.stringify(questions.slice(-3), null, 2));

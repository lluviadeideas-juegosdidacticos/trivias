import { questions } from "./data.js";

console.log('questions.length', questions.length);
[111,123,234,345,666].forEach(id => {
  const q = questions.find(q => q.id === id);
  console.log('find', id, !!q, q);
});
console.log('primeros 10 ids', questions.slice(0,10).map(q => q.id));
console.log('ultimos 10 ids', questions.slice(-10).map(q => q.id));

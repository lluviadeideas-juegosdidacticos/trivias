import { questions } from "./data.js";

const ids = questions.map(q => q.id);
console.log('length', questions.length);
console.log('all numbers', ids.every(id => typeof id === 'number'));
const missing = [];
for(let i=111;i<=666;i++){
  if(ids.indexOf(i)===-1) missing.push(i);
}
console.log('missing', missing);
[111,112,123,234,345,666].forEach(n => {
  const found = questions.find(q => q.id === n);
  console.log({id:n, typeof_id: typeof n, found, exists:!!found});
});

import { JanusDiceLab } from './JanusDiceLab.js';

JanusDiceLab({
  mount: document.getElementById('mount'),
  onResult: (value) => {
    const status = document.getElementById('status');
    if (status) status.textContent = 'Salió ' + value + '.';
  }
});

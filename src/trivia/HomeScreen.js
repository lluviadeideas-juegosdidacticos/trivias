import { useState } from "https://esm.sh/react@18.2.0";

export function HomeScreen({ onStart }) {
  const [digits, setDigits] = useState([null, null, null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rolling, setRolling] = useState(false);

  function handleRoll() {
    if (currentIndex > 2 || rolling) return;
    setRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDigits((prev) => {
        const next = [...prev];
        next[currentIndex] = roll;
        return next;
      });
      setCurrentIndex((idx) => idx + 1);
      setRolling(false);
    }, 350);
  }

  function handleStart() {
    const number = Number(digits.join(""));
    if (!isNaN(number) && digits.every((d) => d !== null)) {
      onStart(number);
    }
  }

  return (
    <div className="trivia-app" role="main" style={{ position: 'relative', minHeight: 480 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        {/* Logo principal Impacto Ambiental */}
        <img src="/assets/logo_impactoambiental.gif" alt="Impacto Ambiental" style={{ width: 160, maxWidth: '80vw', margin: '0 auto 8px', display: 'block' }} />
        <h1 className="trivia-title" style={{ marginBottom: 0, marginTop: 0, fontSize: '2.1rem' }}>Impacto Ambiental</h1>
        <div className="trivia-subtitle" style={{ fontWeight: 600 }}>Guía de Cuestiones 2.0</div>
        <div style={{ fontSize: '1.08rem', color: '#444', marginBottom: 8, textAlign: 'center' }}>
          Tirá el dado 3 veces o tocá el dado para generar tu número de pregunta
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', margin: '1.2rem 0' }}>
          {digits.map((d, i) => (
            <div
              key={i}
              className="trivia-digit-box"
              style={{
                width: 54,
                height: 64,
                border: '2px solid #1a73e8',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 700,
                background: d !== null ? '#e3f0fd' : '#f5f5f5',
                color: d !== null ? '#1a73e8' : '#bbb',
                transition: 'background 0.2s, color 0.2s',
              }}
              aria-label={d !== null ? `Dígito ${i + 1}: ${d}` : `Dígito ${i + 1} vacío`}
            >
              {d !== null ? d : '_'}
            </div>
          ))}
        </div>

        <button
          className={"trivia-dice-btn" + (rolling ? " rolling" : "")}
          style={{
            fontSize: '2.5rem',
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '2px solid #1a73e8',
            background: '#fff',
            boxShadow: '0 2px 8px #0001',
            marginBottom: 8,
            cursor: currentIndex > 2 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.3s',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
          onClick={handleRoll}
          disabled={currentIndex > 2 || rolling}
          aria-label="Tirar dado"
        >
          <span role="img" aria-label="Dado" style={{ display: 'inline-block', transition: 'transform 0.3s', transform: rolling ? 'rotate(360deg)' : 'none' }}>
            🎲
          </span>
        </button>

        <button
          className="trivia-btn"
          style={{ marginTop: 16, width: 180 }}
          onClick={handleStart}
          disabled={digits.some((d) => d === null)}
        >
          Ver pregunta
        </button>
      </div>
      {/* Logo secundario Lluvia de Ideas al pie */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <img src="/assets/isologo_negro.svg" alt="Lluvia de Ideas" style={{ width: 54, opacity: 0.65, filter: 'grayscale(1)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

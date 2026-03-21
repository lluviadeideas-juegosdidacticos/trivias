// Pantalla 1: HomeScreen
export function HomeScreen({ onStart }) {
  return (
    <div className="trivia-app" role="main">
      <h1 className="trivia-title">Trivia Ambiental</h1>
      <p className="trivia-subtitle">Poné a prueba tus conocimientos sobre impacto ambiental.</p>
      <button className="trivia-btn" onClick={onStart} autoFocus>Jugar ahora</button>
    </div>
  );
}

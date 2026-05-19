export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--fs-display)',
            margin: 0,
          }}
        >
          Uply
        </h1>
        <p style={{ marginTop: 'var(--sp-3)', color: 'var(--text-secondary)' }}>
          scaffolding ready, 等待第一屏接入
        </p>
      </div>
    </div>
  );
}

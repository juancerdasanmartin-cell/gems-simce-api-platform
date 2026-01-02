import React, { useState } from 'react';
const API_URL = 'http://localhost:3001';

interface Gem {
  id: string;
  schoolName: string;
  subject: string;
  currentLevel: number;
  targetLevel: number;
  plan: string;
}

export default function App() {
  const [schoolName, setSchoolName] = useState('');
  const [subject, setSubject] = useState('');
  const [currentLevel, setCurrentLevel] = useState(180);
  const [targetLevel, setTargetLevel] = useState(220);
  const [loading, setLoading] = useState(false);
  const [gem, setGem] = useState<Gem | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!schoolName.trim() || !subject.trim()) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/gems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          subject,
          currentLevel,
          targetLevel,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al generar plan');

      setGem({ id: data.id, schoolName, subject, currentLevel, targetLevel, plan: data.plan });
      setSchoolName('');
      setSubject('');
      setCurrentLevel(180);
      setTargetLevel(220);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>💎</div>
        <h1 style={styles.title}>Gems SIMCE</h1>
        <p style={styles.subtitle}>Generador de Planes de Mejora Educativa</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Crear Nuevo Plan</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de la Escuela</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ej: Liceo Nacional"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Asignatura</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="">Selecciona una asignatura</option>
              <option value="Matemáticas">Matemáticas</option>
              <option value="Lenguaje">Lenguaje</option>
              <option value="Historia">Historia</option>
              <option value="Ciencias">Ciencias</option>
              <option value="Inglés">Inglés</option>
            </select>
          </div>

          <div style={styles.levelGroup}>
            <div style={styles.levelInput}>
              <label style={styles.label}>Nivel Actual SIMCE</label>
              <input
                type="number"
                value={currentLevel}
                onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
                min="100"
                max="300"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={styles.levelInput}>
              <label style={styles.label}>Meta de Mejora</label>
              <input
                type="number"
                value={targetLevel}
                onChange={(e) => setTargetLevel(parseInt(e.target.value))}
                min="100"
                max="300"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Generando plan...' : '✨ Generar Gema'}
          </button>
        </form>
      </div>

      {gem && (
        <div style={styles.resultCard}>
          <h2 style={styles.resultTitle}>✨ Plan de Mejora Generado</h2>
          <div style={styles.resultInfo}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Escuela:</span>
              <span style={styles.infoValue}>{gem.schoolName}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Asignatura:</span>
              <span style={styles.infoValue}>{gem.subject}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Nivel Actual:</span>
              <span style={styles.infoValue}>{gem.currentLevel}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Meta:</span>
              <span style={styles.infoValue}>{gem.targetLevel}</span>
            </div>
          </div>
          <div style={styles.planBox}>
            <h3 style={styles.planTitle}>Plan Detallado:</h3>
            <pre style={styles.planContent}>{gem.plan}</pre>
          </div>
          <button
            onClick={() => setGem(null)}
            style={styles.closeButton}
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
  },
  logo: {
    fontSize: '64px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9,
    margin: 0,
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto 30px',
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginTop: 0,
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '16px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  levelGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  levelInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  errorMessage: {
    background: '#fee',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #fcc',
  },
  submitButton: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  resultCard: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  resultTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginTop: 0,
    marginBottom: '24px',
  },
  resultInfo: {
    marginBottom: '24px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    color: '#667eea',
    fontWeight: '500',
  },
  planBox: {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  planTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#333',
  },
  planContent: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#555',
    maxHeight: '400px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  closeButton: {
    padding: '12px 24px',
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

interface Gem {
  id: string;
  schoolName: string;
  subject: string;
  currentLevel: number;
  targetLevel: number;
  plan: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [gems, setGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);

  useEffect(() => {
    fetchGems();
  }, []);

  const fetchGems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/gems`);
      const data = await res.json();
      if (data.success) {
        setGems(data.data || []);
      } else {
        setError('Error al cargar planes');
      }
    } catch (err: any) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard de Planes</h1>
        <p style={styles.subtitle}>{gems.length} planes generados</p>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <p>Cargando planes...</p>
        </div>
      )}

      {error && <div style={styles.errorMessage}>{error}</div>}

      {!loading && gems.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No hay planes generados aun</p>
          <p style={styles.emptySubtext}>Comienza generando tu primer plan</p>
        </div>
      )}

      {!loading && gems.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Escuela</th>
                <th style={styles.th}>Asignatura</th>
                <th style={styles.th}>Nivel Actual</th>
                <th style={styles.th}>Meta</th>
                <th style={styles.th}>Mejora</th>
                <th style={styles.th}>Accion</th>
              </tr>
            </thead>
            <tbody>
              {gems.map((gem) => (
                <tr key={gem.id} style={styles.row}>
                  <td style={styles.td}>{gem.schoolName}</td>
                  <td style={styles.td}>{gem.subject}</td>
                  <td style={styles.td}>{gem.currentLevel}</td>
                  <td style={styles.td}>{gem.targetLevel}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: gem.targetLevel > gem.currentLevel ? '#4caf50' : '#f44336',
                    }}>
                      {gem.targetLevel - gem.currentLevel > 0 ? '+' : ''}{gem.targetLevel - gem.currentLevel}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => setSelectedGem(gem)}
                      style={styles.viewButton}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedGem && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setSelectedGem(null)}
              style={styles.closeButton}
            >
              x
            </button>
            <h2 style={styles.modalTitle}>{selectedGem.schoolName}</h2>
            <div style={styles.modalBody}>
              <p><strong>Asignatura:</strong> {selectedGem.subject}</p>
              <p><strong>Nivel Actual:</strong> {selectedGem.currentLevel}</p>
              <p><strong>Meta:</strong> {selectedGem.targetLevel}</p>
              <p><strong>Plan de Mejora:</strong></p>
              <pre style={styles.planPreview}>{selectedGem.plan}</pre>
            </div>
          </div>
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
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
  },
  loadingContainer: {
    textAlign: 'center',
    color: 'white',
    padding: '40px',
  },
  errorMessage: {
    maxWidth: '1000px',
    margin: '0 auto 20px',
    background: '#fee',
    color: '#c33',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #fcc',
  },
  emptyState: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
  },
  tableContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    background: '#f5f5f5',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #e0e0e0',
  },
  row: {
    borderBottom: '1px solid #e0e0e0',
    transition: 'background 0.2s',
  },
  td: {
    padding: '16px',
    color: '#555',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  viewButton: {
    padding: '6px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginTop: 0,
    marginBottom: '24px',
  },
  modalBody: {
    color: '#555',
  },
  planPreview: {
    background: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.6',
    maxHeight: '300px',
    overflowY: 'auto',
    margin: '0',
  },
};

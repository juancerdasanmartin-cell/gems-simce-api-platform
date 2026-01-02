import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

interface Gem {
  id: string;
  schoolName: string;
  subject: string;
  plan: string;
}

export default function App() {
  const [schoolName, setSchoolName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [gem, setGem] = useState<Gem | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/api/v1/gems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          subject,
          currentLevel: 180,
          targetLevel: 220,
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setGem({ id: data.id, schoolName, subject, plan: data.plan });
      setSchoolName('');
      setSubject('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>💫 Gems SIMCE - Generador de Planes de Mejora</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre de Escuela:</label><br />
          <input 
            type="text" 
            value={schoolName} 
            onChange={(e) => setSchoolName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Asignatura (Matemáticas/Lenguaje/Historia):</label><br />
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Generando...' : '✨ Generar Gema'}
        </button>
      </form>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}
      
      {gem && (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h2>Plan de Mejora Generado</h2>
          <p><strong>Escuela:</strong> {gem.schoolName}</p>
          <p><strong>Asignatura:</strong> {gem.subject}</p>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflowX: 'auto' }}>
            {gem.plan}
          </pre>
        </div>
      )}
    </div>
  );
}

# 🚀 Plan Alfa 1 - Ejecución (2 Enero 2026, 7:00-9:30 AM CL)

## Resumen Ejecutivo

**Status**: ✅ PROGRESO SIGNIFICATIVO - MVP Opción B estructurado

**Objetivos Logrados Hoy**:
1. ✅ Ambiente GCP configurado (proyecto "Prueba general login")
2. ✅ Prompt SIMCE testeado en Vertex AI Studio (Gemini 3 Pro)
3. ✅ Gem SIMCE generado: 2,651 tokens de contenido educativo de calidad
4. ✅ Repositorio GitHub creado: gems-simce-api-platform
5. ✅ Documentación completa en README.md
6. ✅ Estructura backend definida (Node.js + TypeScript)
7. ✅ Integraciones planificadas (Stripe, SendGrid, Firebase, Jumpseller)

---

## 📁 Tecnología Actual

### IA Generativa
- **Modelo**: Gemini 3 Pro Preview
- **API**: Vertex AI (Google Cloud)
- **Uso**: Generar planes SIMCE (Gem SIMCE)
- **Token Budget**: 2,651 tokens/solicitud (400-word plan)
- **Costo Estimado**: $0.015 USD/solicitud (~$450 CLP)

### Backend
- **Stack**: Node.js 18+ + Express + TypeScript
- **Endpoint Clave**: POST /gems/simce-lenguaje
- **Input**: nivel, resultado%, estudiantes, vulnerabilidad, recursos
- **Output**: Plan SIMCE JSON (6 secciones)
- **DB**: Firestore (historial de Gems)
- **Auth**: Firebase Auth

### Frontend Dashboard
- **Framework**: React 18 + TypeScript + Vite
- **Funciones**:
  - Visualizar Gems generados
  - Historial + Exportación (PDF/Word)
  - Métricas de progreso
  - Gestión de usuarios

### E-commerce
- **Plataforma**: Jumpseller
- **Integración**: Webhook POST-venta
- **Flujo**: Compra → Genera API Key → Email credenciales

### Pagos & Notificaciones
- **Stripe**: Suscripciones (Free/Pro/Enterprise)
- **SendGrid**: Emails (Gems, recordatorios, vencimientos)

---

## 🐻 Caso SIMCE Testeado

**Input:**
```
Nivel: 8B
Asignatura: Lenguaje
Resultado SIMCE: 45% logro
Estudiantes: 28 (75% vulnerabilidad)
Context: La Florida, Santiago
Deficits: OA2 (inferencias), OA5 (evaluación crítica)
Recursos: 1 sala TIC, 2 docentes, presupuesto SEP
```

**Output (6 Secciones)**:
1. DIAGNÓSTICO: Brechas vs estándar nacional
2. OBJETIVOS: 3-4 SMART alineados con OA MINEDUC
3. PLAN DE ACCIÓN: Actividades semanales + estrategias MBE
4. RÚBRICA: 4 niveles de logro
5. CRONOGRAMA: 8-12 semanas
6. INDICADORES: Métricas de progreso

**Calidad**: Excepcional - Incluye estrategias, recursos SEP sugeridos, co-docencia, micro-teaching, y recomendaciones al director.

---

## 💰 Modelo de Ingresos

| Plan | Precio | Gems/mes | Dashboard | Soporte |
|------|--------|----------|-----------|----------|
| **Free** | $0 | 3 | Básico | Email |
| **Pro** | $49.900 | 20 | Completo | Email |
| **Enterprise** | Custom | ∞ | Plus | Phone |

**Estrategia**: 
- Vender principalmente **Pro** ($49.900 CLP/mes = ~$60 USD)
- Target: 100 escuelas en 6 meses = $5M CLP MRR
- Costo de servicio: ~30% (IA + infraestructura)
- Margen: ~70%

---

## 📃 Siguiente: Pasos de Implementación

### Fase 2 (Esta Semana):
1. **Backend**: Codificar endpoints (gems, auth, schools)
2. **BD**: Configurar Firestore schema
3. **Auth**: Integrar Firebase Auth
4. **Gemini API**: Implementar servicio

### Fase 3 (Semana 2):
1. **Dashboard Frontend**: React components
2. **Stripe**: Integrar subscripciones
3. **SendGrid**: Automatizar emails
4. **Testing**: E2E tests

### Fase 4 (Semana 3):
1. **Cloud Run**: Docker build + deploy
2. **Jumpseller**: Webhook setup
3. **QA**: Testing en producción
4. **Launch**: Beta closed

---

## 🚨 Riesgos & Mitigaciones

| Riesgo | Mitigación |
|--------|-------------|
| Costo Gemini API alto | Rate limiting, caching de Gems |
| Latencia generación (30-40s) | Async queue + email post-completeness |
| Competencia EdTech | Diferenciación: SIMCE + Dashboard completo |
| Adoption escuelas | Go-to-market: directores + capacitación |

---

## 💼 Presupuesto & Timeline

| Item | Costo | Timeline |
|------|-------|----------|
| Desarrollo Backend/Frontend | $0 (in-house) | 2 semanas |
| GCP (Vertex AI + Firestore) | ~$500 CLP/mes | Operativo |
| Stripe (commission) | 2.2% + $0.30 | Por transacción |
| SendGrid | ~$20 USD/mes | Operativo |
| Cloud Run | ~$100-200 CLP/mes | Operativo |
| **TOTAL MES 1** | ~$1,000 CLP | Minimal |
| **Revenue Potencial (100 users)** | $4.99M CLP | At scale |

---

## 🔍 Metrics Clave a Trackear

- ⏳ Tiempo generación Gem (meta: <45s)
- 📈 Costo por Gem (meta: <$1 USD)
- 💰 CAC (Customer Acquisition Cost)
- 🔍 Churn rate (meta: <5%/mes)
- 🌟 NPS (Net Promoter Score)
- 🔥 DAU/MAU (activos diarios/mensuales)

---

## 🌟 Estado Actual del Repositorio

- **GitHub**: github.com/juancerdasanmartin-cell/gems-simce-api-platform
- **Documentación**: README.md (completo)
- **Estructura**: Definida (backend/, frontend/, docs/)
- **Backend Code**: Pronto (estructura + índices)
- **Frontend Code**: Pronto (React boilerplate)

---

## 🚀 Próximas Acciones (HOY)

1. [ ] Confirmar API Keys (Gemini, Firebase, Stripe, SendGrid)
2. [ ] Crear rama `development` en GitHub
3. [ ] Setup backend local (npm install)
4. [ ] Codificar POST /gems/simce-lenguaje (90 min)
5. [ ] Test local con curl (30 min)

---

**Notas**:
- Plan Alfa 1 = MVP **Opción B** (completo): Backend + Dashboard + Notificaciones + Subscripciones
- Decisión hecha: Go-to-market = Jumpseller (simple + 10% comisión)
- Timeline realista: Vender beta en 3 semanas
- Diferenciador: Unica plataforma SIMCE + IA + Dashboard + Notificaciones en Chile

**Aprobado por**: Juan Cerda, Hackaton HT
**Fecha Ejecución**: 2 Enero 2026, 8:00 AM CL

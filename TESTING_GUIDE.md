# TESTING GUIDE - Plan Alfa 1

## Testing Manual del MVP

Guia completa para probar todas las funcionalidades del MVP.

---

## TEST 1: Verificar Backend Funciona

### Prerequisitos
- Backend corriendo en puerto 3001
- curl o Postman instalado

### Pasos

1. **Test Health Check**
```bash
curl http://localhost:3001/health
```

Resultado esperado:
```json
{"status": "OK", "timestamp": "2026-01-02T..."}}
```

2. **Test GET /api/v1/gems (lista vacia)**
```bash
curl http://localhost:3001/api/v1/gems
```

Resultado esperado:
```json
{"success": true, "data": []}
```

---

## TEST 2: Crear Nuevo Plan (POST)

### Con curl
```bash
curl -X POST http://localhost:3001/api/v1/gems \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Liceo Nacional",
    "subject": "Matematicas",
    "currentLevel": 180,
    "targetLevel": 220
  }'
```

### Con Postman
1. Abre Postman
2. Crea nuevo POST request
3. URL: http://localhost:3001/api/v1/gems
4. Body (JSON):
```json
{
  "schoolName": "Liceo Nacional",
  "subject": "Matematicas",
  "currentLevel": 180,
  "targetLevel": 220
}
```
5. Click Send

### Resultado esperado
- Status: 200 OK
- Response contiene: id, plan, success: true
- Plan tiene contenido de Gemini AI

---

## TEST 3: Verificar en Firestore

### Pasos
1. Ve a: https://console.firebase.google.com
2. Selecciona proyecto: prueba-general-login
3. Ve a: Firestore Database
4. Busca coleccion: gems
5. Deberia haber documentos con datos guardados

### Datos esperados
- schoolName: "Liceo Nacional"
- subject: "Matematicas"
- currentLevel: 180
- targetLevel: 220
- plan: (contenido generado por Gemini)
- createdAt: timestamp

---

## TEST 4: Probar Frontend

### Prerequisitos
- Frontend corriendo en puerto 5173
- Backend corriendo en puerto 3001

### Pasos
1. Abre navegador: http://localhost:5173
2. Deberia ver:
   - Titulo: Gems SIMCE
   - Campo: Nombre de Escuela
   - Campo: Asignatura
   - Boton: Generar Gema

3. Completa formulario:
   - Escuela: "Mi Liceo"
   - Asignatura: "Lenguaje"

4. Haz click en "Generar Gema"

### Comportamiento esperado
- Boton cambia a "Generando..."
- Espera 2-5 segundos (llamada a Gemini API)
- Aparece seccion: "Plan de Mejora Generado"
- Muestra:
  - Escuela: Mi Liceo
  - Asignatura: Lenguaje
  - Plan: (contenido JSON formateado)

---

## TEST 5: Probar Errores

### Test 5.1: Submit sin llenar campos
1. Abre http://localhost:5173
2. Haz click en "Generar Gema" sin llenar
3. Deberia mostrar validacion (depende de browser)

### Test 5.2: Backend no disponible
1. Para el backend (Ctrl+C)
2. Intenta enviar formulario en frontend
3. Deberia mostrar error: "Cannot connect to API"

### Test 5.3: GEMINI_API_KEY invalida
1. Edita backend/.env
2. Cambia GEMINI_API_KEY a valor invalido
3. Intenta generar plan
4. Deberia ver error en consola del backend

---

## TEST 6: Integracion Completa (E2E)

### Flujo
1. Backend corriendo en 3001
2. Frontend corriendo en 5173
3. Firebase conectado
4. GEMINI_API_KEY configurada

### Pasos
1. Abre http://localhost:5173
2. Ingresa:
   - Escuela: "Instituto Central"
   - Asignatura: "Historia"
3. Click "Generar Gema"
4. Espera respuesta
5. Verifica:
   - Frontend muestra plan
   - Firestore tiene documento nuevo
   - GET /api/v1/gems retorna el nuevo plan

---

## TEST 7: Performance

### Test tiempo respuesta
```bash
time curl -X POST http://localhost:3001/api/v1/gems \
  -H "Content-Type: application/json" \
  -d '{"schoolName": "Test", "subject": "Math", "currentLevel": 180, "targetLevel": 220}'
```

Tiempo esperado: 2-5 segundos (por llamada a Gemini)

### Test multiples requests
1. Abre Postman
2. Envia 5 requests consecutivos
3. Verifica que todos se procesan
4. Firestore deberia tener 5 documentos nuevos

---

## Checklist Final

- [ ] Health check retorna OK
- [ ] GET /api/v1/gems funciona
- [ ] POST crea plan correctamente
- [ ] Firestore guarda datos
- [ ] Frontend carga en http://localhost:5173
- [ ] Formulario valida inputs
- [ ] Plan se genera correctamente
- [ ] Errores se muestran apropiadamente
- [ ] Flujo E2E funciona
- [ ] Base de datos tiene datos

---

## Troubleshooting

**Error: Cannot connect to localhost:3001**
- Verifica que backend este corriendo
- Verifica puerto: netstat -an | grep 3001

**Error: GEMINI_API_KEY not found**
- Verifica backend/.env
- Asegurate de no tener espacios

**Error: Firebase not initialized**
- Verifica Firebase credentials
- Revisa logs del backend

**Error: CORS**
- CORS ya esta habilitado en backend
- Si persiste, revisa app.ts linea cors()

---

Siguiente paso: Comienza Fase 2 (Dashboard)

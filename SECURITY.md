# Política de Seguridad

## Reporte de Vulnerabilidades

Gems SIMCE toma la seguridad muy en serio. Si descubres una vulnerabilidad, **por favor NO crees un issue público**.

### Cómo Reportar

**Email**: security@gems-simce.dev

**PGP Key**: [Disponible en solicitud]

**Información a Incluir**:
1. Descripción de la vulnerabilidad
2. Pasos para reproducir
3. Impacto potencial
4. Sugerencias de remediación (opcional)

### Proceso

1. Enviamos confirmación en 24 horas
2. Investigamos y reproducimos el issue
3. Comunicamos plan de remediación
4. Releases parche de seguridad
5. Acreditamos al investigador (si deseas)

**Tiempo de respuesta esperado**: 7 días para evaluación crítica

## Estándares de Seguridad

### Autenticación
- Firebase Auth obligatorio para endpoints protegidos
- JWT tokens con expiración de 1 hora
- Refresh tokens con expiración de 30 días
- MFA opcional para docentes administrativos

### Encriptación
- TLS 1.3+ para todas las conexiones
- AES-256 para datos en reposo en Firestore
- Hashing bcrypt (cost factor: 12) para contraseñas

### API Security
- Rate limiting: 100 requests/hora (free), 500/hora (pro)
- CORS restrictivo (solo dominios autorizados)
- CSRF protection en formularios
- Input validation en todos los endpoints
- SQL injection prevention (Firestore ORM)

### Credenciales

**NUNCA en GitHub**:
```bash
# ❌ MAL
export API_KEY="sk-123456"

# ✅ BIEN
export API_KEY="${API_KEY_FROM_ENV}"
```

**Manejo de Secrets**:
- Google Cloud Secret Manager para producción
- `.env.example` con valores placeholder
- `.env` en `.gitignore`
- Audit logs de acceso a secrets

### Dependencias

**Escaneo Regular**:
```bash
npm audit
npm audit fix
```

**Monitoreo**:
- Dependabot alertas automáticas
- Snyk para análisis de vulnerabilidades
- OWASP Top 10 compliance check

### Base de Datos (Firestore)

**Security Rules**:
```javascript
// Solo docentes ven planes de su escuela
match /gems/{gemId} {
  allow read: if request.auth.uid in resource.data.allowedTeachers;
  allow write: if request.auth.uid == resource.data.teacherId;
}
```

**Backup**:
- Diario automático a Cloud Storage
- Punto de recuperación de 7 días
- Encriptación en tránsito y reposo

### Infraestructura (GCP)

**Red**:
- VPC privada para Cloud Run
- Cloud NAT para egreso
- DDoS Protection via Cloud Armor
- WAF rules para protección web

**Acceso**:
- Identidad y acceso (IAM) por principio de menor privilegio
- Service accounts con permisos mínimos
- Audit logging de todas las acciones

### Compliance

#### LGPD (Ley de Protección de Datos Personales - Chile)
- ✅ Consentimiento explícito para recopilación
- ✅ Derecho al olvido implementado
- ✅ Portabilidad de datos disponible
- ✅ Privacy by design en arquitectura

#### COPPA (Protección de Menores)
- ✅ Verificación de edad de estudiantes
- ✅ Consentimiento parental opcional
- ✅ Sin tracking para menores de 13

#### Educación (MINEDUC)
- ✅ Cumplimiento de estándares pedagógicos
- ✅ Protección de datos de estudiantes
- ✅ Auditoría anual de privacidad

## Checklist de Seguridad para PR

- [ ] No hay credenciales en el código
- [ ] Environment variables para config sensible
- [ ] Input validation implementado
- [ ] SQL injection prevented (usando ORM)
- [ ] XSS protection (React por defecto)
- [ ] CSRF tokens en formularios
- [ ] Autenticación requerida si es necesario
- [ ] Logs no contienen datos sensibles
- [ ] Errores no exponen stack traces
- [ ] Dependencias auditadas (`npm audit`)

## Incidentes de Seguridad

### Reporte de Incidente Actual

Ningún incidente reportado hasta la fecha.

**Última auditoría**: Enero 2, 2026

### Histórico (si aplica)

Ver CHANGELOG.md para parches de seguridad.

## Mejores Prácticas para Usuarios

### Docentes
1. Usa contraseña fuerte (12+ caracteres)
2. Habilita autenticación multi-factor
3. No compartas credenciales
4. Cierra sesión en equipos compartidos
5. Reporta acceso sospechoso inmediatamente

### Administradores de Escuela
1. Realiza auditoría trimestral de acceso
2. Revisa logs de acceso a datos sensibles
3. Desactiva usuarios inactivos
4. Mantén copias de seguridad
5. Reporta vulnerabilidades responsablemente

## Contactos de Seguridad

| Rol | Email | PGP |  
|-----|-------|-----|
| Security Lead | security@gems-simce.dev | [Key] |
| DevOps | devops@gems-simce.dev | [Key] |
| CTO | tech@gems-simce.dev | [Key] |

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

**Última actualización**: Enero 2, 2026  
**Próxima revisión**: Abril 2, 2026

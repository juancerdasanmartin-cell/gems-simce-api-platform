# Testing & Quality Assurance

## Estándares de Calidad

### Cobertura de Código
- **Mínimo**: 80% cobertura de líneas
- **Meta**: 90%+ cobertura
- **Excluido**: Archivos de configuración, más de 20 líneas consecutivas de logs

### Reporte de Cobertura
```bash
cd backend
npm run test:coverage
```

Resultados se publican en:
- `coverage/` carpeta local
- Codecov CI/CD (si está configurado)

## Tipos de Tests

### 1. Unit Tests

**Frameworks**: Jest + Supertest

**Ubicación**:
```
backend/
├── src/
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── middleware/
│   ├── integration/
│   └── e2e/
```

**Ejemplo**:
```typescript
// tests/unit/services/gemini.service.test.ts
import { GeminiService } from '../../../src/services/gemini.service';

describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
  });

  describe('generateGemSIMCE', () => {
    it('should generate a valid gem plan', async () => {
      const input = {
        studentCount: 35,
        simulatedScores: { reading: 245 },
        studentDifficulties: ['Cohesión textual']
      };

      const result = await service.generateGemSIMCE(input);

      expect(result).toBeDefined();
      expect(result.plan).toHaveProperty('section1_diagnostic');
      expect(result.generationTime).toBeLessThan(45);
    });

    it('should handle API errors gracefully', async () => {
      const invalidInput = { studentCount: -5 };

      await expect(service.generateGemSIMCE(invalidInput))
        .rejects
        .toThrow('Invalid input');
    });
  });
});
```

**Ejecutar**:
```bash
npm run test:unit
npm run test:unit -- --watch  # modo vigil
```

### 2. Integration Tests

**Prueban la interacción entre componentes**

**Ejemplo**:
```typescript
// tests/integration/gems.integration.test.ts
describe('POST /gems/simce-lenguaje', () => {
  let request: SuperTest;

  beforeAll(() => {
    request = supertest(app);
  });

  it('should create a gem with auth', async () => {
    const response = await request
      .post('/gems/simce-lenguaje')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        schoolId: 'school-123',
        studentCount: 35,
        simulatedScores: { reading: 245 }
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should reject without auth', async () => {
    const response = await request
      .post('/gems/simce-lenguaje')
      .send({ /* data */ });

    expect(response.status).toBe(401);
  });
});
```

**Ejecutar**:
```bash
npm run test:integration
```

### 3. End-to-End (E2E) Tests

**Prueban flujos completos usuario**

**Framework**: Cypress o Playwright

```typescript
// tests/e2e/gem-generation.e2e.test.ts
describe('Gem Generation Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.login('teacher@school.cl', 'password');
  });

  it('should generate a gem end-to-end', () => {
    // Navegar a dashboard
    cy.contains('Dashboard').click();

    // Hacer click en generar
    cy.contains('Generar Gem').click();

    // Llenar formulario
    cy.get('[data-cy=className]').type('Tercero Medio A');
    cy.get('[data-cy=studentCount]').type('35');
    cy.get('[data-cy=scores-reading]').type('245');

    // Esperar y verificar resultado
    cy.get('[data-cy=generate-btn]').click();
    cy.contains('Gem generado', { timeout: 45000 });
    cy.get('[data-cy=plan-section1]').should('be.visible');
  });
});
```

**Ejecutar**:
```bash
npm run test:e2e
```

### 4. Performance Tests

**Miden velocidad y uso de recursos**

```typescript
// tests/performance/api-response-time.test.ts
it('should respond in under 2 seconds', async () => {
  const start = performance.now();
  
  const response = await service.generateGemSIMCE(testInput);
  
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(2000);
});
```

## Frontend Testing (React)

### Unit Tests con React Testing Library

```typescript
// tests/components/GemGenerator.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GemGenerator from '../src/components/GemGenerator';

describe('GemGenerator', () => {
  it('should render form and submit', async () => {
    const { getByRole, getByText } = render(<GemGenerator />);
    
    const input = getByRole('textbox', { name: /class name/i });
    await userEvent.type(input, 'Tercero Medio A');
    
    const submitBtn = getByText('Generar');
    userEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/gem generado/i)).toBeInTheDocument();
    });
  });
});
```

**Ejecutar**:
```bash
cd frontend
npm run test
npm run test:coverage
```

## CI/CD Testing

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Integration tests
        run: npm run test:integration
      
      - name: Coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Checklist de Calidad para PR

- [ ] Tests agregados para nuevas funcionalidades
- [ ] Cobertura mantiene >80%
- [ ] Todos los tests pasan localmente
- [ ] Lint sin errores (`npm run lint`)
- [ ] Documentación actualizada
- [ ] Sin console.logs en producción
- [ ] Sin secrets/API keys en código
- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Cambios de base de datos documentados
- [ ] Performance aceptable (<2s respuesta)

## Herramientas de Testing

| Herramienta | Propósito | Comando |
|-------------|-----------|----------|
| Jest | Test runner | `npm test` |
| Supertest | HTTP testing | Incluido en Jest |
| React Testing Library | Component tests | `npm test` (frontend) |
| Cypress/Playwright | E2E | `npm run test:e2e` |
| ESLint | Linting | `npm run lint` |
| Prettier | Formato | `npm run format` |
| TypeScript | Type checking | `npm run type-check` |
| SonarQube | Code quality | CI/CD |

## Debugging

### Debug un Test

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Luego abrir `chrome://inspect` en Chrome.

### Verbose Output

```bash
npm run test -- --verbose
```

## Benchmarks Esperados

**Backend**:
- Unit test suite: <5s
- Integration tests: <30s
- API response: <2s promedio
- Gem generation: <40s

**Frontend**:
- Component tests: <10s
- E2E tests: <5min
- Build: <1min
- Bundle size: <500KB (gzip)

## Mejores Prácticas

1. **Test Early**: Escribir tests junto con código
2. **Arrange-Act-Assert**: Estructura clara en tests
3. **Mock External Services**: No hacer llamadas reales a Vertex AI en tests
4. **Test Edge Cases**: Verificar errores, valores nulos, etc.
5. **Mantener Tests Ágiles**: <100ms por test unit
6. **Nombres Descriptivos**: `shouldReturnErrorWhenInputInvalid`
7. **No Test Implementation**: Test behavior, no detalles internos
8. **DRY Tests**: Reutilizar fixtures y helpers

## Exemplo Fixture (Test Data)

```typescript
// tests/fixtures/gem.fixture.ts
export const createTestGemInput = (overrides = {}) => ({
  schoolId: 'test-school',
  teacherId: 'test-teacher',
  className: 'Tercero Medio A',
  studentCount: 35,
  simulatedScores: { reading: 245, writing: 238 },
  studentDifficulties: ['Cohesión textual'],
  ...overrides
});

// En tests
const testInput = createTestGemInput({ studentCount: 50 });
```

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
- [Cypress Docs](https://docs.cypress.io/)

**Última actualización**: Enero 2, 2026

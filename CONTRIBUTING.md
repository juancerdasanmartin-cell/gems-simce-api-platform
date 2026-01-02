# Contributing to Gems SIMCE API Platform

Thank you for your interest in contributing to the Gems SIMCE project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on educational impact
- Support teachers and schools in Chilean education system
- Review code thoroughly before suggesting changes
- Celebrate community contributions

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/gems-simce-api-platform.git
cd gems-simce-api-platform
git remote add upstream https://github.com/juancerdasanmartin-cell/gems-simce-api-platform.git
```

### 2. Create Development Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming convention:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `test/description` - Tests
- `chore/description` - Maintenance tasks

### 3. Setup Local Environment

Follow [SETUP.md](./SETUP.md) for complete setup instructions.

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values

cd ../frontend
npm install
```

## Development Workflow

### Writing Code

1. **Code Style**
   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Max line length: 100 characters

2. **Comments**
   - Document complex logic
   - Explain "why" not "what"
   - Use JSDoc for functions

```typescript
/**
 * Generate a SIMCE improvement plan using Gemini API
 * @param input - Student scores and difficulties
 * @returns Promise<GemPlan> - 6-section improvement plan
 * @throws Error if Gemini API call fails
 */
async function generateGemSIMCE(input: GemInput): Promise<GemPlan> {
  // Implementation
}
```

3. **Testing**
   - Write tests for new features
   - Aim for 80%+ code coverage
   - Test happy path + error cases

```bash
# Run tests
cd backend
npm run test

# With coverage
npm run test:coverage
```

### Commit Messages

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Test addition/modification
- `chore`: Build, dependencies, etc.

Examples:
```
feat(gems): Add support for SIMCE matematica subject

implement Gemini prompt for math improvement plans
handle common misconceptions in fractions

Closes #123
```

```
fix(auth): Prevent token expiry during long operations

token now refreshes every 55 minutes instead of 60
adds retry logic for failed refresh attempts

Closes #456
```

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style (run `npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] Documentation updated if needed
- [ ] No console.logs left in code
- [ ] Environment variables properly handled

### 2. Submit PR

```bash
git push origin feature/your-feature-name
```

Then create PR on GitHub with:

**Title**: `feat(scope): Brief description`

**Description**:
```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update

## How to Test
Steps to verify the changes

## Screenshots (if applicable)
Visual evidence of changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

## Related Issues
Closes #123
```

### 3. Code Review

- Respond to feedback promptly
- Don't take criticism personally
- Discuss disagreements respectfully
- Update PR based on review comments

## Feature Development

### Backend Features

1. **Create API endpoint**
   - Add route in `backend/src/api/`
   - Implement handler function
   - Add input validation
   - Add error handling

2. **Database changes**
   - Update `DATABASE_SCHEMA.md`
   - Create Firestore migration script
   - Add security rules
   - Create indexes if needed

3. **Authentication**
   - Use Firebase Auth
   - Check user permissions
   - Validate school ownership

4. **Testing**
   - Unit tests for logic
   - Integration tests for API
   - Test error scenarios

### Frontend Features

1. **Create component**
   - Use functional components with hooks
   - Add TypeScript types
   - Include error boundaries

2. **API integration**
   - Use service layer for API calls
   - Handle loading states
   - Display error messages

3. **Testing**
   - Component tests with React Testing Library
   - User interaction tests

## Documentation

Update relevant documentation for:
- New features → `ARCHITECTURE.md`
- API changes → `API_EXAMPLES.md`
- Database changes → `DATABASE_SCHEMA.md`
- Setup changes → `SETUP.md`
- Deployment changes → `DEPLOYMENT.md`

## Performance Guidelines

### Backend
- Database queries should complete in <100ms
- API responses should be <1s (except Gemini generation)
- Use connection pooling for Firestore
- Cache frequently accessed data

### Frontend
- Page should be interactive in <2s
- Images should be optimized (<100KB)
- Code splitting for large components
- Lazy load non-critical features

## Security Checklist

- [ ] No API keys in code (use environment variables)
- [ ] Input validation for all user inputs
- [ ] SQL injection prevention (using Firestore ORM)
- [ ] XSS protection (React default)
- [ ] CSRF tokens where applicable
- [ ] Rate limiting for sensitive endpoints
- [ ] Secure password handling
- [ ] HTTPS enforcement

## Debugging

### Backend

```bash
# Enable debug logging
DEBUG=gems-simce:* npm run dev

# Use VS Code debugger (see SETUP.md)
```

### Frontend

```bash
# React DevTools extension
npm run dev
# Open DevTools in browser
```

## Common Issues

### "Port already in use"
```bash
kill -9 $(lsof -ti:3000)  # Backend
kill -9 $(lsof -ti:5173)  # Frontend
```

### "Firebase connection error"
- Check `.env` variables
- Verify service account JSON
- Ensure APIs are enabled in GCP

### "Firestore indexes not building"
- Check Cloud Firestore console
- Wait for indexes to build
- Clear browser cache

## Questions?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- Review existing issues and PRs
- Ask in discussions section
- Create GitHub issue with "question" label

## Resources

- [SETUP.md](./SETUP.md) - Local development setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [API_EXAMPLES.md](./API_EXAMPLES.md) - API documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database structure
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Recognition

Contributors are recognized in:
- GitHub Contributors page
- CONTRIBUTORS.md file
- Release notes
- Project README

Thank you for contributing to make education better in Chile! 🇨🇱📚

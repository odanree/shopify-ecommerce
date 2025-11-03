# Contributing to Shopify Ecommerce Project

Thank you for considering contributing to this project! 

## Development Process

We use conventional commits and GitHub issues for tracking work.

### Conventional Commits

All commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Scopes:**
- `theme`: Custom Shopify theme
- `headless`: Next.js headless storefront
- `api`: Shopify API integration
- `docs`: Documentation
- `config`: Configuration files
- `deps`: Dependencies

**Examples:**
```bash
feat(headless): add product filtering functionality
fix(theme): resolve mobile navigation bug
docs: update installation instructions
chore(deps): upgrade Next.js to v14.2.0
```

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Pull Request Process

1. Create a new branch from `main`
2. Make your changes following conventional commits
3. Update documentation if needed
4. Test your changes locally
5. Submit a pull request

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on

## Code Style

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting

### Liquid Templates
- Follow Shopify theme best practices
- Use proper indentation
- Add comments for complex logic

### CSS
- Use CSS Modules for component styling in headless project
- Follow BEM naming for custom theme
- Keep styles modular and reusable

## Testing

Before submitting:
- Test on multiple browsers
- Check mobile responsiveness
- Verify Shopify API integration
- Run `npm run lint` for headless project

## Questions?

Feel free to open an issue for any questions or clarifications!

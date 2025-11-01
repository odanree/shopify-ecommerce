# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced product card component with advanced e-commerce features (#1)
- Featured products section with Theme Editor support (#2)
- Comprehensive documentation for Shopify Liquid components (#3)
- Badge system for products (Sale, New, Top Rated, Waterproof, Customizable)
- Quick view button with hover effects
- AJAX quick add to cart functionality
- Color swatches for product variants
- Reviews and ratings display
- Responsive image handling with srcset
- Lazy loading for performance optimization
- Accessibility features with ARIA labels

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - 2025-11-01

### Added
- Initial project setup
- Base Shopify theme structure
- Product card component foundation
- Section architecture

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Breaking Changes
Breaking changes should be indicated by `!` after type/scope:
```
feat!: remove deprecated API endpoints
```

### Examples

```bash
# Feature
feat(product-card): add quick view functionality

# Bug fix
fix(cart): resolve AJAX cart update issue

# Documentation
docs(readme): update installation instructions

# Performance
perf(images): implement lazy loading for product images

# Refactor
refactor(product-card): simplify badge rendering logic
```

---

## Release Notes

### Version 1.0.0 - Initial Release (2025-11-01)

**Highlights:**
- Production-ready product card component
- Full Theme Editor customization support
- Mobile-first responsive design
- Performance optimized with lazy loading
- Accessibility compliant

**Features:**
- Enhanced product cards with hover effects
- Dynamic badge system
- Quick add to cart
- Color swatches
- Reviews integration
- Responsive grid layouts

**Technical:**
- Vanilla JavaScript (no dependencies)
- Modern Liquid patterns
- CSS Grid and Flexbox
- Shopify Ajax Cart API integration

**Documentation:**
- Complete installation guide
- Usage examples
- Customization instructions
- Performance tips

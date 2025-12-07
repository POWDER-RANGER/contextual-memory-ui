# Contributing to Contextual

Thank you for your interest in contributing to Contextual! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/contextual-memory-ui.git
   cd contextual-memory-ui
   ```
3. **Open index.html** in your browser to test the application

## How to Contribute

### Reporting Bugs

- Use the GitHub Issues tracker
- Check if the issue already exists before creating a new one
- Include detailed information:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Browser and OS information
  - Screenshots if applicable

### Suggesting Enhancements

- Open an issue with the label "enhancement"
- Clearly describe the enhancement and its benefits
- Include mockups or examples if possible

### Code Contributions

We welcome code contributions! Here's how to get started:

1. Check existing issues or create a new one
2. Comment on the issue to indicate you're working on it
3. Follow the development workflow below

## Development Workflow

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Keep changes focused and atomic
   - Test your changes thoroughly
   - Update documentation as needed

3. **Test your changes**:
   - Open index.html in multiple browsers
   - Test responsiveness on different screen sizes
   - Verify all features work as expected

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "type: brief description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

## Style Guidelines

### HTML/CSS

- Use 2 spaces for indentation
- Follow semantic HTML practices
- Keep CSS organized and commented
- Use consistent naming conventions

### JavaScript

- Use modern ES6+ syntax
- Write clear, self-documenting code
- Add comments for complex logic
- Follow React best practices for components

### File Organization

- Keep the single-file architecture for simplicity
- Add clear section comments in index.html
- Group related functionality together

## Commit Messages

Follow conventional commit format:

```
type: brief description

Detailed description if needed

Fixes #issue-number
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: Add export to JSON functionality
fix: Resolve search filtering bug
docs: Update README installation steps
style: Format code with consistent spacing
refactor: Improve state management in search component
```

## Pull Request Process

1. **Ensure your PR**:
   - Has a clear title and description
   - References related issues
   - Includes tests if applicable
   - Updates documentation if needed
   - Follows the style guidelines

2. **PR Description Should Include**:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots for UI changes

3. **Review Process**:
   - A maintainer will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

4. **After Merge**:
   - Delete your feature branch
   - Pull the latest main branch
   - Thank you for your contribution!

## Questions?

- Open an issue for questions
- Check existing issues and discussions
- Tag your issue appropriately

## Recognition

All contributors will be recognized in our project. Your contributions help make Contextual better for everyone!

Thank you for contributing to Contextual! 🎉

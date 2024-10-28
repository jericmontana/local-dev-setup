# Shopify Theme Development Setup

This repository provides a starting template for Shopify theme development, including a pre-configured ***`src`*** folder, tools, and settings optimized for faster development.

## Getting Started

Follow these steps to create a new Shopify project using this setup.

### 1. Clone the Repository

First, clone this repository to your local machine:

**_Note:_** *Make sure you are in the project directory.*

```bash
git clone --single-branch --branch main https://github.com/jericmontana/local-dev-setup.git ./
```

### 2. Remove Git History
To start fresh with your own Git setup, remove the existing Git history:
- Linux/macOS:
    ```sh
    rm -rf .git 
    ```
- Windows:
    ```bash
    rmdir .git /s /q
    ```

### 3. Initialize a New Git Repository
After removing the Git history, initialize a new repository:

```bash
git init
```

### 4. Use main instead of master

```bash
git branch -m main
```

### 4. Add Files and Make the Initial Commit
Stage all files and commit them:

```bash
git add .
git commit -m "Local development setup"
```

### 5. Link to a New Remote Repository
If you have a new Git repository URL, you can link it:
**_Note:_** *Replace <new_repository_url> with your actual repository URL.*

```bash
git remote add origin <new_repository_url>
git push -u origin main
```
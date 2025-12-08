# HUMSJ Charity - Repository Separation Guide

## Overview

This guide explains how to maintain separate GitHub repositories for the website and mobile app while sharing the same source code.

## Repository Structure

### Website Repository: `humsj-charity-website`

- **Purpose**: Deploy website to Netlify
- **Platform**: Web (React)
- **Deployment**: Netlify
- **URL**: https://humsj-charity.netlify.app

### Mobile Repository: `humsj-charity-mobile`

- **Purpose**: Build Android mobile app
- **Platform**: Android (Capacitor)
- **Deployment**: APK distribution
- **Target**: Android devices

## Setup Instructions

### Step 1: Create Website Repository

```bash
# Run the setup script
./setup-website-repo.bat

# Or manually:
git init
git add .
git commit -m "Initial website commit"
# Create GitHub repo: humsj-charity-website
git remote add origin https://github.com/yourusername/humsj-charity-website.git
git push -u origin main
```

### Step 2: Create Mobile Repository

```bash
# Run the setup script
./setup-mobile-repo.bat

# Or manually:
git init
git add .
git commit -m "Initial mobile commit"
# Create GitHub repo: humsj-charity-mobile
git remote add origin https://github.com/yourusername/humsj-charity-mobile.git
git push -u origin main
```

### Step 3: Configure GitHub Actions

#### Website Repository Actions

- File: `.github/workflows/website.yml`
- Triggers: Push to main branch
- Deploys to: Netlify

#### Mobile Repository Actions

- File: `.github/workflows/android.yml`
- Triggers: Push to main branch
- Builds: Android APK

## File Separation

### Website Repo Excludes:

- `android/` - Android project files
- `ios/` - iOS project files
- `capacitor.config.ts` - Mobile configuration
- `setup-android.bat` - Android setup script
- `build-android.bat` - Android build script
- `src/components/BottomNav.tsx` - Mobile navigation
- `src/components/Layout.tsx` - Mobile layout
- `src/services/mobileService.ts` - Mobile services
- `.github/workflows/android.yml` - Android workflow

### Mobile Repo Excludes:

- `.vercel/` - Vercel config
- `.netlify/` - Netlify config
- `deploy-website.bat` - Website deployment script
- `.github/workflows/website.yml` - Website workflow

## Workflow Management

### Development Workflow

1. Make changes to shared source code
2. Test locally on both web and mobile
3. Use `sync-repos.bat` to push to both repositories
4. Automated deployments handle the rest

### Sync Script Usage

```bash
./sync-repos.bat
# Options:
# 1 - Push to Website repo only
# 2 - Push to Mobile repo only
# 3 - Push to both repos
# 4 - Cancel
```

## Deployment Commands

### Website

```bash
# Manual deployment
./deploy-website.bat

# Auto deployment via GitHub Actions
# Trigger: Push to main branch
```

### Mobile

```bash
# Manual build
./build-android.bat

# Run on device
npm run cap:run:android

# Auto build via GitHub Actions
# Trigger: Push to main branch
# Download: APK from Actions artifacts
```

## Environment Variables

### Website Repository

- `NETLIFY_AUTH_TOKEN`: Netlify API token
- `NETLIFY_SITE_ID`: Netlify site ID

### Mobile Repository

- No additional secrets needed for debug builds
- For release builds: Android signing keys

## Branch Strategy

### Main Branch

- Production-ready code
- Triggers deployments
- Stable version

### Development Branch (Optional)

- Feature development
- Testing new features
- No automatic deployments

## Benefits of Separation

### Website Repo Benefits

- Faster deployment cycles
- Web-specific optimizations
- Independent versioning
- Web-focused CI/CD

### Mobile Repo Benefits

- Mobile-specific configurations
- Android build optimizations
- App store distribution ready
- Mobile-focused testing

## Maintenance

### Regular Tasks

1. Sync changes between repos
2. Update dependencies
3. Test both platforms
4. Monitor deployments

### When to Sync

- Feature completions
- Bug fixes
- Dependency updates
- Configuration changes

## Troubleshooting

### Common Issues

1. **Git conflicts**: Resolve before syncing
2. **Build failures**: Check platform-specific dependencies
3. **Deployment errors**: Verify environment variables
4. **Sync failures**: Check remote URLs

### Recovery Steps

1. Identify the affected repository
2. Fix the issue locally
3. Test the fix
4. Sync to the correct repository
5. Verify deployment

## Best Practices

1. **Test locally before syncing**
2. **Use descriptive commit messages**
3. **Keep repositories in sync**
4. **Monitor both deployments**
5. **Document breaking changes**

## Contact

For issues or questions about the repository separation:

- Website issues: Website repository issues
- Mobile issues: Mobile repository issues
- General issues: Create discussion in either repo

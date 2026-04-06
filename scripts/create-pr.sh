#!/bin/bash

# Configure git
git config user.email "v0[bot]@users.noreply.github.com"
git config user.name "v0[bot]"

# Add all changes
git add -A

# Commit with a descriptive message
git commit -m "feat: Add Clerk authentication with modern UI redesign

- Setup Clerk authentication with Next.js 16
- Create modern sign-in and sign-up pages with split-screen design
- Build protected dashboard with habits, sleep, learning, and goals tracking
- Add responsive landing page with features showcase
- Add about page with creator info
- Implement middleware for route protection
- Modern design system with clean typography and cohesive colors

Co-authored-by: v0[bot] <v0[bot]@users.noreply.github.com>"

# Push to the branch
git push origin v0/asymalwali-f7642487

# Create pull request using GitHub CLI
gh pr create \
  --base main \
  --head v0/asymalwali-f7642487 \
  --title "feat: Clerk Authentication & Modern UI Redesign" \
  --body "## Summary
This PR adds complete Clerk authentication and modernizes the Pulse app design.

### Changes
- **Authentication**: Integrated Clerk with sign-in/sign-up pages and protected routes
- **Dashboard**: New dashboard with habit tracking, sleep logging, learning tracker, and goals
- **Landing Page**: Modern hero section with features grid
- **About Page**: Creator profile and app story
- **Design**: Clean, minimal aesthetic with responsive layouts

### Testing
1. Visit the landing page
2. Click 'Get Started' to sign up
3. After authentication, access the protected dashboard
4. Test all dashboard features (habits, sleep, learning, goals)

Co-authored-by: v0[bot] <v0[bot]@users.noreply.github.com>"

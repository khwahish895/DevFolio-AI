# Netlify Deployment TODO

## Approved Plan Steps (In Progress)

### 1. [x] Create netlify.toml (build config)
### 2. [x] Create .env.local (local GEMINI_API_KEY)
### 3. [x] Create netlify/functions/ai.ts (serverless proxies)
### 4. [ ] Fix netlify/functions/ai.ts TypeScript errors
   - Install deps: `@netlify/functions @google/generative-ai @types/node`
   - Fix types & process.env
### 5. [ ] Update src/services/ai.ts (all functions to proxy)
### 6. [ ] Update package.json (add netlify script)
### 7. [] Test locally
   - `npm install`
   - `npm run build`
   - `netlify dev`
### 8. [] Deploy
   - `netlify deploy --prod --dir=dist`
   - Set GEMINI_API_KEY in Netlify dashboard
### 9. [] Verify live site + AI functions

Next: Install deps and fix TS errors.


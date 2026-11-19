import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const tempOutDir = path.resolve(rootDir, '.tmp-bigcartel-dist');
const distOutPath = path.join(distDir, 'bigcartel-maintenance.html');
const workspaceOutDir = path.resolve(rootDir, 'bigcartel');
const workspaceAssetsDir = path.join(workspaceOutDir, 'assets');
const workspaceOutPath = path.join(workspaceOutDir, 'bigcartel-maintenance.html');
const liquidOutPath = path.join(workspaceOutDir, 'bigcartel-maintenance.liquid.html');
const snippetOutPath = path.join(workspaceOutDir, 'maintenance-snippet.html');

try {
  // Build a single-bundle version (inlining lazy chunks like YuusRushGame)
  // so there are zero extra chunk requests when hosted on Big Cartel or external CDNs.
  await build({
    root: rootDir,
    logLevel: 'silent',
    build: {
      outDir: tempOutDir,
      emptyOutDir: true,
      cssCodeSplit: false,
      assetsInlineLimit: 100_000_000,
      rolldownOptions: {
        output: {
          codeSplitting: false,
        },
      },
    },
  });

  const indexPath = path.join(tempOutDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Single-bundle index.html not found after build.');
    process.exit(1);
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  let extractedCss = '';
  let extractedJs = '';

  // Remove modulepreload hints for chunks that are now inlined
  html = html.replace(/<link\s+rel="modulepreload"[^>]*>\s*/gi, '');

  // Extract & inline stylesheet(s) safely
  html = html.replace(
    /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
    (_match, href) => {
      const cleanPath = path.join(tempOutDir, href.replace(/^\//, ''));
      if (!fs.existsSync(cleanPath)) return _match;
      const css = fs.readFileSync(cleanPath, 'utf8');
      extractedCss += css;
      return `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`;
    },
  );

  // Extract & inline module script(s) safely
  html = html.replace(
    /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
    (_match, src) => {
      const cleanPath = path.join(tempOutDir, src.replace(/^\//, ''));
      if (!fs.existsSync(cleanPath)) return _match;
      const js = fs.readFileSync(cleanPath, 'utf8');
      extractedJs += js;
      return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`;
    },
  );

  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(workspaceAssetsDir, { recursive: true });

  // 1. Standalone full inline HTML exports
  fs.writeFileSync(distOutPath, html, 'utf8');
  fs.writeFileSync(workspaceOutPath, html, 'utf8');
  fs.writeFileSync(liquidOutPath, `{% raw %}\n${html}\n{% endraw %}\n`, 'utf8');

  // 2. Stable unhashed JS & CSS assets for external CDN / GitHub Pages / Netlify hosting
  fs.writeFileSync(path.join(workspaceAssetsDir, 'yabai-vault.css'), extractedCss, 'utf8');
  fs.writeFileSync(path.join(workspaceAssetsDir, 'yabai-vault.js'), extractedJs, 'utf8');

  // 3. Lightweight (~1 KB) Big Cartel Code > Maintenance loader snippet
  const snippetHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Yabai Society — Drop 04 Maintenance Vault</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Silkscreen:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <!-- Host bigcartel/assets/yabai-vault.css & yabai-vault.js on GitHub Pages / jsDelivr / Cloudflare / Netlify and replace YOUR_CDN_BASE_URL -->
    <link rel="stylesheet" href="YOUR_CDN_BASE_URL/yabai-vault.css" />
  </head>
  <body class="bg-[#FBF7EE] text-[#0A0908] antialiased selection:bg-[#AD3F32] selection:text-[#FBF7EE]">
    <div id="root"></div>
    <script type="module" src="YOUR_CDN_BASE_URL/yabai-vault.js"></script>
  </body>
</html>
`;
  fs.writeFileSync(snippetOutPath, snippetHtml, 'utf8');

  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(
    `Generated Big Cartel builds: dist/bigcartel-maintenance.html (${kb} KB), bigcartel/assets/yabai-vault.{js,css}, and bigcartel/maintenance-snippet.html`,
  );
} finally {
  fs.rmSync(tempOutDir, { recursive: true, force: true });
}

# Panel de administración — Enzo Diaz Zingaretti (Portfolio)

Panel privado en `/admin` para editar el contenido del portfolio (proyectos de
todas las categorías, Sobre mí, Contacto y la portada) sin tocar código. Al
**Publicar**, los cambios se guardan en el repositorio vía la API de GitHub y
Vercel redeploya solo: el sitio se actualiza en ~1 minuto.

## Alcance

- El panel edita el contenido **en español** (tu idioma principal). Inglés y
  portugués quedan en el código (`src/siteContent.i18n.js`) y se ajustan a mano
  si hace falta.
- Editás: **Sobre mí**, las 6 categorías de **proyectos** (Web, Motion, 3D,
  Flyers, Logos, Arquitectura), **Contacto** (textos y enlaces) y la **Portada**.
  En cada proyecto podés cambiar textos, imágenes, galería, reordenar, ocultar
  (interruptor "Visible") y agregar/eliminar.
- Lo estructural (menú de navegación, textos de interfaz) queda fijo en el código.

## Cómo funciona

- La fuente de verdad editable es **`public/content.json`**. El sitio la carga en
  vivo y la superpone sobre los textos del bundle (solo para español).
- Las imágenes que subís se comprimen a WebP en el navegador y se guardan en
  **`public/images/uploads/`**. Para videos (.mp4) pegás la ruta en el campo de
  galería (no se suben desde el panel).
- El acceso es por **contraseña**. La sesión dura 12 horas.

## Configuración (una sola vez)

El panel necesita 3 variables de entorno en Vercel. Sin ellas, `/admin` muestra
el login pero no deja entrar (queda "no configurado").

### 1. Generar la contraseña y el secreto

En la carpeta del proyecto:

```bash
node scripts/hash-password.cjs
```

Te pide una contraseña (mínimo 10 caracteres) e imprime `ADMIN_PASSWORD_HASH` y
`SESSION_SECRET`. La contraseña en texto plano no se guarda en ningún lado.

### 2. Crear el token de GitHub

GitHub → **Settings → Developer settings → Fine-grained tokens → Generate new token**:

- **Repository access**: solo este repo (`kexxy-portfolio`).
- **Permissions → Repository → Contents**: **Read and write**.
- Copiá el token (`github_pat_…`).

### 3. Cargar las variables en Vercel

Vercel → tu proyecto → **Settings → Environment Variables** (Production y Preview):

| Variable | Valor |
|---|---|
| `ADMIN_PASSWORD_HASH` | el hash `scrypt$…` del paso 1 |
| `SESSION_SECRET` | el valor del paso 1 |
| `GITHUB_TOKEN` | el token del paso 2 |

`GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_BRANCH` se toman solos del entorno de Vercel.

### 4. Redeploy

Después de cargar las variables, **redeployá**. Entrás a
`https://<tu-dominio>/admin`, ponés la contraseña y editás.

## Notas

- El acceso al panel está en el ícono ▲ discreto del pie de página.
- Agregar/quitar/reordenar proyectos afecta la versión en **español**. Si querés
  reflejarlo en inglés/portugués, se edita `src/siteContent.i18n.js`.

# Web de Espacio TEOTS

Copia **calcada** de espacioteots.org (26/10/2026): es la web original de WordPress guardada tal cual con el plugin Simply Static, con solo las páginas elegidas. Se ve igual que la original en ordenador y en móvil.

- Dirección de prueba: https://moguritto.github.io/espacioteots-web/
- La web está en la carpeta **`docs/`**. Cada página es un `index.html` dentro de una carpeta con el mismo nombre que su dirección (por ejemplo, `docs/aviso-legal/index.html` es `/aviso-legal/`).
- Estilos, letras, fotos y vídeo están en `docs/wp-content/` y `docs/wp-includes/` (como en WordPress). No hace falta tocarlos.

## Cambiar un texto

1. Entra en https://github.com/moguritto/espacioteots-web y abre la carpeta `docs/`.
2. Abre la página que quieras cambiar (por ejemplo `docs/index.html` es la portada).
3. Pulsa el icono del lápiz (**Edit this file**), arriba a la derecha.
4. Busca el texto (Ctrl+F) y cámbialo. Toca solo el texto entre `>` y `<`, no las etiquetas.
5. Pulsa el botón verde **Commit changes…** y, en la ventana que sale, otra vez **Commit changes**.
6. En uno o dos minutos el cambio aparece en la web.

## Para quien mantenga la web

- `scripts/calcada/build.py`: genera `docs/` desde el ZIP de Simply Static (`python3 build.py ZIPDIR OUTDIR extra.txt`). Quita PixelYourSite y Google, cambia el feed de Instagram por un enlace, arregla los teléfonos mal enlazados, convierte las direcciones a relativas (sirve en github.io/espacioteots-web/ y en el dominio) y crea redirecciones desde direcciones antiguas.
- `scripts/calcada/test.cjs`: abre todas las páginas con Playwright y lista los archivos que faltan; `extra.txt` son los archivos que Elementor carga a demanda.
- `scripts/` y `contenido/` (resto): herramientas de la primera copia (reconstruida), ya sustituida. Se conservan como referencia.

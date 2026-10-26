# espacioteots.org: copia calcada. El calendario EventON se reproduce con su mismo
# HTML y estilos; la meditación de los jueves (19:00-20:00) se calcula en el navegador.
import os as _os
EVENTON_STATIC = open(_os.path.join(_os.path.dirname(_os.path.abspath(sys.argv[4])), "evo_espacioteots.html"), encoding="utf-8").read()
SUBS = [
    (r'<script\b[^>]*src="[^"]*(?:/eventON/|meet\.jit\.si)[^"]*"[^>]*></script>', ''),
    (r'<script\b[^>]*id="(?:evo-inlinescripts[^"]*|evcal_ajax_handle-js-extra|evcal_functions-js-extra)"[^>]*>.*?</script>', ''),
]
LIVE_JSON = "/mnt/user-data/uploads/Downloads/espacioteots_html_vivo.json"
# teléfonos mal enlazados en la original (href="+34..." o "622..."): mismo aspecto, enlace que funciona
SUBS += [(r'href="\+?(?:34)?(\d{9})"', r'href="tel:+34\1"')]

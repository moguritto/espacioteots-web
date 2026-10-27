"""Genera los perfiles de Rocío, Elisabet y Mari con el diseño de los perfiles antiguos
(plantilla: docs/roberto-linares/index.html). Uso: python3 perfiles_calcados.py DOCS_DIR"""
import re, sys, os

DOCS = sys.argv[1]
TPL = open(os.path.join(DOCS, 'roberto-linares/index.html'), encoding='utf-8').read()
ANA = open(os.path.join(DOCS, 'ana-andrade/index.html'), encoding='utf-8').read()
IG_SVG = re.search(r'<svg aria-hidden="true" class="e-font-icon-svg e-fab-instagram".*?</svg>', ANA, re.S).group(0)
PHONE_SVG = re.search(r'<svg aria-hidden="true" class="e-font-icon-svg e-fas-phone".*?</svg>', TPL, re.S).group(0)
WA_SVG = re.search(r'<svg aria-hidden="true" class="e-font-icon-svg e-fab-whatsapp".*?</svg>', TPL, re.S).group(0)


def H(t):
    return f'<p style="text-align: left;"><b><span style="color: #665e4c; font-size: 18px;">{t}</span></b></p>'


def P(t):
    return f'<p style="text-align: justify;">{t}</p>'


def replace_once(t, old, new):
    assert t.count(old) >= 1, old[:80]
    return t.replace(old, new, 1)


def between(t, start, end, new):
    """Sustituye el contenido entre la primera aparición de start y la siguiente de end."""
    i = t.index(start) + len(start)
    j = t.index(end, i)
    return t[:i] + new + t[j:]


def build(p):
    t = TPL
    slug = p['slug']
    # --- cabecera: SEO de Yoast -> etiquetas propias
    seo = (f'<title>{p["nombre"]} · {p["esp"]} | Espacio TEOTS</title>\n'
           f'\t<meta name="description" content="{p["desc"]}" />\n'
           f'\t<link rel="canonical" href="https://espacioteots.org/{slug}/" />\n'
           f'\t<meta property="og:locale" content="es_ES" />\n\t<meta property="og:type" content="profile" />\n'
           f'\t<meta property="og:title" content="{p["nombre"]} · {p["esp"]}" />\n'
           f'\t<meta property="og:description" content="{p["desc"]}" />\n'
           f'\t<meta property="og:url" content="https://espacioteots.org/{slug}/" />\n'
           f'\t<meta property="og:site_name" content="Espacio TEOTS" />\n'
           f'\t<meta property="og:image" content="https://espacioteots.org/perfiles/img/{p["foto"]}" />\n')
    t = re.sub(r'<title>.*?<!-- / Yoast SEO plugin. -->', seo, t, count=1, flags=re.S)
    t = t.replace("})('roberto-linares');", f"}})('{slug}');")
    t = t.replace('<meta name="description" content="Roberto Liñares. Terapia Somática - Rebirthing Breathwork">',
                  f'<meta name="description" content="{p["nombre"]}. {p["esp"]}">')
    # --- fondo de la cabecera de foto (ordenador y móvil)
    hero = (f'<style id="perfil-{slug}">'
            f'.elementor-19435 .elementor-element.elementor-element-5c21230:not(.elementor-motion-effects-element-type-background),'
            f'.elementor-19435 .elementor-element.elementor-element-e14618d:not(.elementor-motion-effects-element-type-background)'
            f'{{background-image:url("{p["fondo"]}")!important;background-position:{p.get("fondo_pos","center center")}!important}}'
            f'</style>\n</head>')
    t = replace_once(t, '</head>', hero)
    # --- cabecera: especialidad y nombre
    t = replace_once(t, '>Terapia de Rebirthing Breathwork</h2>', f'>{p["esp"]}</h2>')
    t = replace_once(t, '>ROBERTO LIÑARES</h2>', f'>{p["nombre"].upper()}</h2>')
    t = replace_once(t, '>Terapia de <br>Rebirthing Breathwork</h2>', f'>{p["esp_movil"]}</h2>')
    t = replace_once(t, '>Roberto<br>Liñares</h2>', f'>{p["nombre"].replace(" ", "<br>", 1)}</h2>')
    # --- cita (versión móvil y ordenador)
    cita = '"La respiración es el puente entre tu mente consciente e inconsciente" - Thich Nhat Hanh'
    assert t.count(cita) == 2
    t = t.replace(cita, p['cita'])
    # --- bloque 1: foto + texto
    t = re.sub(r'<img decoding="async" width="1200" height="1600" src="\.\./wp-content/uploads/2024/11/Rober-2\.jpg"[^>]*/>',
               f'<img decoding="async" width="{p["w"]}" height="{p["h"]}" src="../perfiles/img/{p["foto"]}" '
               f'class="attachment-full size-full" alt="{p["nombre"]}" style="border-radius:4px" />', t, count=1)
    t = between(t, 'data-id="d9d0078" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">\n\t\t\t\t<div class="elementor-widget-container">',
                '</div>\n\t\t\t\t</div>', '\n' + ''.join(p['bloque1']))
    t = between(t, 'data-id="14146b0" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">\n\t\t\t\t<div class="elementor-widget-container">',
                '</div>\n\t\t\t\t</div>', '\n' + ''.join(p['bloque2']))
    # --- bloque 2: sin segunda foto, solo texto a todo el ancho
    i = t.index('<section class="elementor-section elementor-inner-section elementor-element elementor-element-cd3ca13')
    j = t.index('<div class="elementor-element elementor-element-27ad2db', i)
    t = t[:i] + t[j:]
    t = between(t, 'data-id="95b43bd" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">\n\t\t\t\t<div class="elementor-widget-container">',
                '</div>\n\t\t\t\t</div>', '\n' + ''.join(p['bloque3']))
    # --- tarjeta «Agenda una cita»
    t = replace_once(t, '<div class="wpr-member-job">Terapia Somática</div>', f'<div class="wpr-member-job">{p["job"]}</div>')
    tel = p['tel']
    desc = (p['card'] + '</br></br>\n' + f'<a href="tel:+34{tel}">{p["tel_txt"]}</a>' +
            ''.join(f'</br><a href="{u}">{x}</a>' for x, u in p.get('enlaces', [])))
    t = re.sub(r'<div class="wpr-member-description">Rebirthing Breathwork.*?</div>',
               f'<div class="wpr-member-description">{desc}</div>', t, count=1, flags=re.S)
    social = (f'<a href="tel:+34{tel}" class="wpr-member-social">\n\t\t\t\t\t{PHONE_SVG}\t\t\t\t</a>\n'
              f'<a href="https://wa.me/+34{tel}" class="wpr-member-social">\n\t\t\t\t\t{WA_SVG}\t\t\t\t</a>\n')
    if p.get('instagram'):
        social += f'<a href="{p["instagram"]}" class="wpr-member-social">\n\t\t\t\t\t{IG_SVG}\t\t\t\t</a>\n'
    i = t.index('<div class="wpr-member-social-media">') + len('<div class="wpr-member-social-media">')
    j = t.index('</div>', i)
    t = t[:i] + '\n' + social + '\t\t' + t[j:]
    # --- botón Volver -> Profesionales
    t = replace_once(t, 'elementor-animation-grow" href="../">', 'elementor-animation-grow" href="../terapias/">')
    t = t.replace('Roberto Liñares', p['nombre'])
    from urllib.parse import quote
    t = re.sub(r'("post":\{"id":19435,"title":")[^"]*(","excerpt":")[^"]*', lambda m: m.group(1)+quote(p['nombre']+' | Espacio TEOTS')+m.group(2)+quote(p['desc']), t, count=1)
    leftover = [w for w in ('Rober', 'Liñares', 'Rebirthing') if w in t]
    assert not leftover, leftover
    return t


PERFILES = [
    dict(slug='rocio-quinteiro', nombre='Rocío Quinteiro', esp='Integración Emocional',
         esp_movil='Integración<br>Emocional', foto='rocio-quinteiro.webp', w=900, h=900,
         fondo='../wp-content/uploads/2024/02/edurne-tx-anVS-UkAsPU-unsplash.jpg',
         desc='Acompañamiento de procesos de transformación emocional: mapa emocional, mirada sistémica y trabajo somático. En Teots One (A Coruña) y online.',
         cita='"No buscamos dejar de sentir. Buscamos aprender a relacionarnos de una manera diferente con aquello que sentimos" - Rocío Quinteiro',
         bloque1=[H('El Despertar de Anahata'),
                  P('Acompaño procesos de transformación emocional para que aquello que ya comprendes pueda, por fin, asentarse también en tu cuerpo y en tu vida.'),
                  P('Podemos saber por qué nos sentimos de determinada manera, reconocer nuestros patrones e incluso entender de dónde vienen. Y, sin embargo, seguir reaccionando igual, sentirnos atrapadas en ciertas emociones o notar en el cuerpo respuestas que no conseguimos controlar desde la mente.'),
                  P('Por eso he desarrollado un método propio de acompañamiento, el eje de El Despertar de Anahata, que se articula en tres procesos: <b>comprender</b>, <b>sostener</b> e <b>integrar</b>.')],
         bloque2=[H('Comprender, sostener, integrar'),
                  P('<b>Comprender.</b> Nos acercamos a lo que estás viviendo para darle sentido: cómo sientes, qué necesitas para sentirte segura y qué patrones influyen en tu manera de relacionarte.'),
                  P('<b>Sostener.</b> Crear un espacio en el que aquello que aparece pueda ser observado y escuchado con más consciencia, sin rechazarlo ni intentar controlarlo de inmediato.'),
                  P('<b>Integrar.</b> Lo comprendido deja de quedarse solo en la mente y encuentra una nueva forma de expresarse en tu vida y en tu cuerpo.'),
                  H('Tres miradas para una misma emoción'),
                  P('No son tres terapias separadas ni pasos fijos, sino formas complementarias de observar una misma experiencia: lo que comprendo, lo que he vivido y lo que mi cuerpo expresa.'),
                  P('<b>Mapa emocional.</b> Exploramos tus necesidades emocionales, lo que te da seguridad, tus formas de protección y cómo procesas lo que vives. No para etiquetarte, sino para encontrar un punto de partida.'),
                  P('<b>Mirada sistémica.</b> La familia, los vínculos y los roles que has ocupado también moldean tu manera de sentir. Miramos dentro de qué historia aprendiste a sentir y a responder así.'),
                  P('<b>Trabajo somático.</b> Escuchamos dónde aparece la emoción en el cuerpo, cómo cambia la respiración y qué necesita ese cuerpo en ese momento, sin forzar ni eliminar nada.')],
         bloque3=[H('Recursos energéticos y de consciencia'),
                  P('Pueden utilizarse de manera independiente o complementar un proceso cuando aportan valor al acompañamiento: <b>Reiki</b>, presencial o a distancia; <b>meditaciones guiadas personalizadas</b>, creadas para tu momento y tu proceso; <b>acompañamiento profundo</b> desde una mirada consciente, en procesos de 7, 14 o 21 días; <b>Ho\'oponopono</b>, para favorecer el perdón, la reconciliación y la paz interior; <b>radioestesia</b> y <b>cirugía astral</b>.'),
                  H('Dónde'),
                  P('Atiendo con cita previa en <b>Teots One · A Coruña</b> (Rúa Pozo 7, bajo, 15005 A Coruña) y <b>online</b>, desde cualquier lugar.'),
                  P('Cada proceso se adapta a tus necesidades y a tu momento. Escríbeme y vemos juntas cómo empezar.')],
         job='Integración Emocional', card='Terapia somática, enfoque sistémico, Reiki y Ho\'oponopono. Teots One · A Coruña y online.',
         tel='623766089', tel_txt='623 76 60 89',
         enlaces=[('eldespertardeanahata.es', 'https://www.eldespertardeanahata.es/')],
         instagram='https://www.instagram.com/eldespertardeanahata/'),
    dict(slug='elisabet-ros', nombre='Elisabet Ros', esp='Terapia Transpersonal',
         esp_movil='Terapia<br>Transpersonal', foto='elisabet-ros.webp', w=900, h=1350,
         fondo='../perfiles/img/elisabet-mariposas.webp',
         desc='Acompañamiento en duelo, pérdida y procesos de transición vital desde la terapia transpersonal. En Lugo, A Coruña y online.',
         cita='"Es muy importante que hagáis aquello que realmente os importe… sólo así podréis bendecir la vida cuando la muerte esté cerca" - Elisabeth Kübler-Ross',
         bloque1=[H('Duelo, pérdida y procesos de transición'),
                  P('Acompaño a personas que atraviesan una pérdida, un duelo o un cambio vital, desde una presencia atenta, respetuosa y cercana.'),
                  P('Desde muy joven, las experiencias de pérdida y duelo han formado parte de mi historia personal. Con el tiempo, esas vivencias se transformaron en una vocación de servicio y fueron orientando mi camino hacia el acompañamiento de personas en momentos de pérdida, cambio y transformación.'),
                  P('Hace más de veinte años, la obra de la Dra. Elisabeth Kübler-Ross, junto con distintas tradiciones filosóficas de Oriente y Occidente, fue configurando mi mirada sobre la vida, la muerte y la pérdida. Mi formación como terapeuta transpersonal consolidó esa mirada integral.'),
                  P('Llevo más de diez años acompañando procesos de duelo, pérdida y transición vital, teniendo en cuenta la singularidad de cada persona y de cada proceso.')],
         bloque2=[H('Caminar a tu lado'),
                  P('Acompañar significa estar cerca de aquello que estás atravesando, ofreciendo un espacio de confianza desde el que puedas reconocer tus propios recursos y encontrar tu manera de transitar el proceso.'),
                  P('Mi papel es caminar a tu lado, con presencia, respeto y empatía, sin dirigir ni decidir por ti. Integro la terapia transpersonal con distintas herramientas cuando resultan adecuadas para ti: no se trata de aplicar una fórmula, sino de comprender mejor la experiencia y abrir nuevas posibilidades.'),
                  P('Las sesiones son un espacio seguro, cálido y confidencial, adaptado a tu momento, tus necesidades y tu ritmo.')],
         bloque3=[H('Espacios de acompañamiento'),
                  P('<b>Sesiones individuales.</b> Acompañamiento personalizado, adaptado a cada momento vital.'),
                  P('<b>Comprendiendo tu duelo (4 sesiones).</b> Programa individual para comprender y transitar el proceso de duelo.'),
                  P('<b>Proceso Crisálida (8 sesiones).</b> Método estructurado y personalizado para procesos de duelo y reconstrucción personal.'),
                  P('<b>Charlas mensuales, gratuitas y online.</b> Encuentros abiertos para acercarnos al duelo, la pérdida, la muerte y los procesos de transformación.'),
                  P('<b>Retiro en Lugo «Acompañar en el duelo y la pérdida».</b> Una propuesta para compartir y aprender en comunidad.'),
                  P('<b>Primer encuentro gratuito (20 minutos).</b> Para conocernos, contarte cómo trabajo y ver qué propuesta se ajusta mejor a lo que necesitas.'),
                  H('Dónde podemos encontrarnos'),
                  P('En <b>Espacio Teots · Lugo</b> (Rúa Anduriñas 17, entresuelo, 27004 Lugo), en <b>Teots One · A Coruña</b> (Rúa Pozo 7, bajo, 15005 A Coruña) y <b>online</b>, desde cualquier lugar.')],
         job='Terapia Transpersonal', card='Duelo, pérdida y transiciones vitales. Primer encuentro gratuito de 20 minutos.',
         tel='617873321', tel_txt='617 87 33 21',
         enlaces=[('info.elisabetros@gmail.com', 'mailto:info.elisabetros@gmail.com?subject=Primer%20encuentro%20gratuito'),
                  ('elisabetros.com', 'https://www.elisabetros.com/')],
         instagram='https://www.instagram.com/elisabetros.transpersonal/'),
    dict(slug='mari-alves', nombre='Mari Alves', esp='Masaje Relajante',
         esp_movil='Masaje<br>Relajante', foto='mari-alves.webp', w=893, h=1036,
         fondo='../wp-content/uploads/2025/01/Banner-C.jpg',
         desc='Masaje relajante en Espacio Teots, Lugo: maniobras suaves, rítmicas y progresivas para soltar la tensión y descansar.',
         cita='"Un tiempo para que tu cuerpo descanse y vuelvas a sentirte en casa dentro de ti"',
         bloque1=[H('Masoterapia'),
                  P('Un tiempo para que tu cuerpo descanse. Con maniobras suaves, rítmicas y progresivas te acompaño a soltar la tensión acumulada y a volver a sentirte en casa dentro de ti.'),
                  P('El masaje relajante es una técnica manual orientada al equilibrio físico y mental. Las maniobras siguen el ritmo de tu respiración para que el sistema nervioso y la musculatura puedan aflojar y descansar.'),
                  P('Cada sesión se adapta a cómo llegas ese día: a la presión que te resulta cómoda, a las zonas donde guardas más tensión y al tiempo que necesitas para aterrizar.')],
         bloque2=[H('Un descanso para todo el cuerpo'),
                  P('<b>Calma.</b> Una sensación de sosiego y bienestar general que acompaña durante el resto del día.'),
                  P('<b>Menos tensión.</b> Aflojar la rigidez acumulada por las posturas y la rutina, y ganar ligereza y movilidad.'),
                  P('<b>Descanso.</b> Un estado de relajación profunda que invita a dormir y a descansar mejor.')],
         bloque3=[H('Dónde'),
                  P('Con cita previa en <b>Espacio Teots · Lugo</b> (Rúa Anduriñas 17, entresuelo, 27004 Lugo).'),
                  P('Escríbeme por WhatsApp y buscamos el momento que mejor te venga.'),
                  P('<i>El masaje relajante es una práctica de bienestar y no sustituye la atención médica.</i>')],
         job='Masoterapia', card='Masaje relajante. Espacio Teots · Lugo.',
         tel='611372858', tel_txt='611 37 28 58'),
]

for p in PERFILES:
    out = os.path.join(DOCS, p['slug'], 'index.html')
    open(out, 'w', encoding='utf-8').write(build(p))
    print('ok', out)

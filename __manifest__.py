# __manifest__.py
{
    'name': 'Force Chatter to Bottom',
    'version': '19.0.1.0.0',
    'category': 'Customization/User Interface',
    'summary': 'Mueve siempre el chatter a la parte inferior en todas las vistas.',
    'description': """
        Este módulo fuerza al sistema a mostrar siempre el widget de Chatter 
        (mensajes y notas) en la parte inferior de la vista formulario, 
        incluso en monitores anchos (pantallas XXL).
    """,
    'author': 'Alphaqueb Consulting',
    'depends': ['mail'],
    'assets': {
        'web.assets_backend': [
            'force_chatter_bottom/static/src/css/chatter_position.scss',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'application': False,
}
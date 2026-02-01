{
    'name': 'Force Chatter to Bottom',
    'version': '19.0.1.0.0',
    'category': 'Customization/User Interface',
    'summary': 'Mueve siempre el chatter a la parte inferior en todas las vistas.',
    'author': 'Alphaqueb Consulting',
    'depends': ['web', 'mail'],
    'assets': {
        'web.assets_backend': [
            'force_chatter_bottom/static/src/js/chatter_bottom.js',
            'force_chatter_bottom/static/src/scss/chatter_bottom.scss',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'application': False,
}

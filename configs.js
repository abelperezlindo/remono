// config.js

function getTools() {
  // Realiza operaciones de configuración aquí
  console.log('Get list of avalible tools');
  return {
    'io': {
      'pingpong': {
        'name': 'Ping Pong',
        'description': 'Send a ping and get a pong',
        'route': '/tool/io/pingpong',
        'icon': '/img/ping-pong.svg',
        'config': {
          'timeout': 1000
        }
      },
      'sendmessage': {
        'name': 'Send Message',
        'description': 'Send a message to the server',
        'route': '/tool/io/sendmessage',
        'icon': '/img/sendmessage.svg',
        'config': {
          'timeout': 1000
        }
      },
      'mouse-keyboard': {
        'name': 'Mouse & Keyboard',
        'description': 'Control the mouse and keyboard',
        'route': '/tool/io/mouse-keyboard',
        'icon': '/img/mouse-keyboard.svg',
        'config': {
          'timeout': 1000
        }
      },
      'clipboard': {
        'name': 'Server clipboard',
        'description': 'Get content from the server clipboard',
        'route': '/tool/io/getclipboard',
        'icon': '/img/clipboard.svg',
        'config': {
          'timeout': 1000
        }
      }
    },
    'system': {
      'poweroff': {
        'name': 'Power Off',
        'description': 'Turn off the server',
        'url': '/tool/system/poweroff',
        'icon': '/img/poweroff.svg',
        'config': {
          'in': 1000
        }
      },
      'suspend': {
        'name': 'Suspend',
        'description': 'Suspend the server',
        'url': '/tool/system/suspend',
        'icon': '/img/suspend.svg',
        'config': {
          'in': 1000
        }
      },
      'reboot': {
        'name': 'Reboot',
        'description': 'Reboot the server',
        'url': '/tool/system/reboot',
        'icon': '/img/reboot.svg',
        'config': {
          'in': 1000
        }
      }
    },
    'media': {
      'control': {
        'name': 'Control Multi Media',
        'description': 'Control Multi Media',
        'url': '/tool/media/control',
        'icon': '/img/multimedia.svg',
        'config': {
          'in': 1000
        }
      }
    },
    'screen': {
      'screenshot': {
        'name': 'Screenshot',
        'description': 'Take a screenshot',
        'url': '/tool/screen/screenshot',
        'icon': '/img/screenshot.svg',
        'config': {
          'in': 1000
        }
      },
      'record': {
        'name': 'Record',
        'description': 'Record the screen',
        'url': '/tool/screen/record',
        'icon': '/img/record.svg',
        'config': {
          'in': 1000
        }
      }
    }
  };
}

module.exports = getTools;
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
        'icon': '/img/sendmessage.png',
        'config': {
          'timeout': 1000
        }
      },
      'mouse-keyboard': {
        'name': 'Mouse & Keyboard',
        'description': 'Control the mouse and keyboard',
        'route': '/tool/io/mouse-keyboard',
        'icon': '/img/mouse-keyboard.png',
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
        'icon': '/img/poweroff.png',
        'config': {
          'in': 1000
        }
      },
      'suspend': {
        'name': 'Suspend',
        'description': 'Suspend the server',
        'url': '/tool/system/suspend',
        'icon': '/img/suspend.png',
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
        'icon': '/img/screenshot.png',
        'config': {
          'in': 1000
        }
      },
      'record': {
        'name': 'Record',
        'description': 'Record the screen',
        'url': '/tool/screen/record',
        'icon': '/img/record.png',
        'config': {
          'in': 1000
        }
      }
    }
  };
}

module.exports = getTools;
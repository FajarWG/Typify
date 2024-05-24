
class Keyboard {
    private root: HTMLElement | null;
    private keys: NodeListOf<HTMLElement>;
    private tools: NodeListOf<HTMLElement>;
    private keyTargetClass: string;
    private righthandedSpace: string;
    private leftHalf: string[];
  
    constructor() {
      this.root = document.querySelector('.keyboard-container');
      this.keys = document.querySelectorAll('.keyboard-container .key');
      this.tools = document.querySelectorAll('.keyboard-toolbar .tool');
      this.keyTargetClass = 'key-target';
      this.righthandedSpace = 'righthand';
  
      this.leftHalf = 'q w e r t a s d f g z x c v b'.split(/\s/);
  
      this.bindEvents();
    }
  
    private bindEvents() {
      this.tools.forEach(tool => {
        if (tool.id === 'keyboard-toggle') {
          tool.addEventListener('click', () => {
            if (this.root) {
              this.root.classList.toggle('hidden');
            }
          });
        } else if (tool.id === 'hands-toggle') {
          tool.addEventListener('click', () => {
            if (this.root) {
              this.root.classList.toggle('non-hands');
            }
          });
        } else if (tool.id === 'color-toggle') {
          tool.addEventListener('click', () => {
            if (this.root) {
              this.root.classList.toggle('colorful');
            }
          });
        }
      });
    }
  
    private isUpper(letter: string): boolean {
      return letter === letter.toUpperCase();
    }
  
    private isIn(array: string[], item: string): boolean {
      return array.includes(item);
    }
  
    private handForSpace(pressed: string): string {
      return this.leftHalf.includes(pressed) ? this.righthandedSpace : '';
    }
  
    public highlight(pressed: string, toPress: string): void {
      if (this.keys) {
        this.keys.forEach(key => key.classList.remove(this.keyTargetClass));
  
        if (toPress === 'space') {
          const space = document.querySelector<HTMLElement>('#space');
          if (space) {
              if (space.classList.contains(this.righthandedSpace)) {
                  space.classList.remove(this.righthandedSpace);
              }
              space.classList.add(this.keyTargetClass);
              const handForSpace = this.handForSpace(pressed);
              if (handForSpace) {
                  space.classList.add(handForSpace);
              }
          }
      } else {
          let isUpper = this.isUpper(toPress);
          toPress = toPress.toLowerCase();

          if (toPress === ',' || toPress === '.' || toPress === '/' || toPress === ';' || toPress === '[' || toPress === ']' || toPress === '\\' || toPress === '`' || toPress === "-" || toPress === "=") {
              isUpper = false;
          }
  
          if (isUpper) {
            const side = this.leftHalf.includes(toPress) ? 'r' : 'l'; // r - right hand (l - left)
            const shiftKey = document.querySelector<HTMLElement>(`#shift-${side}`);
            if (shiftKey) {
              shiftKey.classList.add(this.keyTargetClass);
            }
          }

          if(toPress === ';' || toPress === ':') {
            toPress = 'semicolon';
          }

          if(toPress === "'" || toPress === '"') {
            toPress = 'quote';
          }

          if(toPress === '/' || toPress === '?') {
            toPress = 'slash';
          }

          if(toPress === '.' || toPress === '>') {
            toPress = 'period';
          }

          if(toPress === ',' || toPress === '<') {
            toPress = 'comma';
          }

          if(toPress === '[' || toPress === '{') {
            toPress = 'bracketl';
          }

          if(toPress === ']' || toPress === '}') {
            toPress = 'bracketr';
          }

          if(toPress === '\\' || toPress === '|') {
            toPress = 'backslash';
          }

          if(toPress === '`' || toPress === '~') {
            toPress = 'backquote';
          }	

          if(toPress === '-' || toPress === '_') {
            toPress = 'minus';
          }

          if(toPress === '=' || toPress === '+') {
            toPress = 'equal';
          }

  
          const targetKey = document.querySelector<HTMLElement>(`#${toPress}`);
          if (targetKey) {
            targetKey.classList.add(this.keyTargetClass);
          }
        }
      }
    }
  }
  
  export default Keyboard;
  
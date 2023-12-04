export const validate = async (input) => {
  const automaton = new PDA();
  let key = '';

  if (input[0] === '_') {
    key = 'V';
  } else if (input[0] === 'w') {
    key = 'CW';
  } else if (input[0] === 'c') {
    key = 'CY';
  } else if (input[0] === 'f') {
    key = 'FN';
  } else if (input[0] === 'r') {
    key = 'M';
  }

  automaton.pushToStack([key]);

  return automaton.process(input);
}

class PDA {
  constructor() {
    this.stack = ['$'];
  }

  pushToStack(symbols) {
    for (let i = symbols.length - 1; i >= 0; i--) {
      this.stack.push(symbols[i]);
    }
  }

  popFromStack() {
    return this.stack.pop();
  }

  topOfStack() {
    return this.stack[this.stack.length - 1];
  }

  isTerminal(symbol) {
    if (symbol === symbol.toLowerCase() || symbol === ' {') {
      return true;
    }
    return false
  }

  process(input) {
    let pointer = 0;
    input = input.split(" ").join("")

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log(this.stack);
      const stackTop = this.topOfStack();
      const inputSymbol = input[pointer];

      if (stackTop === '$' && inputSymbol === undefined) {
        console.log('Cadena aceptada');
        return {success: true, msg: 'Codigo valido'};
      }
      if (stackTop === ':::') {
        this.popFromStack();
      } else if (stackTop.length > 1 && this.isTerminal(stackTop)) {
        for (let i = 0; i < stackTop.length; i++) {
          if (stackTop[i] === input[pointer]) { /* empty */ } else {
            break;
          }
          this.popFromStack();
          pointer += stackTop.length;
        }
      } else if (stackTop === inputSymbol) {
        this.popFromStack();
        pointer++;
      } else {
        const production = this.getProduction(stackTop, inputSymbol);
        if (production) {
          this.popFromStack();
          this.pushToStack(production);
        } else {
          console.log('Error');
          break;
        }
      }
    }
  }

  getProduction(nonTerminal, terminal) {
    switch (nonTerminal) {
      case 'V':
        return ['GB', 'R0'];
      case 'GB':
        return ['_'];
      case 'CN':
        return ['L', 'RCN'];
      case 'RCN':
        return /[a-z]/.test(terminal) ? ['L', 'RCN'] : [':::'];
      case 'T':
        if (terminal === 'i') {
          return ['X0', 'RI'];
        } else if (terminal === 'f') {
          return ['X1', 'RF'];
        } else if (terminal === 'b') {
          return ['X2', 'RB'];
        } else if (terminal === 's') {
          return ['X3', 'RS'];
        } return null;
      case 'RI':
        return /;/.test(terminal) ? [';'] : ['I', 'R2'];
      case 'RF':
        return /;/.test(terminal) ? [';'] : ['I', 'R4'];
      case 'RB':
        return /;/.test(terminal) ? [';'] : ['I', 'R7'];
      case 'RS':
        return /;/.test(terminal) ? [';'] : ['I', 'R8'];
      case 'L':
        return /[a-z]/.test(terminal) ? [terminal] : null;
      case 'DP':
        return [':'];
      case 'I':
        return ['='];
      case 'CM':
        return ['"'];
      case 'B':
        return terminal === 't' ? ['true'] : ['false'];
      case 'D':
        return /[0-9]/.test(terminal) ? [terminal] : null;
      case 'RD':
        if (/[0-9]/.test(terminal)) {
          return ['D', 'RD'];
        } else {
          this.popFromStack();
          const last = this.topOfStack();
          return [last];
        }
      case 'PC':
        return [';'];
      case 'P':
        return ['.'];
      case 'SID':
        return terminal === '+' ? ['++'] : ['--'];
      case 'PM':
        return ['CN', 'R50']
      case 'CW':
        return ['X4', 'R11'];
      case 'CD':
        if (terminal === 't') {
          return ['true'];
        } else if (terminal === 'f') {
          return ['false'];
        } else if (/[a-z]/.test(terminal)) {
          return ['CN', 'R16'];
        } else if (/[0-9]/.test(terminal)) {
          return ['D', 'R17'];
        } else {
          return null;
        }
      case 'IN':
        return ['instrucciones'];
      case 'OPL':
        if (terminal === '>' || terminal === '<') {
          return [terminal];
        } else if (terminal === '=') {
          return ['=='];
        } else if (terminal === '!') {
          return ['!='];
        } else { return null; }
      case 'CN2':
        return ['L', 'RCN2'];
      case 'RCN2':
        return /[a-z]/.test(terminal) ? ['L', 'RCN2'] : [')'];
      case 'CN3':
        return ['L', 'RCN3'];
      case 'RCN3':
        return /[a-z]/.test(terminal) ? ['L', 'RCN3'] : ['"'];
      case 'CN4':
        return ['L', 'RCN4'];
      case 'RCN4':
        return /[a-z]/.test(terminal) ? ['L', 'RCN4'] : [':::'];
      case 'CY':
        return ['X9', 'R20'];
      case 'WN':
        return ['X11', 'R39'];
      case 'RN':
        return ['X13', 'VRN'];
      case 'VRN':
        if (terminal === 't' || terminal === 'f') {
          return ['B', 'PC'];
        } else if (/[a-z]/.test(terminal)) {
          return ['CN', 'PC'];
        } else if (/[0-9]/.test(terminal)) {
          return ['D', 'PC'];
        } else {
          return null;
        }
      case 'TD':
        if (terminal === 'i') {
          return ['int'];
        } else if (terminal === 'b') {
          return ['boolean'];
        } else if (terminal === 's') {
          return ['string'];
        }
        else if (terminal === 'f') {
          return ['float'];
        }
        return null;
      case 'FN':
        return ['X14', 'R42'];
      case 'M':
        return ['X16', 'R51'];
      case 'X0':
        return ['int'];
      case 'X1':
        return ['float'];
      case 'X2':
        return ['boolean'];
      case 'X3':
        return ['string'];
      case 'X4':
        return ['while'];
      case 'X5':
        return ['('];
      case 'X6':
        return [')'];
      case 'X7':
        return ['{'];
      case 'X8':
        return ['}'];
      case 'X9':
        return ['cycle'];
      case 'X10':
        return ['i'];
      case 'X11':
        return ['when'];
      case 'X12':
        return ['so'];
      case 'X13':
        return ['return'];
      case 'X14':
        return ['fn'];
      case 'X15':
        return [','];
      case 'X16':
        return ['run'];
      case 'R0':
        return ['CN', 'R1'];
      case 'R1':
        return ['DP', 'T'];
      case 'R2':
        return ['D', 'R3'];
      case 'R3':
        return ['RD', 'PC'];
      case 'R4':
        return ['D', 'R5'];
      case 'R5':
        return ['RD', 'R6'];
      case 'R6':
        return ['P', 'R2'];
      case 'R7':
        return ['B', 'PC'];
      case 'R8':
        return ['CM', 'R9'];
      case 'R9':
        return ['CN3', 'PC'];
      case 'R10':
        return ['CM', 'PC'];
      case 'R11':
        return ['X5', 'R12'];
      case 'R12':
        return ['CD', 'R13'];
      case 'R13':
        return ['X6', 'R14'];
      case 'R14':
        return ['X7', 'R15'];
      case 'R15':
        return ['IN', 'X8'];
      case 'R16':
        return ['OPL', 'CN2'];
      case 'R17':
        return ['RD', 'R18'];
      case 'R18':
        return ['OPL', 'R19'];
      case 'R19':
        return ['D', 'RD'];
      case 'R20':
        return ['X5', 'R21'];
      case 'R21':
        return ['X10', 'R22'];
      case 'R22':
        return ['DP', 'R23'];
      case 'R23':
        return ['X0', 'R24'];
      case 'R24':
        return ['I', 'R25'];
      case 'R25':
        return ['D', 'R26'];
      case 'R26':
        return ['PC', 'R27'];
      case 'R27':
        return ['X10', 'R28'];
      case 'R28':
        return ['OPL', 'R29'];
      case 'R29':
        return ['CN4', 'R30'];
      case 'R30':
        return ['PC', 'R31'];
      case 'R31':
        return ['X10', 'R32'];
      case 'R32':
        return ['SID', 'R33'];
      case 'R33':
        return ['X6', 'R34'];
      case 'R34':
        return ['X7', 'R35'];
      case 'R35':
        return ['IN', 'X8'];
      case 'R36':
        return ['X5', 'R37'];
      case 'R37':
        return ['CN', 'R38'];
      case 'R38':
        return ['R17', 'R39'];
      case 'R39':
        return ['X5', 'R40'];
      case 'R40':
        return ['CN', 'R53'];
      case 'R53':
        return ['R17', 'R41'];
      case 'R41':
        return ['X6', 'R54'];
      case 'R54':
        return ['X7', 'R55'];
      case 'R55':
        return ['R15', 'R56'];
      case 'R56':
        return ['X12', 'R57'];
      case 'R57':
        return ['X7', 'R15'];
      case 'R42':
        return ['CN', 'R43'];
      case 'R43':
        return ['X5', 'R44'];
      case 'R44':
        return ['PM', 'R45'];
      case 'R45':
        return ['X6', 'R46'];
      case 'R46':
        return ['TD', 'R47'];
      case 'R47':
        return ['X7', 'R48'];
      case 'R48':
        return ['IN', 'R49'];
      case 'R49':
        return ['RN', 'X8'];
      case 'R50':
        return ['DP', 'TD'];
      case 'R51':
        return ['X5', 'R52'];
      case 'R52':
        return ['X6', 'R59'];
      case 'R58':
        return ['X5', 'R52'];
      case 'R59':
        return ['X7', 'R15'];
      default:
        return null;
    }
  }
}

// Ejemplo de uso
// const automaton = new PDA();
// let inputString = 'while (true) {instrucciones}';

// automaton.pushToStack(['CW']);

// automaton.process(inputString);

// inputString = '_nombre : string = "juan";';

// automaton.pushToStack(['V']);

// automaton.process(inputString);

// inputString = 'cycle (i: int = 0;i > n; i++) {instrucciones}';

// automaton.pushToStack(['CY']);

// automaton.process(inputString);

// inputString = 'when (numbereven > 2) {instrucciones} so {instrucciones}';

// automaton.pushToStack(['WN']);

// automaton.process(inputString);

// inputString = 'return true;';

// automaton.pushToStack(['RN']);

// automaton.process(inputString);

// inputString = 'fn increment (number: int) boolean { instrucciones return true;}';

// automaton.pushToStack(['FN']);

// automaton.process(inputString);

// inputString = 'fn increment (number: int) boolean { instrucciones return true;}';

// automaton.pushToStack(['FN']);

// automaton.process(inputString);

// inputString = 'run () {instrucciones}';

// automaton.pushToStack(['M']);

// automaton.process(inputString);

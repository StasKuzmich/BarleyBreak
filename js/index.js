const MVP = (function () {
  const view = {
    showWinMes() {
      document.querySelector('#massage-box span').innerText = 'You`re WIN!';
    },
  };

  const model = {
    aCurrentGameModel: [],
    createWinCombination(iSize) {
      const iRowCount = Math.pow(iSize, 2);
      let i = 0;
      const aWinCombination = [];
      for (i; i < iRowCount - 1; i++) {
        aWinCombination.push(i + 1);
      }
      return aWinCombination;
    },
    setNullPosition(aStartingCombination, iNullPos) {
      this.iNullPos = aStartingCombination !== null ? aStartingCombination.indexOf(null) : iNullPos;
    },
    getNullPos() {
      return this.iNullPos;
    },
    getCurrentGameModel() {
      return this.aCurrentGameModel;
    },
    getDraggableElements() {
        /*
          return i+1
          model for building of the algoritm:
          size = x^2
          0*x+1 0*x+2 ... 1*x
          1*x+1 1*x+2 ... 2*x
          2*x+1 2*x+2 ... 3*x
          ...    ...  ... ...
          n*x+1 n*x+2 ... n*x
        */
      const ms = this.getCurrentGameModel().length;
      const rs = Math.sqrt(ms);
      const np = this.iNullPos + 1;
      const a = np / rs;
      const b = (np - 1) / rs;
      const c = np / rs ^ 0;
      const d = np - c * rs;
      if (!!(np % rs) && b !== (b ^ 0) && c !== 0 && c !== rs - 1) {
        return [c * rs + d - 1, c * rs + d + 1, (c - 1) * rs + d, (c + 1) * rs + d];
      }
      if (!(np % rs)) {
        if (a !== 1 && a !== rs) {
          return [(a - 1) * rs, (a + 1) * rs, a * rs - 1];
        } else if (a === 1) {
          return [(a + 1) * rs, a * rs - 1];
        }
        return [(a - 1) * rs, a * rs - 1];
      } else if (b === (b ^ 0)) {
        if (b !== 0 && b !== rs - 1) {
          return [(b - 1) * rs + 1, (b + 1) * rs + 1, b * rs + 2];
        } else if (b === 0) {
          return [(b + 1) * rs + 1, b * rs + 2];
        }
        return [(b - 1) * rs + 1, b * rs + 2];
      } else if (c === 0) {
        return [np - 1, np + 1, np + rs];
      } else if (c === rs - 1) {
        return [c * rs + d - 1, c * rs + d + 1, (c - 1) * rs + d];
      }
      return [];
    },
    createStartingCombination(iSize) {
      const aWinCombination = this.createWinCombination(iSize);
      aWinCombination.push(null);
      const aStartingCombination = aWinCombination.sort(() => Math.random() - 0.5);
      this.setNullPosition(aStartingCombination);
      this.aCurrentGameModel = aStartingCombination;
      return aStartingCombination;
    },
    checkWin(aCurrentCombination) {
      let iSkipNullPos = 0;
      const bWin = aCurrentCombination.every((el, i) => {
        if (el !== null) {
          return el + iSkipNullPos === i + 1;
        }
        iSkipNullPos++;
        return true;
      });
      return bWin;
    },
  };


  const presenter = {
    bGameStart: false,
    iSize: 2,
    startClick() {
      const that = this;
      let aStartingCombination;
      if (!that.bGameStart) {
        that.bGameStart = true;
        aStartingCombination = model.createStartingCombination(that.iSize);
        that.createField(aStartingCombination);
      } else {
        aStartingCombination = model.createStartingCombination(that.iSize);
        that.createField(aStartingCombination);
      }
    },
    setFieldRange() {
      const that = this;
      const fieldForSize = document.getElementById('field-size');
      fieldForSize.innerText = that.iSize;
    },
    rangeChange(sValue) {
      const that = this;
      that.iSize = +sValue;
      that.setFieldRange();
    },
    createField(aStartingCombination) {
      if (this.isFieldFill()) {
        this.removeField();
      }
      this.renderField(aStartingCombination);
    },
    isFieldFill() {
      if (!document.getElementById('field').children.length) {
        return false;
      }
      return true;
    },
    removeField() {
      document.querySelector('#field > div').remove();
    },
    renderField(aCombination) {
      const field = document.getElementById('field');
      const gameField = document.createElement('div');
      let i = 0;
      let newRow;
      let newCell;
      let rowLength;
      let j;
      for (i; i < this.iSize; i++) {
        newRow = document.createElement('div');
        j = i * this.iSize;
        rowLength = j + this.iSize;
        for (j; j < rowLength; j++) {
          newCell = document.createElement('div');
          newCell.innerHTML = aCombination[j];
          newRow.appendChild(newCell);
        }
        gameField.appendChild(newRow);
      }
      if (field.innerHTML) {
        this.removeField();
      }
      field.appendChild(gameField);
    },
    cellClick(el) {
      const that = this;
      const aDrugguble = model.getDraggableElements();
      const aCurrentGameModel = model.getCurrentGameModel();
      const iCurrentNullPos = model.getNullPos();
      const iTargetValue = +el.innerText;
      const iTargetIndex = aCurrentGameModel.indexOf(iTargetValue);
      const iDraggable = aDrugguble.indexOf(iTargetIndex + 1);
      let bWin;
      if (iDraggable !== -1) {
        aCurrentGameModel.splice(iCurrentNullPos, 1, iTargetValue);
        aCurrentGameModel.splice(iTargetIndex, 1, null);
        model.setNullPosition(null, iTargetIndex);
        that.renderField(aCurrentGameModel);
        bWin = model.checkWin(aCurrentGameModel);
        if (bWin) {
          view.showWinMes();
        }
      }
    },
  };
  return presenter;
}());

const start = (function () {
  const event = function () {
    const startButton = document.getElementById('start');
    const rangeInput = document.getElementById('size');
    const gameField = document.getElementById('field');
    startButton.addEventListener('click', (event) => {
      MVP.startClick();
      return false;
    });
    rangeInput.addEventListener('input', (el) => {
      MVP.rangeChange(el.target.value);
      return false;
    });
    gameField.addEventListener('click', (el) => {
      MVP.cellClick(el.target);
      return false;
    });
  };
  return {
    init() {
      event();
      MVP.setFieldRange();
    },
  };
}());

start.init();

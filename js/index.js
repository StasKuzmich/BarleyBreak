(function () {
  function View() {

  }

  View.prototype.showWinMes = function () {
    document.querySelector('#massage-box span').innerText = 'You`re WIN!';
  };

  const view = new View();

  function Model() {
    this.aCurrentGameModel = [];
  }

  Model.prototype.createWinCombination = function (iSize) {
    const iRowCount = Math.pow(iSize, 2);
    let i = 0;
    const aWinCombination = [];
    for (i; i < iRowCount - 1; i++) {
      aWinCombination.push(i + 1);
    }
    return aWinCombination;
  };

  Model.prototype.setNullPosition = function (aStartingCombination, iNullPos) {
      this.iNullPos = aStartingCombination !== null ? aStartingCombination.indexOf(null) : iNullPos;
  };

  Model.prototype.getNullPos = function () {
    return this.iNullPos;
  };

  Model.prototype.getCurrentGameModel = function () {
    return this.aCurrentGameModel;
  };

  Model.prototype.getDraggableElements = function () {
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
  };

  Model.prototype.createStartingCombination = function (iSize) {
    const aWinCombination = this.createWinCombination(iSize);
    aWinCombination.push(null);
    const aStartingCombination = aWinCombination.sort(() => Math.random() - 0.5);
    this.setNullPosition(aStartingCombination);
    this.aCurrentGameModel = aStartingCombination;
    return aStartingCombination;
  };

  Model.prototype.checkWin = function (aCurrentCombination) {
    let iSkipNullPos = 0;
    const bWin = aCurrentCombination.every((el, i) => {
      if (el !== null) {
        return el + iSkipNullPos === i + 1;
      }
      iSkipNullPos++;
      return true;
    });
    return bWin;
  };

  const model = new Model();

  function Presenter() {
    this.bGameStart = false;
    this.iSize = 2;
  }

  Presenter.prototype.startClick = function () {
    let aStartingCombination;
    if (!this.bGameStart) {
      this.bGameStart = true;
      aStartingCombination = model.createStartingCombination(this.iSize);
      this.createField(aStartingCombination);
    } else {
      aStartingCombination = model.createStartingCombination(this.iSize);
      this.createField(aStartingCombination);
    }
  };

  Presenter.prototype.setFieldRange = function () {
    const fieldForSize = document.getElementById('field-size');
    fieldForSize.innerText = this.iSize;
  };

  Presenter.prototype.rangeChange = function (sValue) {
    this.iSize = +sValue;
    this.setFieldRange();
  };

  Presenter.prototype.createField = function (aStartingCombination) {
    if (this.isFieldFill()) {
      this.removeField();
    }
    this.renderField(aStartingCombination);
  };

  Presenter.prototype.isFieldFill = function () {
    if (!document.getElementById('field').children.length) {
      return false;
    }
    return true;
  };

  Presenter.prototype.removeField = function () {
    document.querySelector('#field > div').remove();
  };

  Presenter.prototype.renderField = function (aCombination) {
    const field = document.getElementById('field');
    const gameField = document.createElement('div');
    let i = 0;
    let newRow = document.createElement('div');;
    let newCell = document.createElement('div');;
    let rowLength;
    let j;
    for (i; i < this.iSize; i++) {
      j = i * this.iSize;
      rowLength = j + this.iSize;
      for (j; j < rowLength; j++) {
        newCell.innerHTML = aCombination[j];
        newRow.appendChild(newCell);
      }
      gameField.appendChild(newRow);
    }
    if (field.innerHTML) {
      this.removeField();
    }
    field.appendChild(gameField);
  };

  Presenter.prototype.cellClick = function (el) {
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
      this.renderField(aCurrentGameModel);
      bWin = model.checkWin(aCurrentGameModel);
      if (bWin) {
        view.showWinMes();
      }
    }
  };

  const presenter = new Presenter();

  function Start() {
  }

  Start.prototype.init = function () {
    this.event();
    presenter.setFieldRange();
  };

  Start.prototype.event = function () {
    const startButton = document.getElementById('start');
    const rangeInput = document.getElementById('size');
    const gameField = document.getElementById('field');
    startButton.addEventListener('click', () => {
      event.preventDefault();
      presenter.startClick();
    });
    rangeInput.addEventListener('input', (el) => {
      presenter.rangeChange(el.target.value);
    });
    gameField.addEventListener('click', (el) => {
      event.preventDefault();
      presenter.cellClick(el.target);
    });
  };

  const start = new Start();

  start.init();
}());

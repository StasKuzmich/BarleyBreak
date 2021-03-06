const MVP = (function () {
  const view = {
    showWinMes() {
      document.querySelector('#massage-box span').innerText = 'You`re WIN!';
    },
    showPlayerList(aPlayersList) {
      let sPlayersList = "";
      aPlayersList.forEach( (el) => sPlayersList = sPlayersList + '<div>' + el + '</div>');
      document.querySelector('#players-box').innerHTML = sPlayersList;
    },
  };

  const model = {
    iCounter: 0,
    sPlayerName: "",
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
    setDataToStorage(sPlayerName, count) {
      const key = 'barleyBreakPlayers';
      let playersData = JSON.parse(localStorage.getItem(key));
      if (!playersData) {
        playersData = {}
      }
      playersData[sPlayerName] = count;
      localStorage.setItem(key, JSON.stringify(playersData));
      return true;
    },
    getPlayersList() {
      let aPlayersList = [];
      const key = 'barleyBreakPlayers';
      const oPlayersList = JSON.parse(localStorage.getItem(key));
      for ( let playerName in oPlayersList) {
        aPlayersList.push(`${playerName} ${oPlayersList[playerName]}`);
      }
      return aPlayersList;
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
          model for building of the algorithm:
          size = x^2
          0*x+1 0*x+2 ... 1*x
          1*x+1 1*x+2 ... 2*x
          2*x+1 2*x+2 ... 3*x
          ...    ...  ... ...
          n*x+1 n*x+2 ... n*x
        */
      const modelSize = this.getCurrentGameModel().length;
      const squareSize = Math.sqrt(modelSize);
      const nullPos = this.iNullPos + 1;
      const rowNullPos = nullPos / squareSize;
      const indexOfRowNullPos = (nullPos - 1) / squareSize;
      const intRowNullPos = rowNullPos ^ 0;
      const posOffset = nullPos - intRowNullPos * squareSize;
      if (!!(nullPos % squareSize) && indexOfRowNullPos !== (indexOfRowNullPos ^ 0) && intRowNullPos !== 0 && intRowNullPos !== squareSize - 1) {
        return [intRowNullPos * squareSize + posOffset - 1, intRowNullPos * squareSize + posOffset + 1, (intRowNullPos - 1) * squareSize + posOffset, (intRowNullPos + 1) * squareSize + posOffset];
      }
      if (!(nullPos % squareSize)) {
        if (rowNullPos !== 1 && rowNullPos !== squareSize) {
          return [(rowNullPos - 1) * squareSize, (rowNullPos + 1) * squareSize, rowNullPos * squareSize - 1];
        } else if (rowNullPos === 1) {
          return [(rowNullPos + 1) * squareSize, rowNullPos * squareSize - 1];
        }
        return [(rowNullPos - 1) * squareSize, rowNullPos * squareSize - 1];
      } else if (indexOfRowNullPos === (indexOfRowNullPos ^ 0)) {
        if (indexOfRowNullPos !== 0 && indexOfRowNullPos !== squareSize - 1) {
          return [(indexOfRowNullPos - 1) * squareSize + 1, (indexOfRowNullPos + 1) * squareSize + 1, indexOfRowNullPos * squareSize + 2];
        } else if (indexOfRowNullPos === 0) {
          return [(indexOfRowNullPos + 1) * squareSize + 1, indexOfRowNullPos * squareSize + 2];
        }
        return [(indexOfRowNullPos - 1) * squareSize + 1, indexOfRowNullPos * squareSize + 2];
      } else if (intRowNullPos === 0) {
        return [nullPos - 1, nullPos + 1, nullPos + squareSize];
      } else if (intRowNullPos === squareSize - 1) {
        return [intRowNullPos * squareSize + posOffset - 1, intRowNullPos * squareSize + posOffset + 1, (intRowNullPos - 1) * squareSize + posOffset];
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
        model.iCounter = 0;
        aStartingCombination = model.createStartingCombination(that.iSize);
        that.createField(aStartingCombination);
      }
    },
    setFieldRange() {
      const that = this;
      const fieldForSize = document.getElementById('field-size');
      fieldForSize.innerText = that.iSize;
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
      const playerNameInput = document.getElementById('playerName').value;
      const aDrugguble = model.getDraggableElements();
      const aCurrentGameModel = model.getCurrentGameModel();
      const iCurrentNullPos = model.getNullPos();
      const iTargetValue = +el.innerText;
      const iTargetIndex = aCurrentGameModel.indexOf(iTargetValue);
      const iDraggable = aDrugguble.indexOf(iTargetIndex + 1);
      let bWin;
      if (iDraggable !== -1 && that.bGameStart) {
        aCurrentGameModel.splice(iCurrentNullPos, 1, iTargetValue);
        aCurrentGameModel.splice(iTargetIndex, 1, null);
        model.setNullPosition(null, iTargetIndex);
        that.renderField(aCurrentGameModel);
        bWin = model.checkWin(aCurrentGameModel);
        model.iCounter++;
        if (bWin) {
          playerNameInput ? model.setDataToStorage(playerNameInput, model.iCounter) : 0;
          view.showWinMes();
          view.showPlayerList(model.getPlayersList());
          that.bGameStart = false;
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

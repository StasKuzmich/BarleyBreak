(function () {
  var start = new Start();
  var view = new View();
  var model = new Model();
  var presenter = new Presenter();

  function View() {

  }

  View.prototype.showWinMes = function () {
    document.querySelector("#massage-box span").innerText = "You`re WIN!";
  };

  function Model () {
    this.aCurrentGameModel = [];
    this.iNullPos;
  };

  Model.prototype.createWinCombination = function(iSize) {
    var iRowCount = Math.pow(iSize, 2);
    var i = 0;
    var aWinCombination = [];
    for (i; i < iRowCount - 1; i++) {
      aWinCombination.push(i + 1);
    }
    return aWinCombination;
  };

  Model.prototype.setNullPosition = function (aStartingCombination, iNullPos) {
    if (aStartingCombination !== null) {
        this.iNullPos = aStartingCombination.indexOf(null);
    } else {
      this.iNullPos = iNullPos;
    }

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
    var ms = this.getCurrentGameModel().length
    var rs = Math.sqrt(ms);
    var np = this.iNullPos + 1;
    var a = np/rs;
    var b = (np-1)/rs;
    var c = np/rs^0;
    var d = np - c*rs;
    if (!!(np%rs) && b !== (b^0) && c !== 0 && c !== rs - 1) {
        return [c*rs + d - 1, c*rs + d + 1, (c - 1)*rs + d, (c + 1)*rs + d];
    } else {
      if (!(np%rs)) {
        if (a !== 1 && a !== rs) {
            return [(a-1)*rs, (a+1)*rs, a*rs - 1];
        } else if (a === 1) {
            return [(a+1)*rs, a*rs - 1];
        } else {
            return [(a-1)*rs, a*rs - 1];
        }
      } else if (b === (b^0)) {
        if (b !== 0 && b !== rs - 1) {
            return [(b - 1)*rs + 1, (b + 1)*rs + 1, b*rs + 2];
        } else if (b === 0) {
            return [(b + 1)*rs + 1, b*rs + 2];
        } else {
            return [(b - 1)*rs + 1, b*rs + 2];
        }
      } else if (c === 0) {
          return [np - 1, np + 1, np + rs];
      } else if (c === rs - 1) {
          return [c*rs + d - 1, c*rs + d + 1, (c - 1)*rs + d];
      }
    }
  };

  Model.prototype.createStartingCombination = function(iSize) {
      var aWinCombination = this.createWinCombination(iSize);
      var aStartingCombination;
      aWinCombination.push(null);
      aStartingCombination = aWinCombination.sort(function (a, b) {
        return Math.random() - 0.5;
      });
      this.setNullPosition(aStartingCombination);
      this.aCurrentGameModel = aStartingCombination;
      return aStartingCombination;
  };

  Model.prototype.checkWin = function (aCurrentCombination) {
    var iSkipNullPos = 0;
    var bWin = aCurrentCombination.every(function (el, i) {
      if (el !== null) {
        return el + iSkipNullPos === i+1;
      }
      iSkipNullPos++;
      return true;
    });
    return bWin;
  };

  function Presenter () {
    this.bGameStart = false;
    this.iSize = 2;
  }

  Presenter.prototype.startClick = function () {
    var aStartingCombination;
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
    var fieldForSize = document.getElementById("field-size");
    fieldForSize.innerText = this.iSize;
  };

  Presenter.prototype.rangeChange = function (sValue) {
    this.iSize = +sValue;
    this.setFieldRange();
  };

  Presenter.prototype.createField = function(aStartingCombination) {
    if (this.getField()) {
        this.removeField();
    };
    this.renderField(aStartingCombination);
  };

  Presenter.prototype.getField = function() {
    if (!document.getElementById("field").children.length) {
      return false;
    } else {
      return true;
    };
  };

  Presenter.prototype.removeField = function() {
    document.querySelector("#field > div").remove();
  };

  Presenter.prototype.renderField = function(aCombination) {
    var field = document.getElementById("field");
    var gameField = document.createElement("div");
    var i = 0;
    var newDiv, rowLength, j;
    for (i; i < this.iSize; i++) {
      newRow = document.createElement("div");
      j = i * this.iSize;
      rowLength = j + this.iSize;
      for (j; j < rowLength; j++) {
        newCell = document.createElement("div");
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
    var aDrugguble = model.getDraggableElements();
    var aCurrentGameModel = model.getCurrentGameModel();
    var iCurrentNullPos = model.getNullPos();
    var iTargetValue = +el.innerText;
    var iTargetIndex = aCurrentGameModel.indexOf(iTargetValue);
    var iDraggable = aDrugguble.indexOf(iTargetIndex + 1);
    var bWin;
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

  function Start() {
  }

  Start.prototype.init = function () {
    this.event();
    presenter.setFieldRange();
  };

  Start.prototype.event = function () {
    var startButton = document.getElementById('start');
    var rangeInput = document.getElementById('size');
    var gameField = document.getElementById('field');
    startButton.addEventListener('click', function () {
    	event.preventDefault();
      presenter.startClick();
    });
    rangeInput.addEventListener('input', function (el) {
      presenter.rangeChange(el.target.value);
    });
    gameField.addEventListener('click', function (el) {
    	event.preventDefault();
      presenter.cellClick(el.target);
    });
  };

  start.init();
})();

function Grid (el, callback) {
  return this.init(el, callback);
}

Grid.prototype = {
  init: function (el, callback) {
    this._root = el;
    this._callback = callback;
    return this._render();
  },

  setCurrentCell: function (cell) {
    this._currentCell = cell;
  },

  markCells: function () {
    [].forEach.call(this._cellsElements, function(el) {
      var cell = {
        col: parseInt(el.dataset.col, 10),
        row: parseInt(el.dataset.row, 10)
      };
      var active = this._currentCell &&
                   cell.row <= this._currentCell.row  &&
                   cell.col <= this._currentCell.col;
      if (active === true) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }.bind(this));
  },

  _generateCells: function () {
    this._cells = [];

    for (var i = 0; i < 100; i++) {
      var col = i % 10;
      var row = Math.floor(i/10);

      this._cells.push({
        col: col,
        row: row,
        active: false
      });
    }
  },

  _html: function () {
    var html = '<div class="medium-editor-table-builder-grid clearfix">';
    html += this._cellsHTML();
    html += '</div>';
    return html;
  },

  _cellsHTML: function () {
    var html = '';
    this._generateCells();
    this._cells.map(function(cell) {
      html += '<a href="#" class="medium-editor-table-builder-cell' +
              (cell.active === true ? ' active' : '') +
              '" ' + 'data-row="' + cell.row +
              '" data-col="' + cell.col + '">';
      html += '</a>';
    });
    return html;
  },

  _render: function () {
    this._root.innerHTML = this._html();
    this._cellsElements = this._root.querySelectorAll('a');
    this._bindEvents();
  },

  _bindEvents: function () {
    [].forEach.call(this._cellsElements, function(el) {
      this._onMouseEnter(el);
      this._onClick(el);
    }.bind(this));
  },

  _onMouseEnter: function (el) {
    var self = this;
    var timer;

    el.addEventListener('mouseenter', function () {
      clearTimeout(timer);

      var dataset = this.dataset;

      timer = setTimeout(function () {
        self._currentCell = {
          col: parseInt(dataset.col, 10),
          row: parseInt(dataset.row, 10)
        };
        self.markCells();
      }, 10);
    });
  },

  _onClick: function (el) {
    var self = this;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      self._callback(this.dataset.row, this.dataset.col);
    });
  }
};

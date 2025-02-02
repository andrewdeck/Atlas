
let initialData = [];
for(let i =0;i<33;i++) {
  initialData[i] = [];
  for(let j = 0; j<33; j++) {
    initialData[i][j] = 0;
  }
}


const app = new Vue({
  el: "#app",
  data: {
    hover: {},
    selected: {},
    nextMapId: 1,
    completed: 0,
    cells: initialData    
  },
  methods: {
    updateCell: function(x, y) {
      this.cells[y][x] = this.nextMapId;
      this.nextMapId++;
      this.selected = {x,y};
      this.updateCompleted();
      fetch('/data', {
        method: 'PUT',
        body: JSON.stringify(this.cells),
        headers: {
          'Content-Type': 'application/json',
        }
      })
    },
    setHover: function(x,y) {
      this.hover = {x,y};
    },
    handleArrows: function(event) {
      let {x,y} = this.selected;
      if(x === undefined || y === undefined) return;
      if(event.keyCode === 37){ // LEFT
        if(x > 0) x--;
      } else if(event.keyCode === 38){ // UP
        if(y > 0) y--;
      } else if(event.keyCode === 39){ // RIGHT
        if(x < 32) x++;
      } else if(event.keyCode === 40){ // DOWN
        if(y < 32) y++;
      }
      if(this.selected.x !== x || this.selected.y !== y) {
        this.selected = {x,y};
        this.updateCell(x,y);
      }
    },
    updateCompleted: function() {
      const total = this.cells.map( row => row.length ).reduce( (a, b) => a + b, 0);
      const completed = this.cells.flat().reduce( (c, t) => c > 0 ? t++ : t, 0);
      this.completed = completed * 100/total;
    }
  },
  mounted() {
    fetch('/data')
    .then( res => {
      return res.json()
    }).then( result => {
      this.cells = result;
      this.nextMapId = (Math.max(...result.map( x => Math.max(...x)))) + 1;
      this.updateCompleted();
    })
    this._keyListener = function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
        this.handleArrows(e);
      }
    }
    document.addEventListener('keyup', this._keyListener.bind(this));
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this._keyListener);
  }
});
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/data', (req, res) => {
  fs.readFile('map.data', 'utf8', (err, data) => {
    let tempRows = data.split('\n');
    final = [];
    tempRows.forEach((row, index) => {
      let cells = row.split(',').map(Number);
      final[index] = cells;
    });
    res.json(final);
  })
});

app.put('/data', (req, res) => {
  let data = req.body;
  let output = data.map( row => row.join(',')).join('\n');
  fs.writeFile('map.data', output, err => {
    if(err) {
      res.status(500).send();
      console.error(err);
    } else res.status(200).send(); 
  });
});


app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});
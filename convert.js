const csvToJson = require('convert-csv-to-json');
 
const input = './eruptions_left_outer.csv'; 
const output = './public/volcanoEruptions.json';
 
csvToJson.fieldDelimiter('#')
         .formatValueByType()
         .generateJsonFileFromCsv(input, output);
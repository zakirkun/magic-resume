require('dotenv').config();
const Typesense = require('typesense');
const fs = require('fs');
const csv = require('csv-parser');

const client = new Typesense.Client({
  'nodes': [{
    'host': process.env.TYPESENSE_HOST, // For Typesense Cloud use xxx.a1.typesense.net
    'port': process.env.TYPESENSE_PORT,      // For Typesense Cloud use 443
    'protocol': 'http'   // For Typesense Cloud use https
  }],
  'apiKey': process.env.TYPESENSE_KEY,
  'connectionTimeoutSeconds': 3
});



// Read the CSV file and import data
const records = [];
fs.createReadStream('./Online_Courses.csv')
  .pipe(csv())
  .on('data', (data) => {

    let obj = {
      skill: data.Skills.split(", "),
      description: data['Short Intro'],
      title: data.Title,
      url: data.URL,
      level: data.Level
    }

    // Push the processed data into the records array
    records.push(obj);
  })
  .on('end', () => {

    client.collections(process.env.COLLECTION_COURSE_NAME).documents().import(records)
      .then(() => {
        console.log('Data imported successfully!');
      })
      .catch((error) => {
        console.error('Error importing data:', error);
      });
});
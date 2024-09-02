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

const collectionSchema = {
  name: process.env.COLLECTION_COURSE_NAME,
  fields: [
      { name: 'skill', type: 'string[]', 'facet': true }, // Array of strings
      { name: 'description', type: 'string' }, // Array of strings
      { name: 'title', type: 'string' },
      { name: 'url', type: 'string' },
      { name: 'level', type: 'string' },
  ]
};

// Create the collection in Typesense
client.collections().create(collectionSchema).then(() => {
    console.log('Collection JobStreet created successfully!');
  }).catch((error) => {
    console.error('Error creating JobStreet collection:', error);
});

// Read the CSV file and import data
const records = [];
fs.createReadStream('./udemy_courses.csv')
  .pipe(csv())
  .on('data', (data) => {

    let obj = {
      skill: [data.subject],
      description: "",
      title: data.course_title,
      url: data.url,
      level: data.level
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
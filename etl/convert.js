const Typesense = require('typesense');
const fs = require('fs');
const csv = require('csv-parser');

// Initialize the Typesense client
const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'localhost', // Replace with your Typesense host
      port: '8108', // Replace with your Typesense port
      protocol: 'http'
    }
  ],
  apiKey: 'magic1337', // Replace with your Typesense API key
  connectionTimeoutSeconds: 2
});

// Define the schema for the Typesense collection
const collectionSchema = {
  name: 'etl_jobsreet',
  fields: [
    { name: 'categoriesCode', type: 'string[]' }, // Array of strings
    { name: 'categoriesName', type: 'string[]' }, // Array of strings
    { name: 'companyName', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'jobTitle', type: 'string' },
    { name: 'jobUrl', type: 'string' },
    { name: 'locations', type: 'string' }, // Array of strings
  ]
};

// Create the collection in Typesense
typesense.collections().create(collectionSchema).then(() => {
    console.log('Collection created successfully!');
    
    }).catch((error) => {
    console.error('Error creating collection:', error);
});

// Read the CSV file and import data
const records = [];
fs.createReadStream('./jobstreet_2022-08-31.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Split the categoriesCode and categoriesName fields into arrays
    data.categoriesCode = data.categoriesCode.split(',');
    data.categoriesName = data.categoriesName.split(',');
    // data.locations = data.locations.split('/');

    // Push the processed data into the records array
    records.push(data);
  })
  .on('end', () => {
    typesense.collections('etl_jobsreet').documents().import(records)
      .then(() => {
        console.log('Data imported successfully!');
      })
      .catch((error) => {
        console.error('Error importing data:', error);
      });
  });
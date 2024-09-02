require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`APP RUNNING ON PORT ${PORT}`);
})

// let client = new Typesense.Client({
//   'nodes': [{
//     'host': 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
//     'port': 8108,      // For Typesense Cloud use 443
//     'protocol': 'http'   // For Typesense Cloud use https
//   }],
//   'apiKey': 'magic1337',
//   'connectionTimeoutSeconds': 2
// });

// const searchQuery = {
//     q: 'IT', // Empty or use '*' for wildcard search
//     query_by: 'jobTitle,description,companyName,categoriesName', // Specify fields to search text within
// };

// client.collections('etl_jobsreet')
//     .documents()
//     .search(searchQuery)
//     .then(function (searchResults) {
//       console.log(searchResults.hits)
// });
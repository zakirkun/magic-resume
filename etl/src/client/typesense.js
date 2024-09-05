const Typesense = require('typesense');

const client = new Typesense.Client({
  'nodes': [{
    'host': process.env.TYPESENSE_HOST, // For Typesense Cloud use xxx.a1.typesense.net
    'port': process.env.TYPESENSE_PORT,      // For Typesense Cloud use 443
    'protocol': 'http'   // For Typesense Cloud use https
  }],
  'apiKey': process.env.TYPESENSE_KEY,
  'connectionTimeoutSeconds': 3
});

const isJobsSchemaExists = await client
  .collections(process.env.COLLECTION_JOB_NAME)
  .exists();

const isCourseSchemaExists = await client
.collections(process.env.COLLECTION_JOB_NAME)
.exists();


if(!isJobsSchemaExists) {
    const collectionSchema = {
        name: process.env.COLLECTION_JOB_NAME,
        fields: [
            { name: 'skill', type: 'string[]', 'facet': true }, // Array of strings
            { name: 'description', type: 'string[]' }, // Array of strings
            { name: 'job_name', type: 'string' },
            { name: 'url', type: 'string' },
        ]
    };

    // Create the collection in Typesense
    client.collections().create(collectionSchema).then(() => {
        console.log('Collection JobStreet created successfully!');
        }).catch((error) => {
        console.error('Error creating JobStreet collection:', error);
    });

}

if(!isCourseSchemaExists) {
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

}

module.exports = {
    client
};

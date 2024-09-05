const fs = require('fs');

const filePath = './jobstreet.json';

const header = "adType,categoriesCode,categoriesName,companyId,companyName,companyPrivate,description,employment,id,isClassified,isStandout,jobTitle,jobUrl,locations,postingDuration,postedAt,salarycurrency,salaryMin,salaryMax,salaryPeriod,salaryTerm,sellingPoints"

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let result = [];

    try {
        // Parse the JSON string into a JavaScript object
        const jsonData = JSON.parse(data);

        const keys = header.split(',');

        // console.log(keys);

        // If you want to manipulate the arrays, you can do so here
        jsonData.map((k, v) => {
            let jobs = k[header].split(",")

            // Step 2: Create an object by mapping keys to the corresponding values in dataArray
            const jobObject = keys.reduce((obj, key, index) => {
                obj[key] = jobs[index] || ''; // Use empty string if dataArray[index] is undefined
                return obj;
            }, {});

            // result.push(jobObject)
            console.log(jobObject);
        })

    } catch (err) {
        console.error('Error parsing JSON:', err);
    }

    const jsonStr = JSON.stringify(result);
    // Step 3: Write the JSON string to a file
    fs.writeFile('clean-job-street.json', jsonStr, (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
});
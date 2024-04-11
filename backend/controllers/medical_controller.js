const {Storage} = require("@google-cloud/storage");
const {BigQuery} = require("@google-cloud/bigquery");
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILE_NAME
});
const bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILE_NAME
});

const bucketName = process.env.BUCKET_NAME;
const datasetId = process.env.DATASET_ID;
const filename = process.env.FILENAME;
const tableId = process.env.TABLE_ID;


const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        const filePath = req.file.path;
        
        const isFileAlreadyUploaded = await storage.bucket(bucketName).file(filename).exists();
        
        if (isFileAlreadyUploaded[0]) {
            fs.unlinkSync(filePath);
            return res.status(409).send("File is already uploaded");
        }

        let columns_to_delete = ["Date of Admission", "Room Number", "Discharge Date", "Hospital"];
        let rows = [];

        const parser = fs.createReadStream(filePath).pipe(csv.parse({ headers: true }));
        
        parser.on("data", (row) => {
            columns_to_delete.forEach((col) => {
                delete row[col];
            });
            rows.push(row);
        });

        parser.on("end", () => {
            const writer = fs.createWriteStream(path.join(__dirname, "medical.csv"));
            csv.write(rows, { headers: true }).pipe(writer);

            writer.on("finish", async () => {
                console.log("Fields are successfully removed from the file");
                try {
                    const file = await storage.bucket(bucketName).upload(path.join(__dirname, "medical.csv"), { destination: filename });
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(path.join(__dirname, "medical.csv"));
                    res.send("File loaded into GCS");
                } catch (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }
            });

            // Error handling for writer stream
            writer.on("error", (err) => {
                console.error("Error writing file:", err);
                res.status(500).send("Error writing file");
            });
        });

        // Error handling for parser stream
        parser.on("error", (err) => {
            console.error("Error parsing file:", err);
            res.status(500).send("Error parsing file");
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};



const loadToBigQuery = async (req, res) => {
    try {
        const dataset = bigquery.dataset(datasetId);
        const [exists] = await dataset.exists();

        if (exists) {
            const table = dataset.table(tableId);
            const [job] = await table.load(storage.bucket(bucketName).file(filename), {
                skipLeadingRows: 1,
                autodetect: true
            });
            return res.status(200).send({ 
                message: "Data loaded into BigQuery",
            });
        } else {
            const ds = await bigquery.createDataset(datasetId);
            const table = dataset.table(tableId);
            const [job] = await table.load(storage.bucket(bucketName).file(filename), {
                skipLeadingRows: 1,
                autodetect: true
            });
            return res.status(200).send({ 
                message: "Dataset created and data loaded into BigQuery",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err); 
    }
}

const addRow = async (req, res) => {
    try {
        const { name, age, gender, blood_type, medical_condition, doctor, insurance_provider, billing_amt, admission_type, medication, results } = req.body;
        const record = {
                Name: name,
                Age: age,
                Gender: gender,
                Blood_Type: blood_type,
                Medical_Condition: medical_condition,
                Doctor: doctor,
                Insurance_Provider: insurance_provider,
                Billing_Amount: billing_amt,
                Admission_Type: admission_type,
                Medication: medication,
                Test_Results: results
        }

        const [response] =  await bigquery
                                    .dataset(datasetId)
                                    .table(tableId)
                                    .insert(record);
        
        return res
                .status(201)
                .send({
                    data: response
                });
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .send({
                    message: "Internal Server Error"
                });
    }
}

const deleteRow = async (req, res) => {
    try {
        console.log("EHSADN")
        const {
            name,
            age,
            gender,
            blood_type,
            doctor,
            insurance_provider,
            billing_amt,
            admission_type,
            medical_condition,
            medication,
            results
        } = req.body;
        console.log(name, age, gender, blood_type)
        const query = `
            DELETE FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            WHERE
                Name = '${name}' AND
                Age = ${age} AND
                Gender = '${gender}' AND
                Blood_Type = '${blood_type}' AND
                Medical_Condition = '${medical_condition}' AND
                Doctor = '${doctor}' AND
                Insurance_Provider = '${insurance_provider}' AND
                Billing_Amount = ${billing_amt} AND
                Admission_Type = '${admission_type}' AND
                Medication = '${medication}' AND
                Test_Results = '${results}'
        `;



         const [job] = await bigquery.createQueryJob({
            query: query,
            
            location: 'US'
        });

        await job.getQueryResults();

        res.status(200).send('Row deleted successfully.');
    } catch (err) {
        // console.log(err)
        return res
                .status(500)
                .send({
                    message: "Internal Server Error"
                })
    }
}

module.exports = {
    uploadFile,
    loadToBigQuery,
    addRow,
    deleteRow
};
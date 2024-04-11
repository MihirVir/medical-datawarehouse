const redis = require("@upstash/redis");
const {BigQuery} = require("@google-cloud/bigquery");

const bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILE_NAME
})

const client = new redis.Redis({
    url: process.env.REDIS_URI,
    token: process.env.REDIS_TOKEN
})


const datasetId = process.env.DATASET_ID;

const tableId = process.env.TABLE_ID; 

const getPaginatedData = async (req, res) => {
    try {
        const page_number = req.params.page;
        const query = `SELECT * FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId} LIMIT 20 OFFSET ${page_number * 20};`
        
        const options = {
            query: query,
            location: "US"
        }

        const [rows] = await bigquery.query(options);

        res.send({
            data: rows
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

const getTopThreeMedications = async (req, res) => {
    try {
        const cached_data = await client.get("top_three_medications");
        if (typeof cached_data === "string") {
            console.log(typeof cached_data);
            const data = JSON.parse(cached_data);
            return res
                    .status(200)
                    .send({
                        data: data
                    });
        } else if (cached_data) {
            return res
                .status(200)
                .send({
                    data: cached_data
                }); 
        }
        const query = `
            SELECT Medication, COUNT(*) As MedicationCount
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            GROUP BY Medication
            ORDER BY MedicationCount desc
            LIMIT 3;
        `;

        const options = {
            query: query,
            location: "US"
        }

        const [rows] = await bigquery.query(options);
        
        await client.setex("top_three_medications", 200, JSON.stringify(rows));

        return res
                .status(200)
                .send({
                    data: rows
                })
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .send({message:"Internal Server Error"});
    }
}

const getMostCommonBloodType = async (req, res) => {
    try {
        const cached_data = await client.get("blood_type");
        
        if (typeof cached_data === "string") {
            console.log(cached_data);
            const data = JSON.parse(cached_data);
            return res
                    .status(200)
                    .send({
                        data: data
                    });
        } else if (cached_data) {
            const data = cached_data
            return res
                .status(200)
                .send({
                    data: data
                }); 
        }

        const all_genders_query = `
            SELECT Blood_Type, Count(*) As BloodTypeCounter
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            GROUP BY Blood_Type
            ORDER BY BloodTypeCounter DESC
            LIMIT 1;
        `;
    
        const male_query = `
            SELECT Blood_Type, Count(*) As MaleCounter
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            WHERE Gender = 'Male'
            GROUP By Blood_Type
            ORDER BY MaleCounter DESC
            LIMIT 1;
        `;
    
        const female_query = `
            SELECT Blood_Type, Count(*) As FemaleCounter
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            WHERE Gender = 'Female'
            GROUP By Blood_Type
            ORDER BY FemaleCounter DESC
            LIMIT 1;
        `;
    
        const all_genders_query_result = await bigquery.query({
            query: all_genders_query,
            location: "US"
        })
        const male_query_result = await bigquery.query({
            query: male_query,
            location: "US"
        })
        const female_query_result = await bigquery.query({
            query: female_query,
            location: "US"
        })

        const data = {
            most_common_blood_type: all_genders_query_result[0],
            male_most_common_blood_type: male_query_result[0],
            female_most_common_blood_type: female_query_result[0] 
        }

        await client.setex("blood_type", 200, JSON.stringify(data));

        return res
                .status(200)
                .send({
                    data: data
                })
    } catch (err) {
        return res
                .status(500)
                .send({
                    message: "Internal Server Error"
                })
    }
}

const getMostCommonMedicalCondition = async (req, res) => {
    try {
        const cached_data = await client.get("medical_condition");
        if (typeof cached_data === "string") {
            console.log(cached_data);
            const data = JSON.parse(cached_data);
            return res
                    .status(200)
                    .send({
                        data: data
                    });
        } else if (cached_data) {
            const data = cached_data
            return res
                .status(200)
                .send({
                    data: data
                }); 
        }
        const query = `
            SELECT Medical_Condition, Count(*) As ConditionCounter
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            GROUP By Medical_Condition
            ORDER BY ConditionCounter DESC
            LIMIT 3; 
        `;

        const options = {
            query: query,
            location: "US"
        }
        
        const rows = await bigquery.query(options)
        await client.setex("medical_condition", 200, JSON.stringify(rows[0]));

        return res
                .status(200)
                .send({
                    data: rows[0]
                });
    } catch (err) {
        console.log(err);   
        return res
                .status(500)
                .send({
                    message: "Internal Server Error",
                    err: err
                })
    }
}
const getAverageBillingAmount = async (req, res) => {
    try {
        const cachedData = await client.get("avg_billing_amt");
        if (typeof cachedData === "string") {
            const data = JSON.parse(cachedData);
            return res.status(200).send({ data });
        } else if (cachedData) {
            return res.status(200).send({ data: cachedData });
        }

        const query = `SELECT AVG(Billing_Amount) AS AverageBillingAmount
                        FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId};`;
        const queryMax = `SELECT MAX(Billing_Amount) AS MaxBillingAmount
                            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId};`;
        const queryMin = `SELECT MIN(Billing_Amount) AS MinBillingAmount
                            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId};`;

        const optionsAvg = { query, location: "US" };
        const optionsMax = { query: queryMax, location: "US" };
        const optionsMin = { query: queryMin, location: "US" };

        const [rowsAvg, rowsMax, rowsMin] = await Promise.all([
            bigquery.query(optionsAvg),
            bigquery.query(optionsMax),
            bigquery.query(optionsMin)
        ]);
        

        const average = parseFloat(rowsAvg[0][0].AverageBillingAmount).toFixed(2);
        const maxFloat = parseFloat(rowsMax[0][0].MaxBillingAmount).toFixed(2);
        const minFloat = parseFloat(rowsMin[0][0].MinBillingAmount).toFixed(2);

        const data = { average, max: maxFloat, min: minFloat };
        await client.setex("avg_billing_amt", 200, JSON.stringify(data));

        return res.status(200).send({ data });
    } catch (err) {
        console.error("Error in getAverageBillingAmount:", err);
        return res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

const searchRecords = async (req, res) => {
    try {
        const name = req.params.name;
        const query = `
            SELECT *
            FROM ${process.env.PROJECT_ID}.${datasetId}.${tableId}
            WHERE Name LIKE @name
            LIMIT 10;
        `;
        
        const options = {
            query,
            params: {
                name: `%${name}%`,
            },
            location: "US"
        }

        const [rows] = await bigquery.query(options);
        
        res.send({
            data: rows
        })
    } catch (err) {
        return res
                .status(500)
                .send({
                    message: "Internal Server Error",
                    err: err
                })
    }
}

module.exports = {
    getPaginatedData,
    getTopThreeMedications,
    getMostCommonBloodType,
    getMostCommonMedicalCondition,
    getAverageBillingAmount,
    searchRecords
}
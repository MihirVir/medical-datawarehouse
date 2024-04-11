import React, {useState} from 'react'
import { FaFileAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./upload.css"
import LoadingAnimation from '../Loading/Loading';
const Upload = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [bigQuerySucess, setBigQuerySuccess] = useState(false);
    const [bigQueryError, setBigQueryError] = useState(false);

    const handleCSVSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('file', e.target.querySelector('input[type="file"]').files[0]);

            const res = await axios.post("/api/v1/setup/upload", formData,{
                headers: {
                    'Content-Type': "multipart/form-data",
                }
            });
        
            if (res.status === 200) {
                setSuccess(true);
                console.log(res.data);
                setLoading(false);
                toast.success("File was successfully uploaded to Google Cloud Storage");
            }

        } catch (err) {
            setError(true);
            setSuccess(false);
            setLoading(false);
            toast.error("Error uploading file to Google Cloud Storage");
        }
    }

    const handleBigQuery = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = await axios.post("/api/v1/setup/bigquery");

            if (res.status === 200) {
                setSuccess(true);
                console.log(res.data);
                setLoading(false);
                toast.success("File was Successfully Loaded to BigQuery"); 
            }
        } catch (err) {
            setError(true);
            setSuccess(false);
            setLoading(false);
            toast.error("Error Loading File to BigQuery"); 
        }
    }

    return (
        <>
            <div className = "upload-header">
                {
                    loading ? <LoadingAnimation height={100}/> : (
                        <>
                            <h1>Upload CSV</h1>
                            <div className="form-container">
                                <form onSubmit={handleCSVSubmit}>
                                    <label>
                                        Click here to Upload CSV File
                                        <input type="file" />
                                        <div>
                                            <FaFileAlt />
                                        </div>
                                    </label>
                                    <button style = {{marginTop: "10px"}}>Submit File</button>
                                </form>

                                {success && (
                                    <>
                                        <button onClick={handleBigQuery} style = {{marginTop: "10px", width: "57.5%", padding: "1rem", backgroundColor: "#0891b2", border: 'none', cursor: "pointer"}}>Load DataSet to BigQuery</button>
                                    </>
                                )}
                                <ToastContainer />
                            </div>
                        </>
                    )
                }


            </div>
            <ToastContainer />
        </>
    )
}

export default Upload;
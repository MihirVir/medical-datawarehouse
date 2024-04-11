import React, {useState, useEffect} from 'react'
import axios from "axios";
import LoadingAnimation from '../Loading/Loading';
import { IoTrashBinSharp } from "react-icons/io5";

import "./table.css"
const Table = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [search, setSearch] = useState(0);
    const [record, setRecord] = useState();

    let pages = [1, 2, 3, 4];
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/v1/dashboard/data/${pageNumber}`);
            setData(response.data.data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pageNumber, search]);

    const handlePageChange = (number) => {
        console.log(pageNumber)
        setPageNumber(number);
    }

    const handleDecrement = () => {
        if (pageNumber > 0) {
            setPageNumber(prev => prev - 1)
        } else {
            setPageNumber(0);
        }
        console.log(pageNumber);
    }

    const handleIncrement =() => {
        setPageNumber(prev => prev + 1);
        console.log(pageNumber)
    }

    return (
        <div className = "container-mainer">
            {isLoading ? <LoadingAnimation height={100} /> : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Blood Type</th>
                                <th>Condition</th>
                                <th>Insurance</th>
                                <th>Billing</th>
                                <th>Type</th>
                                <th>Medical</th>
                                <th>Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, idx) => {
                                return (
                                    <>
                                        <tr className = "table-row">
                                            <td className ="spc">
                                                <p>
                                                    {parseInt(idx + 1)}
                                                </p>
                                            </td>
                                            <td>{item.Name.split(" ")[0]}</td>
                                            <td>{item.Age}</td>
                                            <td>{item.Gender}</td>
                                            <td>{item.Blood_Type}</td>
                                            <td>{item.Medical_Condition}</td>
                                            <td>{item.Insurance_Provider}</td>
                                            <td>{parseFloat(item.Billing_Amount.toFixed(2))}</td>
                                            <td>{item.Admission_Type}</td>
                                            <td>{item.Medication}</td>
                                            <td>{item.Test_Results}</td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className = "page-number-container">
                        <div className="system">
                            <div onClick = {handleDecrement} className = "page-changer-container">
                                <p className = "page-changer">L</p>
                            </div>
                            {pages.map((number, idx) => {
                                return (
                                    <>
                                        <div key = {idx} onClick = {() => handlePageChange(number)} className = "page-changer-container">
                                            <p className = "page-changer">{number}</p>
                                        </div>        
                                    </>
                                )
                            })}
                            <div onClick = {handleIncrement} className = "page-changer-container">
                                <p className = "page-changer">R</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Table
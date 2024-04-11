import React, {useState, useEffect, useRef} from 'react'
import LoadingAnimation from '../Loading/Loading';
import axios from "axios";
import { TbBrandCashapp } from "react-icons/tb";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    CategoryScale,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js"
import "./analytics.css";

ChartJS.register(
    BarElement,
    LinearScale,
    CategoryScale,
    ArcElement,
    Tooltip,
    Legend
)
const Analytics = () => {
    const [loading, setLoading] = useState(false);
    const [avgBillingAmount, setAvgBillingAmount] = useState();
    const [blood, setBlood] = useState();
    const [medications, setMedications] = useState();
    const [condition, setCondition] = useState();

    const chartRef = useRef(null);

    const labelMedications =  medications?.data.map(item => item.Medication);
    const valuesMedications = medications?.data.map(item => item.MedicationCount);

    const chartData = {
        labels: labelMedications,
        datasets: [
          {
            label: 'Medication Count',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.4)',
            hoverBorderColor: 'rgba(0,0,0,1)',
            data: valuesMedications,
          },
        ],
    };
    
    const pieData = {
        labels: condition?.data.map(item => item?.Medical_Condition),
        datasets: [
          {
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            data: condition?.data?.map(item => item?.ConditionCounter),
          },
        ],
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            const [
                billing_response,
                blood_type_response,
                medication_response,
                medical_condition_response
            ] = await Promise.all([
                await axios.get("/api/v1/dashboard/billing"),
                await axios.get("/api/v1/dashboard/blood-types"),
                await axios.get("/api/v1/dashboard/medications"),
                await axios.get("/api/v1/dashboard/medical-condition")
            ]);

            setAvgBillingAmount(billing_response.data);
            setBlood(blood_type_response.data)
            setCondition(medical_condition_response.data);
            setMedications(medication_response.data);

            console.log(condition);

            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }    

    useEffect(() => {
        fetchData();
        
    }, [])
    
    return (
        <>
            <div className = "analytics-something">
                {
                    loading ? <LoadingAnimation height={100}/> : (
                        <> 
                            <h1>Analytics</h1>
                            <div className="analytics-board">
                                <div className="card">
                                    <div className="card-text-container">
                                        <h4>Average Billing Amount</h4>
                                        <p style = {{color: "red"}}>${avgBillingAmount?.data?.average}</p>
                                        <h4>Max Billing Amount</h4>
                                        <p style = {{color: "red"}}>${avgBillingAmount?.data?.max}</p>
                                        <h4>Min Billing Amount</h4>
                                        <p style = {{color: "red"}}>${avgBillingAmount?.data?.min}</p>
                                    </div>
                                    <div className="icon-container-card">
                                        <TbBrandCashapp style = {{fontSize: "10rem"}}/>
                                    </div>
                                </div>
                                <div className="special-card">
                                    <h2>Most Common Blood Types</h2>
                                    <div className = "custom-table">
                                        <span>Gender</span>
                                        <span>Blood Type</span>
                                        <span>Occurrence</span>
                                    </div>
                                    <div className = "custom-table">
                                        <span>*</span>
                                        <span>{blood?.data.most_common_blood_type[0].Blood_Type}</span>
                                        <span>{blood?.data.most_common_blood_type[0].BloodTypeCounter}</span>
                                    </div>
                                    <div className = "custom-table">
                                        <span>Male</span>
                                        <span>{blood?.data.male_most_common_blood_type[0].Blood_Type}</span>
                                        <span>{blood?.data.male_most_common_blood_type[0].MaleCounter}</span>
                                    </div>
                                    <div className = "custom-table">
                                        <span>Female</span>
                                        <span>{blood?.data.female_most_common_blood_type[0].Blood_Type}</span>
                                        <span>{blood?.data.female_most_common_blood_type[0].FemaleCounter}</span>
                                    </div>
                                </div>
                                <div className="card medication">
                                    <h1>Top Three Medication</h1>
                                    <Bar
                                        style = {{
                                            marginTop: "1rem",
                                            height: "100%",
                                        }}
                                        ref={chartRef}
                                        data={chartData}
                                        options={{
                                            indexAxis: 'x', // Specify horizontal bars
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div className="card medication">
                                    <h1>Top Three Medical Condition</h1>
                                    <div style = {{height: "85%"}}>
                                        <Pie
                                            data={pieData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio:false,    
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) 
                }
            </div>
        </>
    )
}

export default Analytics
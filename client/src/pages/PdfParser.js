import React, { useState } from "react";
import { Button, Form, FormGroup, Container, Alert } from "react-bootstrap";
import useUser from "../hooks/useUser";
import DoughnutChart from "../components/DoughnutChart";
import axios from "axios";

const PdfParser = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [fileTypeError, setFileTypeError] = useState("");
  const [statementError, setStatementError] = useState(false);
  const [aggregatedData, setAggregatedData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
      setFileTypeError("");
    } else {
      setFile(null);
      setFileTypeError("Please upload a PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("bankStatement", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/parse-pdf`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.length === 0) {
        setStatementError(true);
      } else {
        aggregateTransactions(response.data);
        setStatementError(false);
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  function aggregateTransactions(jsonData) {
    const aggregated = {};
    jsonData?.forEach((transaction) => {
      const { recipient, type, amount, date, time } = transaction;
      const parsedAmount = parseFloat(amount.replace("₹", "").replace(",", ""));
      if (!aggregated[recipient]) {
        aggregated[recipient] = {
          recipient,
          totalDebitAmount: 0,
          totalCreditAmount: 0,
          date,
          time,
        };
      }
      if (type === "DEBIT") {
        aggregated[recipient].totalDebitAmount += parsedAmount;
      } else if (type === "CREDIT") {
        aggregated[recipient].totalCreditAmount += parsedAmount;
      }
    });
    setAggregatedData(Object.values(aggregated));
    return Object.values(aggregated);
  }

  return (
    <Container>
      <h2 className="gradient-text mb-3">Visualize your bank statements</h2>
      <h6>
        Beta Feature: This will only work for your PhonePe statements. After
        you've successfully upload your statement, it will show an aggregated
        analysis of the payments made for that period.
      </h6>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Form.Control
            type="file"
            name="bankStatement"
            id="statement"
            onChange={handleFileChange}
          />
        </FormGroup>
        {fileTypeError && <Alert variant="danger">{fileTypeError}</Alert>}
        <Button type="submit" className="my-3" disabled={!file}>
          {user ? "Submit" : "Login to Submit"}
        </Button>
      </Form>
      {statementError && (
        <p className="text-center">
          Are you sure you've uploaded a PhonePe statement? &#128528;
        </p>
      )}
      <DoughnutChart data={aggregatedData} />
    </Container>
  );
};

export default PdfParser;

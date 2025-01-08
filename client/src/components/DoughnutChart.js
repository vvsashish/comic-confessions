import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Container } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = ({ data }) => {
  const amounts = data?.flatMap((item) => {
    const amountsArray = [];
    if (item.totalDebitAmount !== 0) {
      amountsArray.push({
        amount: item.totalDebitAmount,
        type: "debit",
        date: item.date,
        time: item.time,
      });
    }
    if (item.totalCreditAmount !== 0) {
      amountsArray.push({
        amount: item.totalCreditAmount,
        type: "credit",
        date: item.date,
        time: item.time,
      });
    }
    return amountsArray;
  });

  const chartData = {
    labels: data?.map((item) => item.recipient),
    datasets: [
      {
        data: amounts?.map((item) => item.amount),
        backgroundColor: amounts?.map((item) =>
          item.type === "debit" ? "#ff0a78" : "#5773ff"
        ),
        hoverBackgroundColor: amounts?.map((item) =>
          item.type === "debit" ? "#ff0a7857" : "#5773ff57"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: data && data?.length > 0,
        position: "top",
        labels: {
          generateLabels: (chart) => {
            const labels = [
              { text: "DEBIT", fillStyle: "#ff0a78", fontColor: "#ff0a78" },
              { text: "CREDIT", fillStyle: "#5773ff", fontColor: "#5773ff" },
            ];
            return labels;
          },
        },
      },
      title: {
        display: data && data?.length > 0,
        text: "Aggregated Expenditures",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataIndex = tooltipItem.dataIndex;
            const amountItem = amounts[dataIndex];
            return [
              `${amountItem.type.toUpperCase()}: ${amountItem.amount}`,
              `Date: ${amountItem.date}`,
              `Time: ${amountItem.time}`,
            ];
          },
        },
      },
    },
  };

  return (
    <Container className="doughnut-chart">
      <Doughnut data={chartData} options={options} />
    </Container>
  );
};

export default DoughnutChart;

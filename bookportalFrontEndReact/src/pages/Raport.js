import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper, Box } from "@mui/material";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Raport = () => {
  const [reportData, setReportData] = useState([]);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/author/report"
        );
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (reportData.length && !chart1) {
      const ctx1 = document.getElementById("chart1").getContext("2d");
      setChart1(
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: reportData.map(
              (item) => `${item.authorName} ${item.authorSurname}`
            ),
            datasets: [
              {
                label: "Numarul total de achizitii",
                data: reportData.map((item) => item.totalPurchases),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          },
        })
      );
    }
  }, [reportData, chart1]);

  useEffect(() => {
    if (reportData.length && !chart2) {
      const booksWithLessThan400Pages = reportData.filter(
        (item) => item.numberOfPages < 400
      ).length;
      const booksWithMoreThan400Pages = reportData.filter(
        (item) => item.numberOfPages >= 400
      ).length;

      const ctx2 = document.getElementById("chart2").getContext("2d");
      setChart2(
        new Chart(ctx2, {
          type: "pie",
          data: {
            labels: ["Carti cu < 400 pagini", "Carti cu >= 400 pagini"],
            datasets: [
              {
                data: [booksWithLessThan400Pages, booksWithMoreThan400Pages],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                ],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          },
        })
      );
    }
  }, [reportData, chart2]);

  const genereazaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Raport Achizitii Carti", 10, 10);

    doc.setFontSize(14);
    doc.text("Achizitiile Totale Ale Unui Autor", 10, 20);
  
    const tableData = reportData.map((item) => [
      `${item.authorName} ${item.authorSurname}`,
      item.totalPurchases,
    ]);
    doc.autoTable({
      startY: 25,
      head: [["Autor", "Numarul Total de Achizitii"]],
      body: tableData,
    });
  
    const chart1Image = chart1.toBase64Image();
    doc.text("Achizitiile Totale Ale Unui Autor (Grafic)", 10, 10);
    doc.addImage(chart1Image, "PNG", 10, 150, 180, 100);

    // doc.table(10, 150, [["Carti cu < 400 pagini", reportData.filter((item) => item.numberOfPages < 400).length], ["Carti cu >= 400 pagini", reportData.filter((item) => item.numberOfPages >= 400).length]]);
    
    doc.addPage();
    const tableData2 = [ ["Carti cu < 400 pagini", reportData.filter((item) => item.numberOfPages < 400).length], ["Carti cu >= 400 pagini", reportData.filter((item) => item.numberOfPages >= 400).length] ];
    doc.autoTable({
      startY: 150,
      head: [["Tip Carte", "Numar Carti"]],
      body: tableData2,
    });
  
    const chart2Image = chart2.toBase64Image();
    doc.text("Distributia Cartilor in Functie de Numarul de Pagini", 10, 10);
    doc.addImage(chart2Image, "PNG", 10, 20, 180, 100);
  
    doc.save("raport_achizitii_carti.pdf");
  };

  return (
    <Container sx={{ marginLeft: "230px" }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>
          Raport achizitii carti
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Achizitiile totale ale unui autor</Typography>
            <canvas id="chart1" width="400" height="200"></canvas>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              Distributia cartilor in functie de numarul de pagini
            </Typography>
            <canvas id="chart2" width="400" height="200"></canvas>
          </Box>
        </Box>
      </Paper>  
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <button className="btn btn-primary" onClick={genereazaPDF}>
          Genereaza PDF
        </button>
      </Box>
    </Container>
  );
};

export default Raport;

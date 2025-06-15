import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Container,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import BookService from "../../Service/BookService";
import axios from "axios";

const BookForm = () => {

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");

  const [formData, setFormData] = useState({
    numeCarte: "",
    pret: "",
    cantitate: 1,
    numeCumparator: "",
    email: "",
    tva: 19,
  });

  const [pretTotal, setPretTotal] = useState(0);

  const calculeazaTotal = () => {
    const pret = parseFloat(formData.pret || 0);
    const cantitate = parseInt(formData.cantitate || 1);
    const valoareTva = (pret * cantitate * formData.tva) / 100;
    const total = pret * cantitate + valoareTva;
    setPretTotal(total.toFixed(2));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/user/book/getAll");
        console.log("API Response:", response.data);
        // Ensure `response.data` is the expected array
        setBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]); // Fallback to an empty array
      }
    };
    fetchBooks();
    console.log("Books:", books);
  }, []);
  

  // Handle book selection
  const handleBookSelect = (e) => {
    const selectedBookId = e.target.value;
    const book = books.find((b) => b.id === selectedBookId);

    if (book) {
      setSelectedBook(selectedBookId);
      setFormData({
        ...formData,
        numeCarte: book.title,
        pret: book.price,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construct the purchase object
    const purchase = {
      user: {
        id: 1, // Replace with the actual user ID (e.g., from authentication)
      },
      book: {
        id: selectedBook, // Use the selected book's ID
      },
      author: {
        id: books.find((book) => book.id === selectedBook)?.author.id || null, // Get author ID from selected book
      },
      quantity: parseInt(formData.cantitate),
      price: parseFloat(formData.pret),
    };
  
    try {
      const response = await axios.post("http://localhost:8080/api/v1/user/book/addPurchase", purchase);
      console.log("Purchase saved successfully:", response.data);
      alert("Purchase has been successfully saved!");
  
      // Reset the form
      setFormData({
        numeCarte: "",
        pret: "",
        cantitate: 1,
        numeCumparator: "",
        email: "",
        tva: 19,
      });
      setPretTotal(0);
      setSelectedBook("");
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Failed to save the purchase. Please try again.");
    }
  };
  

  const genereazaPDF = () => {
    const doc = new jsPDF();
    doc.text("Ordin de Plata", 10, 10);
    doc.text(`Nume Carte: ${formData.numeCarte}`, 10, 20);
    doc.text(`Pret: ${formData.pret}`, 10, 30);
    doc.text(`Cantitate: ${formData.cantitate}`, 10, 40);
    doc.text(`Pret Total (incl. TVA): ${pretTotal}`, 10, 50);
    doc.text(`Cumparator: ${formData.numeCumparator}`, 10, 60);
    doc.save("ordin_plata.pdf");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Cumpara o carte!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select fullWidth placeholder="Selecteaza o carte" value={selectedBook} onChange={handleBookSelect}>
                {/* <MenuItem value="">Selecteaza o carte</MenuItem> */}
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pret (per bucata)"
                name="pret"
                type="number"
                value={formData.pret}
                onChange={handleChange}
                onBlur={calculeazaTotal}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cantitate"
                name="cantitate"
                type="number"
                value={formData.cantitate}
                onChange={handleChange}
                onBlur={calculeazaTotal}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nume Cumparator"
                name="numeCumparator"
                value={formData.numeCumparator}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TVA (%)"
                name="tva"
                type="number"
                value={formData.tva}
                onChange={handleChange}
                onBlur={calculeazaTotal}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Pret Total (incl. TVA): {pretTotal}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={genereazaPDF}
              >
                Genereaza PDF
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="success"
              >
                Trimite
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BookForm;

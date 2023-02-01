const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const express = require("express");
const niceInvoice = require("nice-invoice");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000

var easyinvoice = require("easyinvoice");
var data = {
    "images": {
    "logo": "https://cdn.shopify.com/s/files/1/0566/3182/0333/files/LOGO-color.png"
    },
    "sender": {
    "company": "Sample Corp",
    "address": "Sample Street 123",
    "zip": "1234 AB",
    "city": "Sampletown",
    "country": "Samplecountry"
    },
    "client": {
    "company": "Client Corp",
    "address": "Clientstreet 456",
    "zip": "4567 CD",
    "city": "Clientcity",
    "country": "Clientcountry"
    },
    "information": {
    "number": "2022.0001",
    "date": "1.1.2022",
    "due-date": "15.1.2022"
    },
    "products": [
    {
    "quantity": "2",
    "description": "Test1",
    "hsin": "123456",
    "tax-rate": 6,
    "price": 33.87
    },
    {
    "quantity": "4",
    "description": "Test2",
    "hsin": "123456",
    "tax-rate": 21,
    "price": 10.45
    }
    ],
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    "settings": {
    "currency": "USD",
    "tax-notation": "vat",
    "margin-top": 50,
    "margin-right": 50,
    "margin-left": 50,
    "margin-bottom": 25
    }
    }

// const { db } = require('./firebase.js')

const invoiceDetail = {
  shipping: {
    name: "Micheal",
    address: "1234 Main Street",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    postal_code: 94111,
  },
  items: [
    {
      item: "Chair",
      description: "Wooden chair",
      quantity: 1,
      price: 50.0,
      tax: "10%",
    },
    {
      item: "Watch",
      description: "Wall watch for office",
      quantity: 2,
      price: 30.0,
      tax: "10%",
    },
    {
      item: "Water Glass Set",
      description: "Water glass set for office",
      quantity: 1,
      price: 35.0,
      tax: "",
    },
  ],
  subtotal: 156,
  total: 156,
  order_number: 1234222,
  header: {
    company_name: "Nice Invoice",
    company_logo: "logo.png",
    company_address:
      "Nice Invoice. 123 William Street 1th Floor New York, NY 123456",
  },
  footer: {
    text: "This is footer - you can add any text here",
  },
  currency_symbol: "$",
  date: {
    billing_date: "08 August 2020",
    due_date: "10 September 2020",
  },
};

const serviceAccount = require("./creds.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/generateInvoice", async (req, res) => {
  const { orderList } = await req.body;
  try {
    console.log(orderList);
    easyinvoice.createInvoice(data, async function (result) {
      //The response will contain a base64 encoded PDF file
    //   console.log(result.pdf);
      res.setHeader("Content-Type", "application/pdf");
      // Set the content-disposition header so that the browser prompts the user to download the file
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      // Send the PDF as the response
      await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
      res.send(result.pdf);
    });

    // res.download(__dirname + 'invoice.pdf', 'invoice.pdf');
    // data.products = orderList;
    // res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(400);
  }
  // const res2 = await productsRef.set({
  //     test: "ddd" .
  //   });
  //   console.log(res2);
});

app.get("/getProducts", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();
    let data = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
  // const productsRef = db.collection("products");
  // const snapshot = await productsRef.get();
  // let data = [];
  // snapshot.forEach((doc) => {
  //     data.push(doc.data())
  // }
  // );
  // res.status(200).json(data)
  // const doc = await productsRef.get()
  // if (!doc.exists) {
  //     return res.sendStatus(400)
  // }

  // res.status(200).json(doc.data())
});
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

<<<<<<< HEAD
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import corsOptions from './config/corsOptions.js'
import router from './routes/api.js'
import eventRouter from './routes/eventRoutes.js'
import userRouter from './routes/userRoutes.js'
import verifyJWT from './middleware/verifyJWT.js'

const app = express()
mongoose.connect('mongodb://localhost:27017/Uivent')

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use('/api',router)
=======
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from '@adyen/api-library';
const { Config, Client, CheckoutAPI, hmacValidator } = pkg;

import corsOptions from './config/corsOptions.js';
import router from './routes/api.js';
import eventRouter from './routes/eventRoutes.js';
import userRouter from './routes/userRoutes.js';
import verifyJWT from './middleware/verifyJWT.js';
import { v4 as uuidv4 } from 'uuid';

import dotenv from "dotenv";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: './.env' });
const app = express();

mongoose.connect('mongodb://localhost:27017/Uivent', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors(corsOptions))

// setup request logging
app.use(morgan("dev"));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Serve client from build folder
app.use(express.static(join(__dirname, "public")));

app.use('/api', router)
>>>>>>> main
app.use('/dash', verifyJWT, eventRouter)
app.use('/dash', verifyJWT, userRouter)
app.use((err, req, res, next)=>{
    res.status(422).send({err: err.message})
})

<<<<<<< HEAD
app.listen(process.env.port || 4000, ()=>{
    console.log("Now listening for requests")
})
=======

const config = new Config();
config.apiKey = process.env.ADYEN_API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);
const validator = new hmacValidator();

const paymentStore = {};

const determineHostUrl = (req) => {
    let {
        "x-forwarded-proto": forwardedProto,
        "x-forwarded-host": forwardedHost,
    } = req.headers

    if (forwardedProto && forwardedHost) {
        if (forwardedProto.includes(",")) {
            [forwardedProto,] = forwardedProto.split(",")
        }

        return `${forwardedProto}://${forwardedHost}`
    }

    return "http://localhost:8080"
}

app.get("/api/getPaymentDataStore", async (req, res) => res.json(paymentStore));

// Submitting a payment
app.post("/api/sessions", async (req, res) => {
    try {

        const orderRef = uuidv4();

        console.log("Received payment request for orderRef: " + orderRef);
        const response = await checkout.PaymentsApi.sessions({
            countryCode: "NL",
            amount: { currency: "EUR", value: 10000 },
            reference: orderRef, // required
            merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
            returnUrl: `${determineHostUrl(req)}/redirect?orderRef=${orderRef}`,
            lineItems: [
                {quantity: 1, amountIncludingTax: 5000 , description: "Sunglasses"},
                {quantity: 1, amountIncludingTax: 5000 , description: "Headphones"}
            ]
        });

        paymentStore[orderRef] = {
            amount: { currency: "EUR", value: 1000 },
            paymentRef: orderRef,
            status: "Pending"
        };

        res.json([response, orderRef]); // sending a tuple with orderRef as well to inform about the unique order reference
    } catch (err) {
        console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
        res.status(err.statusCode).json(err.message);
    }
});

// Cancel or Refund a payment
app.post("/api/cancelOrRefundPayment", async (req, res) => {
    console.log("/api/cancelOrRefundPayment orderRef: " + req.query.orderRef);
    const payload = {
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
        reference: uuidv4(),
    };

    try {
        const response = await checkout.reversals(paymentStore[req.query.orderRef].paymentRef, payload);
        paymentStore[req.query.orderRef].status = "Refund Initiated";
        paymentStore[req.query.orderRef].modificationRef = response.pspReference;
        res.json(response);
        console.info("Refund initiated for ", response);
    } catch (err) {
        console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
        res.status(err.statusCode).json(err.message);
    }
});

// Receive webhook notifications
app.post("/api/webhooks/notifications", async (req, res) => {
    const notificationRequestItems = req.body.notificationItems;
    const notificationRequestItem = notificationRequestItems[0].NotificationRequestItem;
    console.log(notificationRequestItem);

    if (!validator.validateHMAC(notificationRequestItem, process.env.ADYEN_HMAC_KEY)) {
        // invalid hmac: webhook cannot be accepted
        res.status(401).send('Invalid HMAC signature');
        return;
    }

    if (notificationRequestItem.success === "true") {
        if (notificationRequestItem.eventCode === "AUTHORISATION") {
            const payment = paymentStore[notificationRequestItem.merchantReference];
            if(payment){
                payment.status = "Authorised";
                payment.paymentRef = notificationRequestItem.pspReference;
            }
        }
        else if (notificationRequestItem.eventCode === "CANCEL_OR_REFUND") {
            const payment = findPayment(notificationRequestItem.pspReference);
            if(payment) {
                console.log("Payment found: ", JSON.stringify(payment));
                // update with additionalData.modification.action
                if (
                    "modification.action" in notificationRequestItem.additionalData &&
                    "refund" === notificationRequestItem.additionalData["modification.action"]
                ) {
                    payment.status = "Refunded";
                } else {
                    payment.status = "Cancelled";
                }
            }
        }
        else {
            console.info("skipping non actionable webhook");
        }
    }

    // acknowledge event has been consumed
    res.status(202).send();

});

// Handles any requests that doesn't match the above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

function findPayment(pspReference) {
    const payments = Object.values(paymentStore).filter((v) => v.modificationRef === pspReference);
    if (payments.length < 0) {
        console.error("No payment found with that PSP reference");
    }
    return payments[0];
}
app.listen(process.env.port || 4000, '0.0.0.0', ()=>{
    console.log("Now listening for requests")
})
>>>>>>> main

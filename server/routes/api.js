import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import stripe from 'stripe';
import pdfkit from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import emailService from '../service/email.service.js';


import User from '../models/user.js';
import {generateAccess, generateRefresh} from './generateJWT.js';
import Ticket from "../models/ticket.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let imageName;
let profileImageName;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  __dirname + '/event_images/')
    },
    filename: (req, file, cb) => {
        imageName = Date.now() + path.extname(file.originalname)
        cb(null, imageName)
    }
})

const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  __dirname + '/user_profile/')
    },
    filename: (req, file, cb) => {
        profileImageName = Date.now() + path.extname(file.originalname)
        cb(null, profileImageName)
    }
})

const upload = multer({storage:storage})
const uploadProfile = multer({storage: storageProfile})

//----------------------------LOGIN/SIGNUP ROUTES

router.post('/signup', (req, res, next) => {   
    let user_request = req.body;
    user_request.user_followers = [];
    user_request.user_following = [];
    user_request.user_posts = [];
    user_request.user_interested = [];
    user_request.roles = ['user'];
    user_request.user_bio = " ";
    user_request.user_img = "default.jpg"
    
    bcrypt.hash(user_request.user_password, 10, function(err, hash){
        user_request.user_password = hash;
        User.create(user_request).then((user)=>{
            if(err){
                console.log(err);
                res.setHeader('500', {'Content-Type': 'application/json'});
                res.send({user: 0, message: 'Something went wrong'});
            }
            else{
                res.setHeader('200', {'Content-Type': 'application/json'});
                res.send({user: user.user_name, message: 'User created'});
                emailService.sendCongratulations(user.user_email, user.user_name);
            }
        }).catch(next);
    });
    
})

router.post('/signup/check', (req, res, next)=> {
    User.findOne({user_name: req.body.user_name}, {user_name: 1, _id: 0}).then((user)=>{
        if(user){
            res.setHeader('403', {'Content-Type': 'application/json'});
            res.send({userExists: 1, message: 'Username already exists'});
        }
        else{
            res.setHeader('200', {'Content-Type': 'application/json'});
            res.send({userExist: 0, message: 'Username does not exist'});
        }
    })
})

router.get('/login', (req, res, next) => {
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.status(401).json({message: 'Unauthorized'})
    }
})

router.post('/login', (req, res, next)=>{
    let user_request = req.body;
    
    User.find({user_name: user_request.user_name}).then((user)=>{    
        if(user.length){
            bcrypt.compare(user_request.user_password, user[0].user_password, (err, result)=>{
                if(result){
                    
                    res.setHeader('200', {'Content-Type': 'application/json'});
                    
                    const accessToken = generateAccess(user[0])
                    const refreshToken = generateRefresh(user[0])

                    res.cookie('jwt', refreshToken, {
                        httpOnly: false,
                        //secure: true,
                        sameSite: 'None',
                        maxAge: 24 * 60 * 60 * 1000
                    })
                    res.json({accessToken: accessToken, user_id: user[0]._id})                   
                }
                else{
                    res.setHeader('401', {'Content-Type': 'application/json'});
                    res.send({user_name: null, message: "Username or Password is incorrect"});
                } 
            })
        }
        else{
            res.setHeader('401', {'Content-Type': 'application/json'});
            res.send({user_name: null, message: "Username or Password is incorrect"});
        }
    }) 
})

router.get('/signup/check', (req, res, next)=> {
    res.status(404).json('Page Not Found');
})

router.get('/signup', (req, res, next)=>{
    res.status(404).json('Page Not Found');
})


//----------------------------IMAGE ROUTES

router.get('/image/event/:id', (req, res, next)=>{
    res.sendFile('event_images/' + req.params.id, {root: __dirname})
})

router.post('/image/event', upload.single('event_img'), (req, res, next)=>{
    res.send({message: 'Image Uploaded', imgPath: imageName});
})

router.get('/image/user/:id', (req, res, next)=> {
    res.sendFile('user_profile/' + req.params.id, {root: __dirname})
})

router.post('/image/user', uploadProfile.single('user_img'), (req, res, next)=> {
    res.send({message: 'Image Uploaded', imgPath: profileImageName});
})

router.post('/sendConfirmationEmail', async (req, res) => {
    const { email, link } = req.body;

    try {
        await emailService.sendConfirmation(email, link);
        res.status(200).json({ message: 'Письмо с подтверждением успешно отправлено' });
    } catch (error) {
        console.error('Ошибка отправки письма с подтверждением:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

router.get('/confirm-email/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        // Find the user in the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Update the user_emailConfirmed field to true
        user.user_emailConfirmed = true;
        await user.save();

        return res.status(200).json({ message: 'Email подтвержден успешно' });
    } catch (error) {
        console.error('Ошибка при подтверждении email:', error);
        return res.status(500).json({ message: 'Ошибка при подтверждении email' });

        }
        });

// backend code to handle ticket purchase
router.post('/purchaseTicket', async (req, res) => {
    try {
        // Extract user ID, event ID, and ticket information from the request body
        const { userId, eventId, ticketInfo } = req.body;

        // Save the ticket information to the database
        const newTicket = await Ticket.create({
            user_id: userId,
            event_id: eventId,
            ticket_info: ticketInfo,
        });

        res.status(200).json({ message: 'Ticket information added successfully.', ticket: newTicket });
    } catch (error) {
        console.error('Error adding ticket information to the database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


function createTicketPDF(ticketInfo) {
    const doc = new pdfkit();
    const pdfPath = __dirname + '/ticket.pdf';
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add content to the PDF document
    doc
        .fontSize(20)
        .text('Event Ticket', { align: 'center' })
        .moveDown();

    // Add ticket information to the PDF
    doc
        .fontSize(12)
        .text(`Location: ${ticketInfo.location}`)
        .text(`Date: ${ticketInfo.date}`)
        .moveDown();

    doc.end(); // End the document
    return pdfPath;
}

router.post('/sendTicketByEmail', async (req, res) => {
    try {
        const { email, ticketInfo } = req.body;
        console.log("Email:", email); // Add this line for debugging
        console.log("Ticket Info:", ticketInfo);
        if (!email) {
            return res.status(400).json({ error: 'No recipient email provided' });
        }
        const ticketPdf = createTicketPDF(ticketInfo);

        // Send email with ticket attachment
        await emailService.sendConfirmationPayment(email, ticketPdf);
        res.status(200).json({ message: 'Квиток відправлено на вашу електронну адресу.' });
    } catch (error) {
        console.error('Помилка відправки квитка по електронній пошті:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
router.post('/tickets', async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
        const ticketCount = await Ticket.countDocuments({ user_id, event_id });

        if (ticketCount >= 5) {
            return res.status(400).json({ error: 'Максимальна кількість квитків для цієї події вже придбана.' });
        }else {
            return  res.status(200);
        }
    } catch (error) {
        console.error('Помилка покупки квитка:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

export default router

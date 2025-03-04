const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const Loan = require('./loan');
const mongoUrl = "mongodb+srv://mrchaitu07:Reddy@cluster0.igtza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039]]]pou89ywe";
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FileSet = require('./FileSet');
// const qrcode = require("qrcode");
const qrcode = require('qrcode-terminal');  // Import QR code terminal
const { makeWASocket, useMultiFileAuthState, BufferJSON } = require('@whiskeysockets/baileys');
const { readFileSync, writeFileSync, existsSync } = require('fs');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize OTP store for WhatsApp auth
const otpStore = {};

// WhatsApp integration
const AUTH_FOLDER = './auth'; // Use a folder instead of a single file
let sock = null;

// Make sure auth folder exists
if (!fs.existsSync(AUTH_FOLDER)) {
  fs.mkdirSync(AUTH_FOLDER, { recursive: true });
}

async function connectToWhatsApp() {
  try {
    // Use multiFileAuthState instead of manually handling state
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
    
    // Create WhatsApp socket
    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true, // Show QR in terminal for initial setup
    });

    // Handle credential updates
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log("Scan the QR Code to login:");
        qrcode.generate(qr, { small: true }); // Fix: Correct function
    }
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 403;
        console.log('Connection closed due to ', lastDisconnect?.error, 'Reconnecting: ', shouldReconnect);
        
        if (shouldReconnect) {
          setTimeout(connectToWhatsApp, 5000); // Reconnect after 5 seconds
        }
      }
      
      if (connection === 'open') {
        console.log('WhatsApp connection established successfully!');
      }
    });

    // Listen for messages (optional)
    sock.ev.on('messages.upsert', ({ messages }) => {
      console.log('New message received:', messages[0]?.message?.conversation || '[Media/Other content]');
      // Handle incoming messages here if needed
    });

    return sock;
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error);
    throw error;
  }
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Update your upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.startsWith('image/') ? 'images' : 'pdfs';
    const uploadDir = path.join(__dirname, "uploads", fileType);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const allowedPDFType = 'application/pdf';
  
  if (allowedImageTypes.includes(file.mimetype) || file.mimetype === allowedPDFType) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per upload
  }
});

mongoose.connect(mongoUrl).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log("Database not connected", e);
});

require('./UserDetails');
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
    res.send({ status: "started" });
});

// Update the register route in your Express server
app.post('/register', async (req, res) => {
  const { name, email, phone, address, referralCode } = req.body;

  // Check for required fields
  if (!name || !email || !phone) {
      return res.status(400).json({ 
          status: "error", 
          data: "Name, email, and phone are required fields" 
      });
  }

  // Check if user already exists with that email
  const oldUserByEmail = await User.findOne({ email: email });
  if (oldUserByEmail) {
      return res.status(409).json({ 
          status: "error", 
          data: "User with this email already exists" 
      });
  }

  // Check if user already exists with that phone
  const oldUserByPhone = await User.findOne({ phone: phone });
  if (oldUserByPhone) {
      return res.status(409).json({ 
          status: "error", 
          data: "User with this phone number already exists" 
      });
  }

  try {
      // Create the new user
      await User.create({
          name,
          email,
          phone,
          address: address || '',
          referralCode: referralCode || ''
      });
      
      res.status(201).json({ 
          status: "ok", 
          data: "User registered successfully" 
      });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
          status: "error", 
          data: "Server error during registration" 
      });
  }
});

const createToken = (userId) => {
    const payload = { userId: userId };
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};

app.post("/login-user", (req, res) => { 
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Password!" });
        }

        const token = createToken(user._id);
        res.status(200).json({ status: "ok", token });
    }).catch((error) => {
        console.log("Error in finding the user", error);
        res.status(500).json({ message: "Internal server error!" });
    });
});

const otpStorage = {};

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mrchaitu07@gmail.com",
        pass: "qpvd zmqt vvrm szrm"
    }
});

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/request-reset', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP
        otpStorage[email] = {
            code: otp,
            expiry: Date.now() + 15 * 60 * 1000
        };

        // Email content
        const mailOptions = {
            from: "mrchaitu07@gmail.com",
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP will expire in 15 minutes.`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please check your email configuration.'
        });
    }
});

// Endpoint to reset the password
app.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if reset code exists and matches
        const storedOtp = otpStorage[email];
        if (!storedOtp || storedOtp.code !== resetCode) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (storedOtp.expiry < Date.now()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        // Update password
        user.password = newPassword; // Consider hashing the password here
        await user.save();

        // Clear OTP
        delete otpStorage[email];

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

app.post("/userdata", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid token payload" });
        }

        User.findById(decoded.userId).then((data) => {
            console.log("User data:", data);
            
            if (!data) {
                return res.status(404).json({ message: "User not found" });
            }
            
            return res.send({ status: "Ok", data: data });
        }).catch(err => {
            console.error("Error finding user:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        });

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
});

app.post('/loan', async (req, res) => {
    const { 
        name, 
        phone, 
        email, 
        address, 
        landmark, 
        solarSystemSize,
        occupation,
        annualincome 
    } = req.body;

    // Validate all required fields
    if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !occupation || !annualincome) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required.',
            missingFields: Object.entries({
                name,
                phone,
                email,
                address,
                landmark,
                solarSystemSize,
                occupation,
                annualincome
            }).filter(([_, value]) => !value).map(([key]) => key)
        });
    }

    try {
        const newLoan = new Loan({
            name,
            phone,
            email,
            address,
            landmark,
            solarSystemSize,
            occupation,
            annualincome
        });

        await newLoan.save();
        
        res.status(200).json({ 
            success: true,
            message: 'Loan application submitted successfully',
            loan: newLoan
        });
    } catch (error) {
        console.error('Error Applying Loan:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
});

// upload endpoint
app.post("/upload", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Extract userId from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Map uploaded files to include documentType (if needed)
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
      mimeType: file.mimetype,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.mimetype.startsWith('image/') ? 'images' : 'pdfs'}/${file.filename}`,
      path: file.path,
      size: file.size
    }));

    // Update or create FileSet document for the specific user
    const fileSet = await FileSet.findOneAndUpdate(
      { userId }, // Query by userId
      { $push: { files: { $each: uploadedFiles } } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Successfully uploaded ${req.files.length} file(s)`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message
    });
  }
});

// Update your get images endpoint
app.get("/files", async (req, res) => {
  try {
    const fileSets = await FileSet.find();
    res.json({ success: true, data: fileSets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update your delete endpoint
app.delete("/files/:fileId", async (req, res) => {
  try {
    const fileSet = await FileSet.findOne({ "files._id": req.params.fileId });
    if (!fileSet) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const file = fileSet.files.id(req.params.fileId);
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    await FileSet.findOneAndUpdate(
      {},
      { $pull: { files: { _id: req.params.fileId } } }
    );

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send OTP via WhatsApp
// Send OTP via WhatsApp
app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number is required" 
      });
    }
    
    // Check if the phone number exists in the database
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Phone number not registered. Please register first."
      });
    }
    
    // Ensure WhatsApp connection exists
    if (!sock) {
      console.log("WhatsApp not connected, attempting to connect...");
      await connectToWhatsApp();
      
      // If still not connected after attempt
      if (!sock) {
        return res.status(500).json({
          success: false,
          message: "WhatsApp service unavailable. Please try again later."
        });
      }
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = otp;
    
    // Format phone number (add country code if missing)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    
    // Add default country code if not present (change 91 to your default country code)
    if (!phone.includes('+')) {
      if (formattedPhone.length === 10) { // Assuming 10-digit local number
        formattedPhone = '91' + formattedPhone; // Change 91 to your country code
      }
    }
    
    const whatsappID = `${formattedPhone}@s.whatsapp.net`;
    console.log(`Sending OTP to: ${whatsappID}`);
    
    // Send message
    await sock.sendMessage(whatsappID, { 
      text: `Your OTP for login is: ${otp}. This code will expire in 10 minutes.` 
    });
    
    res.json({ 
      success: true, 
      message: "OTP sent successfully via WhatsApp",
      userId: user._id // You can include the userId in the response if needed
    });
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
      error: error.message
    });
  }
});

// Verify OTP
// Verify OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required"
      });
    }
    
    if (!otpStore[phone]) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found or OTP expired. Please request a new OTP."
      });
    }
    
    if (otpStore[phone] === otp) {
      // OTP verified successfully
      delete otpStore[phone]; // Clear the OTP
      
      // Find the user by phone number
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
      
      // Create JWT token for the user
      const token = createToken(user._id);
      
      res.json({ 
        success: true,
        message: "OTP verified successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Invalid OTP. Please try again." 
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later.",
      error: error.message
    });
  }
});

// Initialize WhatsApp connection when server starts
connectToWhatsApp()
  .then(() => console.log("WhatsApp initialized successfully"))
  .catch(err => console.error("Failed to initialize WhatsApp:", err));

app.listen(5001, () => {
  console.log("Node.js server started on port 5001");
});
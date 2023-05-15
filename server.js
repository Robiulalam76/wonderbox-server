require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = require('./app');

// connect database
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wonderbox', {
            // useFindAndModify: false,
            // useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('mongodb connection success!');
    } catch (err) {
        console.log('mongodb connection failed!', err.message);
    }
};

connectDB()

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

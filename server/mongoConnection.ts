import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

function connectDB(callback = () => {}) {
    mongoose.connect(uri, options)
        .catch(error => {
            console.error('\x1b[31m', "Failed to connect to MongoDB");
            console.log('\x1b[0m');
        });
    mongoose.connection.on('connected', () => {
        console.log('\x1b[33m%s\x1b[0m', "Connected to MongoDB");
        console.log('\x1b[0m');
    });
    mongoose.connection.on('error', (error) => {
        console.error('\x1b[31m', "Failed to connect to MongoDB");
        console.log(error);
    });
    mongoose.connection.once('open', () => {
        console.log('\x1b[33m%s\x1b[0m', "Connection to MongoDB ready");
        callback();
    });
}

export { connectDB };

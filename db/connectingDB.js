import mongoose from 'mongoose';
const connection = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://snafiul700:dB3BsPVvJdTFowgT@cluster0.uiheq.mongodb.net/auth_db?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log(`connected to ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to MONGODB:', error.message);
    process.exit(1); // which means failure 0 is successful
  }
};
export default connection;

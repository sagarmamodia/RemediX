import app from "./app";
import { config } from "./src/config/index.config";
import { connectDb } from './src/config/startDbServer.config.js';

const HOST = "0.0.0.0"
const server = app.listen(config.port, HOST, () => {
    console.log(`✅ server running on port ${config.port}`);
})


// Connect to MongoDB
try{
  connectDb();
} catch(err){
  console.error(err);
  process.exit(1);
}

// Listen to OS signals
process.on('SIGTERM', () => {
  console.log('📄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔻 Process terminated');
  });
});
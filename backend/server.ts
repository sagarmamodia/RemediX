import app from "./app";
import { config } from "./src/config/index.config";

const HOST = "0.0.0.0"
const server = app.listen(config.port, HOST, () => {
    console.log(`✅ server running on port ${config.port}`);
})

process.on('SIGTERM', () => {
  console.log('📄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔻 Process terminated');
  });
});
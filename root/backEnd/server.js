const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Test database connection before starting server
const startServer = async () => {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();

        // Start server
        const server = app.listen(PORT, HOST, () => {
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚌 Injibara University Transport System Backend           ║
║                                                              ║
║   📡 Server running on: http://${HOST}:${PORT}              ║
║   🔗 API Base URL: http://${HOST}:${PORT}/api               ║
║   ❤️  Health Check: http://${HOST}:${PORT}/health           ║
║   📚 API Docs: http://${HOST}:${PORT}/api/docs              ║
║                                                              ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}     ║
║   ⏰ Started at: ${new Date().toLocaleString()}              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        const gracefulShutdown = async () => {
            console.log('\n📴 Received shutdown signal, closing gracefully...');
            
            server.close(async () => {
                console.log('🔌 HTTP server closed');
                await pool.end();
                console.log('💾 Database connections closed');
                console.log('👋 Shutdown complete');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                console.error('⚠️ Could not close connections in time, forcing shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('💥 Uncaught Exception:', error);
            gracefulShutdown();
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown();
        });

    } catch (error) {
        console.error('❌ Failed to connect to database:', error.message);
        console.error('Please check your database configuration and ensure MySQL is running');
        process.exit(1);
    }
};

// Start the server
startServer();
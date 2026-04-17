const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'transport-system'
}).promise();

async function fixPasswords() {
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ New hash generated for password: Admin@123');
    console.log('Hash:', hash);
    
    // Update all users with correct hash
    await pool.execute(
        "UPDATE users SET password_hash = ? WHERE email IN ('admin@transport.com', 'transport@transport.com', 'fleet@transport.com', 'staff@transport.com', 'student@transport.com', 'gate@transport.com')",
        [hash]
    );
    
    console.log('✅ All users password_hash updated!');
    
    // Verify
    const [users] = await pool.execute("SELECT email, password_hash FROM users");
    console.log('\n📋 Users in database:');
    users.forEach(user => {
        console.log(`   ${user.email} -> ${user.password_hash.substring(0, 30)}...`);
    });
    
    process.exit(0);
}

fixPasswords().catch(console.error);
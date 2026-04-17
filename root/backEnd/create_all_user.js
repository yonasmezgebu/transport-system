const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'transport-system'
}).promise();

async function createAllUsers() {
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    
    const users = [
        { email: 'admin@transport.com', name: 'System Administrator', phone: '0912345678', role: 'university_admin' },
        { email: 'transport@transport.com', name: 'Biruk Tesfaye', phone: '0912345679', role: 'transport_manager' },
        { email: 'fleet@transport.com', name: 'Meron Alemu', phone: '0912345680', role: 'fleet_officer' },
        { email: 'staff@transport.com', name: 'Abebe Kebede', phone: '0912345681', role: 'staff' },
        { email: 'student@transport.com', name: 'Selam Girmay', phone: '0912345682', role: 'student' },
        { email: 'gate@transport.com', name: 'Girmay Haile', phone: '0912345683', role: 'gate_guard' },
        { email: 'yonasmezgebu77@gmail.com', name: 'yonas mezgebu', phone: '0901407032', role: 'student' },
         { email: 'yonasmezgebu12@gmail.com', name: 'yonas mezgebu', phone: '0901407032', role: 'driver' }
    ];
    
    for (const user of users) {
        await pool.execute("DELETE FROM users WHERE email = ?", [user.email]);
        
        await pool.execute(`
            INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active) 
            VALUES (?, ?, ?, ?, (SELECT role_id FROM roles WHERE role_name = ?), 1)
        `, [user.email, hash, user.name, user.phone, user.role]);
        
        console.log(`✅ Created: ${user.email}`);
    }
    
    console.log('\n🎉 All users created successfully!');
    console.log('Password for all users: Admin@123');
    
    process.exit(0);
}

createAllUsers().catch(console.error);
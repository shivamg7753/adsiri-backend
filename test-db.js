const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '147.93.101.81',
  user: 'u882715919_root',
  password: 'Adsiri@password23',
  database: 'u882715919_adsiri_growth',
});

console.log('🔍 Testing database connection...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    connection.query('SELECT 1 as test', (err, results) => {
      if (err) {
        console.error('❌ Query test failed:', err.message);
      } else {
        console.log('✅ Query test passed:', results);
      }
      connection.end();
    });
  }
}); 
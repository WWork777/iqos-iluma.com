import mysql from 'mysql2/promise'

const pool = mysql.createPool({
	host: '89.111.152.188',
	user: 'admin',
	password: 'Admin@7681',
	database: 'iluma',
	port: '3306',
})

export default pool

require('dotenv').config()
const dev01 = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,  // Make sure this is loading the correct password
  port: process.env.DB_PORT || 5432,
  ssl: { //using ssl
    require: true,
    rejectUnauthorized: false // Allow self-signed certificates
  }
}

exports.connectionString = (license) => {

  let xresult = dev01;
  switch (license) {

    default:
      xresult = dev01;
      break;
  }

  return xresult;
}

/*const dev01 = {
   host: 'localhost',
   port: 5432,
   user: 'postgres',
   password: '090773',
   database: 'SeniorProj',
 } */

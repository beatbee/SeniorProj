const dev01 = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '090773',
    database: 'SeniorProj',
  }
  
  exports.connectionString = (license) => {
  
    let xresult = dev01;
    switch (license)
    {

      default:
        xresult = dev01;
        break;
    }
  
    return xresult;
  }
  
  
  
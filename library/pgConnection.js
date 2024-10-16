const {
    Pool
} = require('pg')

exports.execute = async (dbname, script, connectionstring) => {
    //execute data
    //debugger;
    let temporary = JSON.parse(JSON.stringify(connectionstring))
    if (dbname != null) {
        temporary.database = dbname
        print('this is' + temporary.database);
    }
    try {
        var pool = new Pool(temporary)
        const client = await pool.connect()
        try {
            const res = await client.query(script)
            console.log("execute action: " + res.rowCount + " row(s)");
            return {
                code: false,
                rowaction: res.rowCount
            }

        } catch (e) {
            console.log(script + ' : error code : ' + e.code + ' err.message : ' + e.message)

            if (e.code == '23505' || e.code == '42P04')
            {
                return {
                    code: false,
                    rowaction: 0
                }
            }
            else
            {
                return {
                    code: true,
                    message: e.message
                }
            }



        } finally {
            client.release()
        }
    } catch (error) {
        console.log(script + ' : error code : ' + error.code + ' err.message : ' + error.message)
        return {
            code: true,
            message: error.message
        }
    }
}

exports.get = async (dbname, script, connectionstring) => {
    //get data
    let temporary = JSON.parse(JSON.stringify(connectionstring))
    if (dbname != null) {
        temporary.database = dbname
    }
    
    try {
        var pool = new Pool(temporary)
        const client = await pool.connect()
        try {
            const res = await client.query(script)
            return { code: false, data: res.rows }

        } catch (e) {
            console.log(script + ' : error code : ' + e.code + ' err.message : ' + e.message)
            return {
                code: true,
                message: e.message
            }
        } finally {
            client.release()
        }
    } catch (error) {
        console.log(script + ' : error code : ' + error.code + ' err.message : ' + error.message)
        return {
            code: true,
            message: error.message
        }
    }
}
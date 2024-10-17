const config = require('../../configuration/connection');
const pgDb = require('../../library/pgConnection');
const moment = require('moment');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()


exports.authUser = async (req, res, next) => {
    let license = req.header('license') == undefined ? 'dev01' : req.header('license');

    try {
        let { user_id, password } = req.body[0];
        if (user_id == undefined || password == undefined) {
            let response = [{
                status: 'error',
                invalid_code: '-1',
                message: 'ไม่สามารถเพิ่มข้อมูลได้, เนื่องจากข้อมูลพารามิเตอร์ไม่ถูกต้อง',
                response_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }];
            res.status(400).send(response);
        } else {
            /*const comparePassword = async (candidate, hashPassword) => {
                return bcrypt.compareSync(candidate, hashPassword);
            };*/

            if (user_id && password) {
                let script = `SELECT * FROM users WHERE user_id = '${user_id}' AND role_id != '1';`;
                let tbl_temporary = await pgDb.get(null, script, config.connectionString(license));

                if (!tbl_temporary.code && tbl_temporary.data.length > 0) {
                    //const isPasswordCorrect = await comparePassword(password, tbl_temporary.data[0].password);

                    if (password == tbl_temporary.data[0].password) {
                        const user = { id: user_id };  // Can include more user info as payload
                        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                        // Set JWT token as an HTTP-only cookie
                        res.cookie('token', accessToken, {
                            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
                            secure: process.env.NODE_ENV === 'production',  // Send only over HTTPS in production
                            maxAge: 3600000  // 1 hour expiration
                        });

                        let response = [{
                            status: 'success',
                            invalid_code: '0',
                            message: 'Login successful',
                            data: '',
                            response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                        }];
                        res.status(200).send(response);
                        return;
                    } else {
                        let response = [{
                            status: 'error',
                            invalid_code: '-3',
                            message: 'Incorrect password or user does not exist',
                            response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                        }];
                        res.status(400).send(response);
                    }
                } else {
                    let response = [{
                        status: 'error',
                        invalid_code: '-3',
                        message: 'User not found or invalid role',
                        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    }];
                    res.status(400).send(response);
                }
            } else {
                let response = [{
                    status: 'error',
                    invalid_code: '-3',
                    message: 'User ID or password is missing',
                    response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }];
                res.status(400).send(response);
            }
        }
    } catch (error) {
        console.log(error);
        let response = [{
            status: 'error',
            invalid_code: '-4',
            message: 'Unable to process the request',
            response_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }];
        res.status(500).send(response);
    }
};


exports.authWorker = async (req, res, next) => {
    let license = req.header('license') == undefined ? 'dev01' : req.header('license');

    try {
        let { user_id } = req.body[0];
        if (user_id == undefined) {
            let response = [{
                status: 'error',
                invalid_code: '-1',
                message: 'ไม่สามารถเพิ่มข้อมูลได้, เนื่องจากข้อมูลพารามิเตอร์ไม่ถูกต้อง',
                response_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }];
            res.status(400).send(response);
        } else {
            /*const comparePassword = async (candidate, hashPassword) => {
                return bcrypt.compareSync(candidate, hashPassword);
            };*/

            if (user_id) {
                let script = `SELECT * FROM users WHERE user_id = '${user_id}' AND role_id == '1';`;
                let tbl_temporary = await pgDb.get(null, script, config.connectionString(license));

                if (!tbl_temporary.code && tbl_temporary.data.length > 0) {
                    //const isPasswordCorrect = await comparePassword(password, tbl_temporary.data[0].password);
                    const user = { id: user_id };  // Can include more user info as payload
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                    // Set JWT token as an HTTP-only cookie
                    res.cookie('token', accessToken, {
                        httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
                        secure: process.env.NODE_ENV === 'production',  // Send only over HTTPS in production
                        maxAge: 3600000  // 1 hour expiration
                    });

                    let response = [{
                        status: 'success',
                        invalid_code: '0',
                        message: 'Login successful',
                        data: '',
                        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    }];
                    res.status(200).send(response);
                    return;

                } else {
                    let response = [{
                        status: 'error',
                        invalid_code: '-3',
                        message: 'User not found or invalid role',
                        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    }];
                    res.status(400).send(response);
                }
            } else {
                let response = [{
                    status: 'error',
                    invalid_code: '-3',
                    message: 'User ID or password is missing',
                    response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }];
                res.status(400).send(response);
            }
        }
    } catch (error) {
        console.log(error);
        let response = [{
            status: 'error',
            invalid_code: '-4',
            message: 'Unable to process the request',
            response_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }];
        res.status(500).send(response);
    }
};
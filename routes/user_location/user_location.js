const config = require('../../configuration/connection');
const pgDb = require('../../library/pgConnection');
const moment = require('moment');


exports.postgpsdata = async (req, res, next) => {
    console.log('Request body:', req.body[0]);
    let license = req.header('license') == undefined ? 'dev01' : req.header('license');
    let xresult = [
        {

            user_latitude: "",
            user_longitude: "",
            location_id: ""
        }
    ];

    try {
        let { user_latitude, user_longitude, location_id } = req.body[0];

        if (user_latitude == undefined || user_longitude == undefined || location_id == undefined) {
            let response = [{
                status: 'error',
                invalid_code: '-1',
                message: 'ไม่สามารถเพิ่มข้อมูลได้, เนื่องจากข้อมูลพารามิเตอร์ไม่ถูกต้อง',
                data: xresult,
                response_time: moment().format('YYYY-MM-DD HH:mm:ss')
            }];
            res.status(200).send(response);
        } else {

            if (user_latitude != '' && user_longitude != '' && location_id != '') {
                let script = `  INSERT INTO user_location (location_id, user_task_id,timestamp, location, location_status)
                                VALUES (
                                    '${location_id}', 
                                    'task_001', 
                                    NOW(),
                                    ST_GeomFromText('POINT(${user_longitude} ${user_latitude})', 4326), 
                                    (SELECT 
                                        CASE 
                                            WHEN ST_Contains(
                                                ST_GeomFromText('POLYGON((100.5826138669438 13.836755417300239, 
                                                100.5826138669438 13.83609653727514, 
                                                100.5832480856169 13.83609653727514, 
                                                100.5832480856169 13.836755417300239, 
                                                100.5826138669438 13.836755417300239))', 4326),
                                                ST_GeomFromText('POINT(100.583000 13.837000)', 4326)
                                            ) THEN 1 ELSE 0 
                                        END
                                    )
                                )`;
                //let script = `  select user_id, user_type, user_name, user_firstname, user_lastname, user_email, user_phonno, user_image_id, user_reg_date, user_md_date from user_account where user_email = '${user_email}' and user_status = '1';`;
                let tbl_temporary = await pgDb.get(null, script, config.connectionString(license));

                if (!tbl_temporary.code) {
                    tbl_temporary.data = JSON.parse(JSON.stringify(tbl_temporary.data).replace(/\:null/gi, "\:\"\""));

                    let response = [{
                        status: 'success',
                        invalid_code: '0',
                        message: 'post data success',
                        data: tbl_temporary.data,
                        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    }];
                    res.status(200).send(response);
                    return;
                } else {
                    let response = [{
                        status: 'error',
                        invalid_code: '-3',
                        message: `ไม่สามารถตรวจสอบข้อมูล`,
                        data: xresult,
                        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    }];
                    res.status(200).send(response);
                    return;
                }
            }
            else {
                let response = [{
                    status: 'error',
                    invalid_code: '-3',
                    message: `ไม่สามารถตรวจสอบข้อมูล`,
                    data: xresult,
                    response_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }];
                res.status(200).send(response);
                return;
            }
        }
    } catch (error) {
        console.log(error);
        let response = [{
            status: 'error',
            invalid_code: '-4',
            message: `ไม่สามารถดึงข้อมูล`,
            data: xresult,
            response_time: moment().format('YYYY-MM-DD HH:mm:ss').toString()
        }];
        res.status(200).send(response);
    }
};

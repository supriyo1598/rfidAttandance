const { conn, asyncQuery } = require('./dbcontroller');

const attend = async(req, res) => {
    /**
     * URL pattern: localhost:5000/attend?uid=<uid_value>
     * 
     * Two records for a specific card uid for a specific day (entry & exit) is permissible into 
     * attendance table. An entry after 10:30pm is considered to be a late entry. Exit records are 
     * not consodered to be late or early.
     */
    var uid = req.query.uid;
    try {
        // Checking if the attending card is registered or not
        var result = await asyncQuery(`select * from teacher where uid='${req.query.uid}'`);
        if (result.length != 0) {
            // When the card is registered, checking if 'en'(entry) attendance is already there for the current day
            var d = new Date(), m, day;
            if (d.getMonth() < 10) m = '0' + (d.getMonth() + 1);
            else m = d.getMonth();
            if (d.getDate() < 10) day = '0' + d.getDate();
            else day = d.getDate();
            var time = `${d.getFullYear()}-${m}-${day}`;
            
            result = await asyncQuery(`
                select * from attendance
                where
                    entry_time like '${time} %' and
                    uid = '${uid}'
            `)
            
            if (result.length == 0) {
                // Entry time does not exist for this card for the current date
                await asyncQuery(`
                    insert into attendance(uid, entry_time) values(
                        '${uid}',
                        current_timestamp
                    );
                `);
                res.json({ success: true, msg: `entry for ${uid}` });
            } else {
                // When there is already a record for entry for the current day, checking whether a record for exit also exists or not
                result = await asyncQuery(`
                    select * from attendance
                    where
                        entry_time like '${time} %' and
                        uid = '${uid}';
                `);
                if (!result[0].exit_time) {
                    await asyncQuery(`
                        update attendance
                        set exit_time = current_timestamp
                        where uid='${uid}';
                    `);
                    res.json({ success: true,  msg: `exit for ${uid}` });
                } else {
                    res.json({ success: true, msg: `${uid} already exited for this day` });
                }
            }
        } else {
            // When the card is not registered
            res.json({ success: true, msg: "not registered" });
        }
    } catch (e) {
        res.json({ success: false, err_msg: e });
    }
}


module.exports = {
    attend
}
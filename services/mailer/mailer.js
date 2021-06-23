const nodemailer = require('nodemailer');
const pendingWishes = require('../../sharedData.js');

const sendMessage = () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'patricia.legros@ethereal.email',
            pass: 'qnQBHhxvt3rmMrdrQ8'
        }
    });
    
    const message = {
        from: 'do_not_reply@northpole.com',
        to: 'santa@northpole.com',
        subject: 'Pending Wishes!',
    }
    
    let pWishes = pendingWishes.map(wish => Object.keys(wish).map(key => ` ${data[key]}`).join("/br"));
    let text = `
    Dear Santa,

        You have following pending wishes to be granted! Hurry!
        ${pWishes}
    `;
    message.text = text;
    console.log(transporter);
    console.log(JSON.stringify(transporter));
    transporter.send(message);
}

module.exports = { sendMessage };



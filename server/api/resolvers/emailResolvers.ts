import nodemailer from "nodemailer";

import { DonationForm, DonationFormInterface } from "../../database/models/donationFormModel";

async function sendConfirmationEmail(firstName: string, lastName: string, email: string) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });
    const htmlString = `Dear ${firstName} ${lastName}, thx for donation`;
    const info = await transporter.sendMail({
        from: '"no reply 👻" <no-reply@pregnancycentre.ca>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: htmlString // html body
    });

    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const emailResolvers = {
    sendConfirmationEmail: async (_, { id }): Promise<string> => {
        const object = await DonationForm.findById(id).exec();
        console.log(object);
        console.log(object.contact.email);
        sendConfirmationEmail(
            object.contact.firstName, 
            object.contact.lastName, 
            object.contact.email).catch(console.error);
        return "sent!";
    }
};

export { emailResolvers };

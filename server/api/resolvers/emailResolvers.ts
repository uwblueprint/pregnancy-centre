import nodemailer from "nodemailer";

import { DonationForm } from "../../database/models/donationFormModel";

interface Item {
    name: string;
    quantity: number;
}

async function sendConfirmationEmail(firstName: string, lastName: string, email: string, items: Array<Item>) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "blueprintpregnancycentre@gmail.com",
            pass: "pregnancycentre"
        }
    });
    let htmlString = `<body><p>Dear ${firstName} ${lastName}, <p>`;
    htmlString += "<p>Thank you for submitting a donation form.</p>";
    htmlString += "<table> <tr> <th> <p>Item</p> </th> <th> <p>Quantity</p> </th> </tr>";
    items.forEach((item) => {
        htmlString += `<tr> <td>${item.name}</td> <td> ${item.quantity} </td> </tr>`;
    });

    htmlString += "</table> <br>The Pregnancy Centre</body>";

    const info = await transporter.sendMail({
        from: '"no reply " <no-reply@pregnancycentre.ca>', // sender address
        to: "kevinwang@uwblueprint.org", // list of receivers
        subject: "Donation form confirmation", // Subject line
        text: "Hello world?", // plain text body
        html: htmlString // html body
    });

    console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const emailResolvers = {
    sendConfirmationEmail: async (_, { ids }): Promise<string> => {
        const object = await DonationForm.findById(ids[0]).exec();
        const firstName = object.contact.firstName;
        const lastName = object.contact.lastName;
        const email = object.contact.email;
        const firstItem = { name: object.name, quantity: object.quantity };
        const promises = [];
        for (let i = 1; i < ids.length; ++i) {
            promises.push(DonationForm.findById(ids[i]).exec());
        }
        Promise.all(promises).then((res) => {
            console.log(res);
            const remainingItems = res.map((form) => ({ name: form.name, quantity: form.quantity }));
            sendConfirmationEmail(firstName, lastName, email, [firstItem, ...remainingItems]).catch(console.error);
        });
        return "sent!";
    }
};

export { emailResolvers };

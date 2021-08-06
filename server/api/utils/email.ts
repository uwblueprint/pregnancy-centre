import nodemailer from "nodemailer";

interface Item {
    name: string;
    quantity: number;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "blueprintpregnancycentre@gmail.com", // TODO: Change later once TPC gives us an email address
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendApprovalEmail(firstName: string, lastName: string, email: string, item: Item) {
    let htmlString = `<body><p>Dear ${firstName} ${lastName}, <p>`;
    htmlString += `<p>Your donation form of ${item.quantity} ${
        item.name + (item.quantity == 1 ? "" : "s")
    } has been approved. Contact rebecca@pregnancycentre.ca to make further emails.</p>`;

    htmlString += "The Pregnancy Centre</body>";

    await transporter.sendMail({
        from: '"no reply " <no-reply@pregnancycentre.ca>', // sender address
        to: email, // list of receivers
        subject: "Pregnancy Centre: Donation form approval", // Subject line
        text: "Thank you for submitting a donation form.", // plain text body
        html: htmlString // html body
    });
}

async function sendConfirmationEmail(firstName: string, lastName: string, email: string, items: Array<Item>) {
    let htmlString = `<body><p>Dear ${firstName} ${lastName}, <p>`;
    htmlString += "<p>Thank you for submitting a donation form.</p>";
    htmlString += "<table> <tr> <th> <p>Item</p> </th> <th> <p>Quantity</p> </th> </tr>";
    items.forEach((item) => {
        htmlString += `<tr> <td>${item.name}</td> <td> ${item.quantity} </td> </tr>`;
    });

    htmlString += "</table> <br>The Pregnancy Centre</body>";

    await transporter.sendMail({
        from: '"no reply " <no-reply@pregnancycentre.ca>', // sender address
        to: email, // list of receivers
        subject: "Pregnancy Centre: Donation form confirmation", // Subject line
        text: "Thank you for submitting a donation form.", // plain text body
        html: htmlString // html body
    });
}

export { sendApprovalEmail, sendConfirmationEmail };

import nodemailer from "nodemailer";

interface Item {
    name: string;
    condition: string;
    age: number;
    quantity: number;
    description: string;
}

const getItemAgeDescription = (age: number): string => {
    const descriptionArr = ["Less than a year", "1 year", "2 years", "3 years", "More than 3 years"];
    if (age < 0) {
        return descriptionArr[0];
    }
    if (age >= descriptionArr.length) {
        return descriptionArr[descriptionArr.length - 1];
    }
    return descriptionArr[age];
};

const transporter = nodemailer.createTransport({
    host: "pregnancycentre.ca",
    auth: {
        user: "noreply@pregnancycentre.ca", // TODO: Change later once TPC gives us an email address
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendRejectionEmail(firstName: string, lastName: string, email: string, item: Item) {

}

async function sendApprovalEmail(firstName: string, lastName: string, email: string, item: Item) {
    let htmlString = `
        <body><p>Dear ${firstName} ${lastName}, <p>
        <p>After reviewing your donation form, we would like to accept the following items to meet a client's needs.</p>
        <p>Donated item: ${item.name}<br>
        Condition of Item: ${item.condition}<br>
        Age of item: ${getItemAgeDescription(item.age)}<br>
        Quantity: ${item.quantity}<br>
    `;
    if (item.description != null) {
        htmlString += `Item Description: ${item.description}`;
    }
    htmlString +=
        '</p><p>Please drop off the items to TPC’s location at 40 Francis Street South, Kitchener, ON N2G 2A2. To confirm current hours please see the website at <a href="https://pregnancycentre.ca/">Home - The Pregnancy Centre.</a></p>The Pregnancy Centre</body>';

    await transporter.sendMail({
        from: '"no-reply " <no-reply@pregnancycentre.ca>', // sender address
        to: email, // list of receivers
        subject: "TPC's Donation Review", // Subject line
        text: "Your donation form has been approved", // plain text body
        html: htmlString // html body
    });
}

async function sendConfirmationEmail(firstName: string, lastName: string, email: string, items: Array<Item>) {
    let htmlString = `<body><p>Dear ${firstName} ${lastName}, <p>`;
    htmlString += "<p>Here is a review of your donation form:</p>";

    items.forEach((item) => {
        htmlString += `<p>Donated item: ${item.name}<br>
        Condition of Item: ${item.condition}<br>
        Age of item: ${getItemAgeDescription(item.age)}<br>
        Quantity: ${item.quantity}<br>`;
        if (item.description != null) {
            htmlString += `Item Description: ${item.description}`;
        }
        htmlString += "</p>";
    });

    htmlString +=
        "<p>Next steps:</p><p>TPC will be reviewing your donation form and will notify you regarding donation approval and drop off details. If you have any questions or concerns, feel free to reach out to rebecca@thepregnancycentre.ca</p>The Pregnancy Centre</body>";

    await transporter.sendMail({
        from: '"no-reply " <no-reply@pregnancycentre.ca>', // sender address
        to: email, // list of receivers
        subject: "Thank you for submitting your Donation Form!", // Subject line
        text: "Thank you for submitting a donation form.", // plain text body
        html: htmlString // html body
    });
}

export { sendApprovalEmail, sendConfirmationEmail, sendRejectionEmail };

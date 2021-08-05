import { sendApprovalEmail, sendConfirmationEmail } from "../utils/email";
import { DonationForm } from "../../database/models/donationFormModel";

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
    },
    sendApprovalEmail: async (_, { id }): Promise<string> => {
        const object = await DonationForm.findById(id).exec();
        const firstName = object.contact.firstName;
        const lastName = object.contact.lastName;
        const email = object.contact.email;
        const firstItem = { name: object.name, quantity: object.quantity };
        sendApprovalEmail(firstName, lastName, email, firstItem).catch(console.error);
        return "approved!";
    }
};

export { emailResolvers };

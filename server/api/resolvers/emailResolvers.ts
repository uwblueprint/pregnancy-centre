import { sendApprovalEmail, sendConfirmationEmail } from "../utils/email";
import { DonationForm } from "../../database/models/donationFormModel";

const emailResolvers = {
    sendConfirmationEmail: async (_, { ids }): Promise<string> => {
        const object = await DonationForm.findById(ids[0]).exec();
        if (object == null) {
            return `Error: Donation form id ${ids[0]} not found`;
        }
        const { firstName, lastName, email } = object.contact;
        const firstItem = {
            name: object.name,
            quantity: object.quantity,
            condition: object.condition,
            age: object.age,
            description: object.description
        };
        const promises = [];
        for (let i = 1; i < ids.length; ++i) {
            promises.push(DonationForm.findById(ids[i]).exec());
        }
        Promise.all(promises).then((res) => {
            const remainingItems = res.map((form) => ({
                name: form.name,
                quantity: form.quantity,
                condition: form.condition,
                age: form.age,
                description: form.description
            }));
            sendConfirmationEmail(firstName, lastName, email, [firstItem, ...remainingItems]).catch(console.error);
        });
        return "sent!";
    },
    sendApprovalEmail: async (_, { id }): Promise<string> => {
        const object = await DonationForm.findById(id).exec();
        if (object == null) {
            return `Error: Donation form id ${id} not found`;
        }
        const { firstName, lastName, email } = object.contact;
        const firstItem = {
            name: object.name,
            quantity: object.quantity,
            condition: object.condition,
            age: object.age,
            description: object.description
        };
        sendApprovalEmail(firstName, lastName, email, firstItem).catch(console.error);
        return "approved!";
    }
};

export { emailResolvers };

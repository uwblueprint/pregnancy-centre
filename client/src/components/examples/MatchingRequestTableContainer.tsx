import React, { FunctionComponent, useEffect, useState } from "react";

import { DonationForm, ItemCondition } from "../../data/types/donationForm";
import DonationMatchingRequestsTable from "../molecules/DonationMatchingRequestsTable";
import Request from "../../data/types/request";

export const sampleDonationForms: DonationForm[] = [
    {
        _id: "60fcbbee3e3ece32ac7be355",
        contact: {
            firstName: "Pink",
            lastName: "Reynolds",
            email: "Brock92@yahoo.com",
            phoneNumber: "941-810-7468"
        },
        name: "Soap",
        description: "Voluptatibus aspernatur cum inventore consequatur sapiente et et ullam.",
        requestGroup: {
            _id: "60fcbbef3e3ece32ac7be35d"
        },
        quantity: 11,
        quantityRemaining: 8,
        age: 18,
        condition: ItemCondition.BRAND_NEW,
        createdAt: 1548834531667,
        donatedAt: 1548834531667
    },
    {
        _id: "60fcbbef3e3ece32ac7be357",
        contact: {
            firstName: "Ed",
            lastName: "Morissette",
            email: "Vinnie_Parisian@yahoo.com",
            phoneNumber: "474-426-5414"
        },
        name: "Towel",
        description: "Saepe voluptatum et sint suscipit qui sunt.",
        requestGroup: null,
        quantity: 8,
        quantityRemaining: 5,
        age: 5,
        condition: ItemCondition.FAIR,
        createdAt: 1618956689867,
        donatedAt: 1618956689867
    },
    {
        _id: "60fcbbef3e3ece32ac7be359",
        contact: {
            firstName: "Elvera",
            lastName: "Osinski",
            email: "Lue_Quitzon20@yahoo.com",
            phoneNumber: "663-643-2885"
        },
        name: "Car",
        description: "Voluptatibus dolore dignissimos et.",
        requestGroup: null,
        quantity: 11,
        quantityRemaining: 11,
        age: 11,
        condition: ItemCondition.BRAND_NEW,
        createdAt: 1614159243916,
        donatedAt: 1614159243916
    },
    {
        _id: "60fcbbef3e3ece32ac7be35b",
        contact: {
            firstName: "Hadley",
            lastName: "Kemmer",
            email: "Ted_Gibson89@yahoo.com",
            phoneNumber: "553-753-0893"
        },
        name: "Hat",
        description: "Nemo dolor sed quia ut.",
        requestGroup: null,
        quantity: 3,
        quantityRemaining: 3,
        age: 2,
        condition: ItemCondition.POOR,
        createdAt: 1551481112686,
        donatedAt: 1551481112686
    },
    {
        _id: "60fcbbef3e3ece32ac7be35f",
        contact: {
            firstName: "Trenton",
            lastName: "Bergnaum",
            email: "Harry20@hotmail.com",
            phoneNumber: "744-477-0086"
        },
        name: "Stroller",
        description: "Ipsum est distinctio veritatis distinctio mollitia tempore autem provident.",
        requestGroup: {
            _id: "60fcbbef3e3ece32ac7be35d"
        },
        quantity: 15,
        quantityRemaining: 15,
        age: 0,
        condition: ItemCondition.GREAT,
        createdAt: 1615517307047,
        donatedAt: 1615517307047
    }
];

export const sampleRequests: Request[] = [];
// export const sampleRequests: Request[] = [
//     {
//         _id: "60e3b9596cd5ae8396bd3f55",
//         quantity: 9,
//         clientName: "Addie Romaguera",
//         requestType: {
//             _id: "60e3b9596cd5ae8396bd3f53"
//         },
//         createdAt: new Date(1567389552450),
//         deleted: false,
//         fulfilled: false,
//         matchedDonations: [
//             { donationForm: "60fcbbef3e3ece32ac7be35f", quantity: 3 },
//             { donationForm: "60fcbbef3e3ece32ac7be35b", quantity: 1 }
//         ]
//     },
//     {
//         _id: "60e3b95a6cd5ae8396bd3f57",
//         quantity: 14,
//         clientName: "Guido Ondricka",
//         requestType: {
//             _id: "60e3b9596cd5ae8396bd3f53"
//         },
//         createdAt: new Date(1621656539902),
//         deleted: false,
//         fulfilled: false,
//         matchedDonations: [{ donationForm: "60fcbbef3e3ece32ac7be357", quantity: 2 }]
//     },
//     {
//         _id: "60e3b95a6cd5ae8396bd3f59",
//         quantity: 7,
//         clientName: "Prince Sawayn",
//         requestType: {
//             _id: "60e3b9596cd5ae8396bd3f53"
//         },
//         createdAt: new Date(1579697012390),
//         deleted: false,
//         fulfilled: false,
//         matchedDonations: [{ donationForm: "60fcbbef3e3ece32ac7be357", quantity: 3 }]
//     },
//     {
//         _id: "60e3b95a6cd5ae8396bd3f5b",
//         quantity: 10,
//         clientName: "Wilma Boyer",
//         requestType: {
//             _id: "60e3b9596cd5ae8396bd3f53"
//         },
//         createdAt: new Date(1608736758629),
//         deleted: false,
//         fulfilled: false,
//         matchedDonations: [{ donationForm: "60fcbbee3e3ece32ac7be355", quantity: 3 }]
//     },
//     {
//         _id: "60e3b95a6cd5ae8396bd3f5d",
//         quantity: 3,
//         clientName: "Mariane Beer",
//         requestType: {
//             _id: "60e3b9596cd5ae8396bd3f53"
//         },
//         createdAt: new Date(1566586665253),
//         deleted: false,
//         fulfilled: false,
//         matchedDonations: [{ donationForm: "60fcbbef3e3ece32ac7be357", quantity: 1 }]
//     }
// ];

const MatchingRequestTableContainer: FunctionComponent<Record<string, never>> = () => {
    const [requests, setRequests] = useState(sampleRequests);
    const [donationForms, setDonationForms] = useState(sampleDonationForms);
    const [curDonationForm, setCurDonationForm] = useState(donationForms[1]);

    useEffect(() => {
        // just here to prevent eslint warnings
        setDonationForms(donationForms);
        setCurDonationForm(donationForms[1]);
    }, []);

    const onQuantitySelected = (quantity: number, requestId: string) => {
        // find the index of the updated request
        const reqIndex = requests.findIndex((req) => req._id == requestId);
        const req = requests[reqIndex];

        const contributionIndex = req?.matchedDonations?.findIndex(
            (contrib) => contrib.donationForm == curDonationForm._id
        ) as number;

        // update the matching selection
        const newMatches = req?.matchedDonations;
        if (newMatches) {
            if (contributionIndex != -1) {
                newMatches[contributionIndex].quantity = quantity;
            } else {
                newMatches.push({ donationForm: curDonationForm._id as string, quantity });
            }
        }

        // update requests with new donation matches
        setRequests([
            ...requests.slice(0, reqIndex),
            {
                ...req,
                matchedDonations: newMatches
            },
            ...requests.slice(reqIndex + 1)
        ]);
    };

    return (
        <div
            style={{
                marginTop: "30px",
                marginLeft: "30px",
                display: "flex",
                flexDirection: "column",
                width: "60%"
            }}
        >
            <h3>Not currently matching</h3>
            <DonationMatchingRequestsTable
                donationForm={curDonationForm}
                requests={requests}
                onQuantitySelected={() => {}}
                isMatching={false}
                isErroneous={false}
            />

            <h3>Matching - No Errors</h3>
            <DonationMatchingRequestsTable
                requests={requests}
                donationForm={curDonationForm}
                onQuantitySelected={() => {}}
                isMatching={true}
                isErroneous={false}
            />

            <h3>Matching - Error</h3>
            <DonationMatchingRequestsTable
                requests={requests}
                donationForm={curDonationForm}
                onQuantitySelected={() => {}}
                isMatching={true}
                isErroneous={true}
            />
        </div>
    );
};

export default MatchingRequestTableContainer;

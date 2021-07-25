import React, { FunctionComponent, useEffect, useState } from "react";
import moment from "moment";
import Table from "react-bootstrap/Table";

import { DonationForm } from "../../data/types/donationForm";
import Request from "../../data/types/request";
import ScrollableDropdown from "../atoms/ScrollableDropdown";
import { TextField } from "../atoms/TextField";

interface Props {
    requests: Request[];
    donationForm?: DonationForm;
    isErroneous: boolean; // indicates whether the selected quantities are erroneous
    onQuantitySelected: (newQuantity: number, requestId: string) => void;
}

type RequestQuantities = {
    quantity: number; // current value selected in dropdown
    totalRequired: number; // total unmatched requests
};

const DonationMatchingRequestsTable: FunctionComponent<Props> = (props: Props) => {
    const headingList = ["Client Name", "Quantity", "Total Required", "Date Requested"];

    const [requests, setRequests] = useState<Request[]>([]);
    const [reqCurrentlyEditing, setReqCurrentlyEditing] = useState<string>("");

    useEffect(() => {
        // sort requests by most recent date
        const sortedRequests: Request[] = props.requests
            .filter((request) => !request.deleted && !request.fulfilled)
            .sort((a, b) => {
                return b!.createdAt!.valueOf() - a!.createdAt!.valueOf();
            });
        setRequests(sortedRequests);
    }, []);

    /**
     * Calculates the numerical values to display in the table row for a specific request
     */
    const valuesToDisplay = (request: Request): RequestQuantities => {
        const { matchedDonations } = request;

        const totalQuantityMatched = matchedDonations?.reduce((total, contribution) => {
            return total + contribution.quantity;
        }, 0) as number;

        const requestTotal = request?.quantity ?? 0;
        const totalRequired = requestTotal - totalQuantityMatched;

        if (props.donationForm) {
            // calculate the number of items assigned to the current item being matched
            const quantityAssignedToForm = matchedDonations?.reduce((total, contribution) => {
                return contribution.donationForm == props?.donationForm?._id ? total + contribution.quantity : total;
            }, 0);

            return {
                quantity: quantityAssignedToForm as number,
                totalRequired
            };
        }
        return {
            quantity: totalQuantityMatched,
            totalRequired
        };
    };

    const isQuantityErroneous = (values: RequestQuantities): boolean => {
        const { quantity } = values;
        return quantity > 0 && props.isErroneous;
    };

    const maxDropdownQuantity = (values: RequestQuantities): number => {
        const { quantity, totalRequired } = values;
        return quantity + totalRequired;
    };

    const onQuantityChange = (quantity: number, requestId: string) => {
        props.onQuantitySelected(quantity, requestId);
        setReqCurrentlyEditing("");
    };

    return (
        <div className="donation-matching-request-list">
            <Table responsive className="donation-matching-request-table">
                <thead>
                    <tr>
                        {headingList.map((heading, index) => (
                            <th key={index}>{heading}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, _) => {
                        const values = valuesToDisplay(request);
                        const isErroneous = isQuantityErroneous(values);
                        const maxSelection = maxDropdownQuantity(values);
                        const { quantity, totalRequired } = values;
                        return (
                            <tr key={request._id}>
                                <td className="row-text semibold">{request?.clientName ?? "N/A"}</td>
                                <td
                                    className={
                                        "item-quantity" +
                                        (props.donationForm ? "-selection" : "-display") +
                                        (isErroneous ? " error" : "")
                                    }
                                >
                                    {isErroneous && <i className="bi bi-exclamation-circle alert-icon" />}
                                    {props.donationForm ? (
                                        <ScrollableDropdown
                                            trigger={
                                                <TextField
                                                    input={quantity}
                                                    isDisabled={false}
                                                    isErroneous={isErroneous}
                                                    onChange={() => {}}
                                                    name="quantity"
                                                    type="text"
                                                    placeholder=""
                                                    readOnly={true}
                                                    iconClassName="bi bi-caret-down-fill"
                                                />
                                            }
                                            dropdownItems={Array.from(
                                                { length: maxSelection + 1 },
                                                (_, index) => index
                                            ).map((value, index) => (
                                                <span
                                                    key={index}
                                                    onClick={() => onQuantityChange(value, request._id as string)}
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                            onDropdownOpen={() => {
                                                setReqCurrentlyEditing(request._id as string);
                                            }}
                                            onDropdownClose={() => {
                                                setReqCurrentlyEditing("");
                                            }}
                                            isDropdownOpened={request._id === reqCurrentlyEditing}
                                        />
                                    ) : (
                                        <TextField
                                            input={quantity}
                                            isDisabled={true}
                                            isErroneous={false}
                                            onChange={() => {}}
                                            name="quantity"
                                            type="text"
                                            placeholder=""
                                            readOnly={true}
                                        />
                                    )}
                                </td>
                                <td className="row-text hidden">{`${totalRequired}/${request.quantity}`}</td>
                                <td className="row-text">{moment(request.createdAt, "x").format("MMMM DD, YYYY")}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default DonationMatchingRequestsTable;

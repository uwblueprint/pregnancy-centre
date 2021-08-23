import React, { FunctionComponent, useState } from "react";
import moment from "moment";
import Table from "react-bootstrap/Table";

import { DonationForm } from "../../data/types/donationForm";
import Request from "../../data/types/request";
import ScrollableDropdown from "../atoms/ScrollableDropdown";
import { TextField } from "../atoms/TextField";

interface Props {
    requests: Request[];
    donationForm: DonationForm;
    showAssignedMatchesOnly?: boolean; // only display the quantity assigned to the specific donation form
    isMatching: boolean;
    isErroneous: boolean; // indicates whether the selected quantities are erroneous
    onQuantitySelected: (newQuantity: number, request: Request) => void;
}

type RequestQuantities = {
    quantity: number; // current value selected in dropdown
    totalRequired: number; // total unmatched requests
};

const DonationMatchingRequestsTable: FunctionComponent<Props> = (props: Props) => {
    const headingList = props.donationForm.requestGroup
        ? ["Client Name", "Quantity", "Total Required", "Date Requested"]
        : ["Client Name", "Item Name", "Quantity", "Total Required", "Date Requested"];

    const [reqCurrentlyEditing, setReqCurrentlyEditing] = useState<string>("");

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

        if (props.isMatching || props.showAssignedMatchesOnly) {
            // calculate the number of items assigned to the current item being matched
            const quantityAssignedToForm = matchedDonations?.reduce((total, contribution) => {
                return contribution.donationForm === props?.donationForm?._id ? total + contribution.quantity : total;
            }, 0);

            return {
                quantity: quantityAssignedToForm!,
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

    const onQuantityChange = (quantity: number, request: Request) => {
        props.onQuantitySelected(quantity, request);
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
                    {props.requests.map((request, _) => {
                        const values = valuesToDisplay(request);
                        const isErroneous = isQuantityErroneous(values);
                        const maxSelection = maxDropdownQuantity(values);
                        const { quantity, totalRequired } = values;
                        return (
                            <tr key={request._id}>
                                <td className="row-text semibold">{request?.clientName ?? "N/A"}</td>
                                {!props.donationForm.requestGroup && (
                                    <td className="row-text">{request?.requestType?.name ?? "N/A"}</td>
                                )}
                                <td
                                    className={
                                        "item-quantity" +
                                        (props.isMatching ? "-selection" : "-display") +
                                        (isErroneous ? " error" : "")
                                    }
                                >
                                    {isErroneous && <i className="bi bi-exclamation-circle alert-icon" />}
                                    {props.isMatching ? (
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
                                                <span key={index} onClick={() => onQuantityChange(value, request)}>
                                                    {value}
                                                </span>
                                            ))}
                                            onDropdownOpen={() => {
                                                setReqCurrentlyEditing(request._id!);
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

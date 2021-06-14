import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import moment from "moment";

import { Row, Spinner } from "react-bootstrap";

import InfoBox from "../molecules/InfoBox";
import RequestGroup from "../../data/types/requestGroup";
import RequestTypeList from "../molecules/RequestTypeList";
import RichTextDisplay from "../atoms/RichTextDisplay";

// TODO: rich text for descriptions (BLOCKER: how admin's will set descriptions)
// TODO: get email from TPC and put here

interface Props {
    requestGroupId?: string;
}

const RequestGroupDonorView: FunctionComponent<Props> = (props: Props) => {
    const emailAddress = "reception@pregnancycentre.ca"; // TODO: replace and see todo above

    const [requestGroupData, setRequestGroupData] = useState<RequestGroup | undefined>(undefined);

    const query = gql`
        query FetchRequestGroup($id: ID!) {
            requestGroup(id: $id) {
                _id
                name
                dateUpdated
                description
                requirements
                image
                requestTypes {
                    _id
                    name
                    numOpen
                }
            }
        }
    `;

    const { loading, error } = useQuery(query, {
        variables: { id: props.requestGroupId },
        onCompleted: (data: { requestGroup: RequestGroup }) => {
            const res = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen
            setRequestGroupData(res);
        }
    });

    useEffect(() => {
        if (loading || error) {
            setRequestGroupData(undefined);
        }
    }, [loading, error]);

    return (
        <Row className="request-group-view">
            {requestGroupData === undefined ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <div className="panel">
                    <div className="section" id="left">
                        <div className="info">
                            <h1 id="header">{requestGroupData.name}</h1>
                            <p id="date-updated">
                                Last added {moment(requestGroupData.dateUpdated, "x").format("MMMM DD, YYYY")}
                            </p>
                            <div id="image">
                                <img src={requestGroupData.image} />
                            </div>
                        </div>
                        <RequestTypeList
                            requestTypes={requestGroupData.requestTypes ? requestGroupData.requestTypes : []}
                        />
                    </div>
                    <div className="section" id="right">
                        <div id="contact">
                            <InfoBox
                                title="CAN YOU MEET A NEED?"
                                text="To arrange your donation, contact the Pregnancy Center directly at 519-886-4001 or send an email."
                                buttonProps={{
                                    text: "Send an email",
                                    onClick: (e) => {
                                        const button = e.target as HTMLButtonElement;
                                        button.textContent = "Email copied";
                                        button.classList.add("alt-button");

                                        setTimeout(() => {
                                            button.textContent = "Send an email";
                                            button.classList.remove("alt-button");
                                        }, 5000);
                                    },
                                    copyText: emailAddress
                                }}
                            />
                        </div>
                        <div id="description">
                            <InfoBox title="ITEM DESCRIPTION">
                                {requestGroupData.description && (
                                    <RichTextDisplay content={requestGroupData.description} />
                                )}
                            </InfoBox>
                        </div>
                    </div>
                </div>
            )}
        </Row>
    );
};

export default RequestGroupDonorView;

import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import moment from "moment";

import { Row, Spinner } from "react-bootstrap";

import InfoBox from "../molecules/InfoBox";
import RequestGroup from "../../data/types/requestGroup";
import RequestTypeList from "../molecules/RequestTypeList";
import RichTextDisplay from "../atoms/RichTextDisplay";

interface Props {
    requestGroupId?: string;
}

const RequestGroupDonorView: FunctionComponent<Props> = (props: Props) => {
    const [requestGroupData, setRequestGroupData] = useState<RequestGroup | undefined>(undefined);

    const query = gql`
        query FetchRequestGroup($id: ID!) {
            requestGroup(_id: $id) {
                _id
                name
                updatedAt
                description
                image
                requestTypes {
                    _id
                    name
                    countOpenRequests
                    deletedAt
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
                                Last added {moment(requestGroupData.updatedAt, "x").format("MMMM DD, YYYY")}
                            </p>
                            <div id="image">
                                <img src={requestGroupData.image} />
                            </div>
                        </div>
                        <RequestTypeList
                            requestTypes={
                                requestGroupData.requestTypes
                                    ? requestGroupData.requestTypes.filter(
                                          (requestType) => requestType.deletedAt == null
                                      )
                                    : []
                            }
                        />
                    </div>
                    <div className="section" id="right">
                        <div id="contact">
                            <InfoBox
                                title="CAN YOU MEET A NEED?"
                                text="We’d love to learn about your items. Submit a donation request now:"
                                buttonProps={{
                                    text: "Donate an item",
                                    copyText: ""
                                }}
                                buttonLink="/donation-form"
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

import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';

import { Col, Row, Spinner } from 'react-bootstrap';

import InfoBox from '../molecules/InfoBox';
import RequestGroup from '../../data/types/requestGroup';
import RequestTypeList from '../molecules/RequestTypeList';

// TODO: rich text for descriptions (BLOCKER: how admin's will set descriptions)
// TODO: get email from TPC and put here


interface Props {
    requestGroupId?: string
}

const RequestGroupDonorView: FunctionComponent<Props> = (props: Props) => {
    const emailAddress = "mail@example.com" // TODO: replace and see todo above

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
        variables: {id: props.requestGroupId,}, 
        onCompleted: ( data: { requestGroup: RequestGroup }) => {
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
            {requestGroupData === undefined
            ?
            <div className="spinner"> 
                <Spinner animation="border" role="status"/>
            </div>
            :
            <div className="panel">
                <Col className="section" id="left" md={7} sm={12}>
                    <div className="info">
                        <h1 id="header">
                            {requestGroupData.name}
                        </h1>
                        <p id="date-updated">
                            Last added {moment(requestGroupData.dateUpdated, "x").format('MMMM DD, YYYY')}
                        </p>
                        <div id="image">
                            <img src={requestGroupData.image}/>
                        </div>
                    </div>
                    <RequestTypeList requestTypes={requestGroupData.requestTypes ? requestGroupData.requestTypes : []}/>
                </Col>
                <Col className="section" id="right" md={5} sm={12}>
                    <InfoBox 
                        title="HAVE A DONATION?" 
                        text="To arrange your donation, contact the Pregnancy Center directly at 514‑999‑9999 or send an email."
                        buttonProps = {{
                            text: "Send an email",
                            onClick: (e) => {
                                console.log(e);
                                const button = e.target as HTMLButtonElement;
                                button.textContent = "Email copied";
                                button.classList.add('alt-button');

                                console.log(e);

                                setTimeout(() => {
                                    button.textContent = "Send an email"; 
                                    button.classList.remove('alt-button')
                                }, 5000);
                            },
                            copyText: emailAddress
                        }}
                    />
                    <div id="description">
                        <InfoBox 
                            title="ITEM DESCRIPTION" 
                            text={requestGroupData.description ? requestGroupData.description : ''}
                        />
                    </div>
                </Col>
            </div>}
        </Row>
    )
}

export default RequestGroupDonorView;

import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment';

import { Spinner } from 'react-bootstrap';

import InfoBox from '../molecules/InfoBox';
import RequestTypeList from '../molecules/RequestTypeList';

import RequestGroup from '../../data/types/requestGroup';
import RequestType from '../../data/types/requestType';

// TODO: figure out how to get nice formatting for item descriptions

interface Props {
    requestGroupId: string
}

const RequestGroupDonorView: FunctionComponent<Props> = (props: Props) => {
    const [requestGroupData, setRequestGroupData] = useState<RequestGroup | undefined>(undefined);

    useEffect(() => {
        // fetch from store/graphql using props.requestGroupId
        if (requestGroupData === undefined) {
            // dummy data
            const fetchedRequestTypes: RequestType[] = [
                {
                    _id: "3",
                    name: "4 year old",
                    numOpen: 1
                },
                {
                    _id: "1",
                    name: "2 year old",
                    numOpen: 2
                },
                {
                    _id: "2",
                    name: "3 year old",
                    numOpen: 10
                },
                {
                    _id: "4",
                    name: "Tub",
                    numOpen: 8
                }
            ]

            const fetchedRequestGroup: RequestGroup = {
                _id: props.requestGroupId,
                name: 'Bath tub',
                dateUpdated: new Date('January 21, 2021'),
                description: "This is a description of a bath tub. We need to set guideliens for this and potentially limit the amount of characters.",
                requirements: "<ul><li>No damaged or missing parts</li><li>No mattress</li><li>Meets safety standards</li><li>Able to be dismantled</li></ul>",
                image: "https://images.unsplash.com/photo-1609220361594-efc1c6c90b5d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                requestTypes: fetchedRequestTypes
            };

            setTimeout(() => {setRequestGroupData(fetchedRequestGroup)}, 3000);            
        }
    }, []);

    return (
        <div className="request-group-view">
            {requestGroupData === undefined
            ?
            <div className="spinner"> 
                <Spinner animation="border" role="status"/>
            </div>
            :
            <div className="panel">
                <div className="section" id="left">
                    <div className="info">
                        <h1 id="header">
                            {requestGroupData.name}
                        </h1>
                        <p id="date-updated">
                            Last updated {moment(requestGroupData.dateUpdated).format('MMMM DD, YYYY')}
                        </p>
                        <div id="image">
                            <img src={requestGroupData.image}/>
                        </div>
                    </div>
                    <RequestTypeList requestTypes={requestGroupData.requestTypes ? requestGroupData.requestTypes : []}/>
                </div>
                <div className="section" id="right">
                    <InfoBox 
                        title="HAVE A DONATION?" 
                        text="To arrange your donation, contact the Pregnancy Center directly at 514‑999‑9999 or send an email."
                        buttonText="Send an email"
                        buttonCallback={()=>{}}
                    />
                    <div id="description">
                        <InfoBox 
                            title="ITEM DESCRIPTION" 
                            text={requestGroupData.description ? requestGroupData.description : ''}
                        />
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default RequestGroupDonorView;

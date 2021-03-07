import React, { FunctionComponent } from 'react';
import { Card } from 'react-bootstrap';

interface Props {
    title: string,
    text: string,
    buttonText?: string,
    buttonCallback?: () => void
}

const RequestTypeList: FunctionComponent<Props> = (props: Props) => {
    return (
        <Card className="infoBox">
            <Card.Body>
                <Card.Title>
                    {props.title}
                </Card.Title>
                <Card.Text>
                    {props.text}
                </Card.Text>
                {props.buttonText && props.buttonCallback &&
                    <button onClick={props.buttonCallback}>
                        {props.buttonText}
                    </button>
                }
            </Card.Body>
        </Card>
    )
}

export default RequestTypeList; 

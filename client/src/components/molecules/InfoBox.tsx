import React, { FunctionComponent } from 'react';

import { ButtonToolbarProps, Card } from 'react-bootstrap';

import { Button } from '../atoms/Button';
import type {ButtonProps} from '../atoms/Button';

interface Props {
    title: string,
    text: string,
    buttonProps?: ButtonProps
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
                {props.buttonProps &&
                    <Button {...props.buttonProps}/>
                }
            </Card.Body>
        </Card>
    )
}

export default RequestTypeList; 

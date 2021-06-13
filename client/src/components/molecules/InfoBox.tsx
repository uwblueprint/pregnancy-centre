import React, { FunctionComponent } from "react";

import { Card } from "react-bootstrap";

import { Button } from "../atoms/Button";
import type { ButtonProps } from "../atoms/Button";

interface Props {
    title: string;
    text?: string;
    children?: React.ReactNode;
    buttonProps?: ButtonProps;
}

const InfoBox: FunctionComponent<Props> = (props: Props) => {
    return (
        <Card className="infoBox">
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {props.text && <Card.Text>{props.text}</Card.Text>}
                {props.children}
                {props.buttonProps && <Button {...props.buttonProps} />}
            </Card.Body>
        </Card>
    );
};

export default InfoBox;

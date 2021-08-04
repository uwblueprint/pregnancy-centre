import React, { FunctionComponent } from "react";

import { Card } from "react-bootstrap";

import { Button } from "../atoms/Button";
import type { ButtonProps } from "../atoms/Button";
import { Link } from "react-router-dom";

interface Props {
    title: string;
    text?: string;
    children?: React.ReactNode;
    buttonProps?: ButtonProps;
    buttonLink?: string;
}

const InfoBox: FunctionComponent<Props> = (props: Props) => {
    return (
        <Card className="infoBox">
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {props.text && <Card.Text>{props.text}</Card.Text>}
                {props.children}
                {props.buttonProps && props.buttonLink && (
                    <Link to={props.buttonLink}>
                        <Button {...props.buttonProps} />
                    </Link>
                )}
            </Card.Body>
        </Card>
    );
};

export default InfoBox;

import React, { FunctionComponent } from "react";

interface Props {
    imagePath: string;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: any;
}

const CircleImage: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="circle-image" style={props.style}>
            <img
                key={props.imagePath}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                src={props.imagePath}
            />
        </div>
    );
};

export default CircleImage;

import React, { FunctionComponent } from "react";

import { Button } from "../atoms/Button";
import Navbar from "../organisms/Navbar";
import StepNumber from "../atoms/StepNumber";
import Stepper from "../atoms/Stepper";

interface Props {
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
    includeContentHeader: boolean;
    includeFooter: boolean;
    nextButtonText?: string;
    onNextPage?: () => void;
    onPreviousPage?: () => void;
    pageName?: string;
    pageNumber: number; // Index starting at 0
    pageInstructions?: string;
    previousButtonText?: string;
    steps: Array<string>;
}

const DonationFormPage: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className={"donation-form-page " + (props.className ?? "")}>
            <div className="donation-form-page-header">
                <Navbar
                    links={[
                        {
                            name: "Back to Main Website",
                            link: "https://pregnancycentre.ca/"
                        },
                        { name: "Organization Login", link: "/login" }
                    ]}
                />
            </div>
            <div className="donation-form-page-body">
                <div className="donation-form-page-progress">
                    <h1>Donation Request Form</h1>
                    <Stepper steps={props.steps} selectedStep={props.pageNumber} />
                </div>

                <div className="donation-form-page-content">
                    {props.includeContentHeader && (
                        <div className="donation-form-page-content-header">
                            <StepNumber stepNumber={props.pageNumber + 1} isSelectedStep={true} />
                            <h1>{props.pageName}</h1>
                            <p className="donation-form-page-instructions">{props.pageInstructions}</p>
                        </div>
                    )}
                    {props.children}
                </div>
            </div>
            {props.includeFooter && (
                <div className="donation-form-page-footer">
                    {props.footer}
                    <div className="nav-buttons">
                        {props.previousButtonText && (
                            <Button
                                className="previous-button"
                                text={props.previousButtonText}
                                copyText=""
                                onClick={props.onPreviousPage}
                            />
                        )}
                        {props.nextButtonText && (
                            <Button
                                className="next-button"
                                text={props.nextButtonText}
                                copyText=""
                                onClick={props.onNextPage}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationFormPage;

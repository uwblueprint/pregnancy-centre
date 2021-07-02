import React, { FunctionComponent } from "react";

import Navbar from "../organisms/Navbar";

interface Props {
  children: React.ReactNode;
  className?: string;
  footer: React.ReactNode;
  pageName: string;
  pageInstructions: string;
}

const DonationFormPage: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={"donation-form-page " + (props.className ?? "")}>
      <div className="donation-form-page-header">
        <Navbar
          links={[
            {
              name: "Back to Main Website",
              link: "https://pregnancycentre.ca/",
            },
            { name: "Organization Login", link: "/login" },
          ]}
        />
      </div>
      <div className="donation-form-page-content">
        <div className="donation-form-page-progress">
          <h1>Donation Request Form</h1>
        </div>
        <div className="donation-form-page-details">
          <h1 className="donation-form-page-name">{props.pageName}</h1>
          <p className="donation-form-page-instructions">
            {props.pageInstructions}
          </p>
          <div>{props.children}</div>
        </div>
      </div>
      <div className="donation-form-page-footer">{props.footer}</div>
    </div>
  );
};

export default DonationFormPage;

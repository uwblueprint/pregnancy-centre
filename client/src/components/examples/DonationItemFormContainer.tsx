import React, { FunctionComponent } from "react";

import DonationItemForm from "../molecules/DonationItemForm";
import RequestGroup from "../../data/types/requestGroup";

const DonationItemFormContainer: FunctionComponent<Record<string, never>> =
  () => {
    const requestGroups: Array<RequestGroup> = [
      { name: "Bassinet" },
      { name: "Exersaucer" },
      { name: "Bag" },
    ];

    return (
      <div
        style={{
          marginTop: "30px",
          marginLeft: "30px",
          display: "flex",
          flexDirection: "column",
          width: "70%",
        }}
      >
        <DonationItemForm
          onDelete={() => console.log("Delete")}
          onSave={(donationForm) => console.log(donationForm)}
          requestGroups={requestGroups}
          showFormUnsavedError={false}
        />
      </div>
    );
  };

export default DonationItemFormContainer;

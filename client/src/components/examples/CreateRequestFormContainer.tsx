import React, { FunctionComponent, useState } from "react";

import RequestForm from "../organisms/RequestForm";


const CreateRequestGroupFormContainer: FunctionComponent<Record<string, never>> = () => {
  const [show, setShow] = useState(true);

  return (<>{show && <RequestForm handleClose={() => setShow(false)} operation="create" />}</>)
};

export default CreateRequestGroupFormContainer


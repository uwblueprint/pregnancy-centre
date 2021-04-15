import React, { FunctionComponent, useState } from "react";

import RequestForm from "../organisms/RequestForm";


const CreateRequestFormContainer: FunctionComponent<Record<string, never>> = () => {
  const [show, setShow] = useState(true);

  return (<>{show && <RequestForm onSubmitComplete={() => { window.location.reload() }} handleClose={() => setShow(false)} operation="create" />}</>)
};

export default CreateRequestFormContainer


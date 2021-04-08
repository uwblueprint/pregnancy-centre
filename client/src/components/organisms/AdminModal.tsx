import React, { FunctionComponent } from 'react';
import CommonModal from "./Modal"

interface Props {
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  size: "small" | "medium" | "large";
}

const AdminModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CommonModal customClose class="modal-admin" size={props.size} show={props.show} handleClose={props.handleClose} header={<><div className={`modal-admin-header-title-${props.size}`}>
      {props.title}
    </div></>}>
      <>
        <hr className={`modal-admin line-${props.size}`} />
        {props.children}
      </>
    </CommonModal>
  );
}

export default AdminModal;

import React, { FunctionComponent } from 'react';
import CommonModal from "./Modal"
import tpcLeaf from '../../assets/tpc-leaf.png';

interface Props {
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
}

const AdminModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CommonModal customClose class="modal-admin" show={props.show} handleClose={props.handleClose} header={<><div className="title">
      {props.title}
    </div></>}>
      <>
        <hr className={"modal-admin-header line"} />
        {props.children}
      </>
    </CommonModal>
  );
}

export default AdminModal;

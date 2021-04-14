import React, { FunctionComponent } from 'react';
import CommonModal from "./Modal"

interface Props {
  class: string;
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  extraHeader?: React.ReactNode;
  size: "small" | "medium" | "large";
}

const FormModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CommonModal customClose class={`modal-admin modal-admin-header-${props.size} ` + props.class} size={props.size} show={props.show} handleClose={props.handleClose} header={<div className={`modal-admin-header-title-${props.size}`}>
      {props.title}{props.extraHeader}
    </div>}>
      <>
        <hr className={`modal-admin line-${props.size}`} />
        {props.children}
      </>
    </CommonModal>
  );
}

export default FormModal;

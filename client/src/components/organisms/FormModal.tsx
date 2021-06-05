import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';

import { Button } from '../atoms/Button'
import CommonModal from "./Modal"

interface Props {
  // contentClassName: string;
  // headerClassName?: string;
  // bodyClassName?: string;
  className: string;
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  submitButtonText: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  size?: "small" | "medium" | "large";
}

const FormModal: FunctionComponent<Props> = (props: Props) => {
  return (
    // <CommonModal customClose class={`modal-admin modal-admin-header-${props.size} ` + props.class} size={props.size} show={props.show} handleClose={props.handleClose} header={<div className={`modal-admin-header-title-${props.size}`}>
    //   {props.title}{props.extraHeader}
    // </div>}>
    //   <>
    //     <hr className={`modal-admin line-${props.size}`} />
    //     {props.children}
    //   </>
    // </CommonModal>

    <CommonModal
      // customClose
      // class={`modal-admin modal-admin-header-${props.size} ` + props.class}
      // size={props.size}
      className={`form-modal ` + props.className}
      show={props.show}
      handleClose={props.handleClose}
      headerText={props.title}
      header={<Modal.Title className="text-center">{props.title}</Modal.Title>}
      // header={
      //   <div className={"form-modal-header " + props.headerClassName}>
      //     {props.title}
      //   </div>
      // }
    >
      {/* <div className={props.bodyClassName}> */}
      <form onSubmit={props.onSubmit}>
        {/* <hr className={`modal-admin line-${props.size}`} /> */}
        {props.children}
        <div>
          <Button className="form-modal-cancel-btn" text="Cancel" copyText="" onClick={props.onCancel}/>
          <Button className="form-modal-submit-btn" text={props.submitButtonText} copyText="" onClick={props.onSubmit} type="submit"/>
        </div>
        </form>
      {/* </div> */}
    </CommonModal>
  );
}

export default FormModal;

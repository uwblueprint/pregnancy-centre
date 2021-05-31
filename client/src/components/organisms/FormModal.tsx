import React, { FunctionComponent } from 'react';

import { Button } from '../atoms/Button'
import CommonModal from "./Modal"

interface Props {
  // contentClassName: string;
  headerClassName: string;
  bodyClassName: string;
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  submitButtonText: string;
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
      contentClassName="form-modal"
      show={props.show}
      handleClose={props.handleClose}
      headerText={props.title}
      // header={
      //   <div className={"form-modal-header " + props.headerClassName}>
      //     {props.title}
      //   </div>
      // }
    >
      <div className={props.bodyClassName}>
        {/* <hr className={`modal-admin line-${props.size}`} /> */}
        {props.children}
        <div className="form-modal-footer">
          <Button text="Cancel" copyText="" />
          <Button text={props.submitButtonText} copyText="" />
        </div>
      </div>
    </CommonModal>
  );
}

export default FormModal;

import React, { FunctionComponent } from 'react';
import CommonModal from "./Modal"
import tpcLeaf from '../../assets/tpc-leaf.png';

interface Props {
  title: string;
  subtitle: string;
  show: boolean;
  handleClose(): void;
  body: React.ReactNode;
}

const LogoModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CommonModal class="logo-modal" size="default" show={props.show} handleClose={props.handleClose}>
      <div className="pc-icon">
        <img src={tpcLeaf}></img>
      </div>
      <div className="title">
        {props.title}
      </div>
      <div className="subtitle">
        {props.subtitle}
      </div>
      {props.body}
    </CommonModal>
  );
}

export default LogoModal;

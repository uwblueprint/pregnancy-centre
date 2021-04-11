import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupBrowser from '../components/organisms/DonorRequestGroupBrowser'
import HomepageBanner from '../components/organisms/HomepageBanner'

import FormItem from '../components/molecules/FormItem'

interface Props {
  isDisabled: boolean;
}
const Bob: FunctionComponent<Props> = (props: Props) => {
  return (
    <input type="text" style={{width: '300px'}} disabled={props.isDisabled}/>
  )
}

const DonorHomepage: FunctionComponent = () => {
  return <Container className="donor-homepage" fluid>
    <DonorPage>
      <Row><HomepageBanner /></Row>
      <FormItem 
                formItemName="Group Name" 
                errorString="" 
                isDisabled={false} 
                inputComponent={<Bob isDisabled={false}/>}
                tooltipText="Groups describe overall cateogry of item such as stroller crib bed"
              />
      <Row className="donor-homepage-request-groups-browser"><DonorRequestGroupBrowser /></Row>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;

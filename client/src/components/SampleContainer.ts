import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { loadData } from "../actions";
import SampleComponent from "./SampleComponent";

const mapStateToProps = (store: any) => {
  return {
    storeData: store.dataReducer.data,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      // add other actions here
      loadData,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SampleComponent);

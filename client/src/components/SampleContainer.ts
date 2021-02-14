/* Imports from packages */
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

/* Imports from local files */
import SampleComponent, { DispatchProps as SampleComponentDispatchProps, StateProps as SampleComponentStateProps } from "./SampleComponent";
import { loadData } from "../data/actions";
import Store from '../data/types/store'

const mapStateToProps = (store: Store): SampleComponentStateProps => {
  return {
    requests: store.requests.data,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): SampleComponentDispatchProps => {
  return bindActionCreators(
    {
      // add other actions here
      loadData,
    },
    dispatch
  );
};

export default connect<SampleComponentStateProps, SampleComponentDispatchProps>(mapStateToProps, mapDispatchToProps)(SampleComponent);

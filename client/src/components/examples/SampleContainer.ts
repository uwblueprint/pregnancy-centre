/* Imports from packages */
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

/* Imports from local files */
import SampleComponent, { DispatchProps as SampleComponentDispatchProps, StateProps as SampleComponentStateProps } from "./SampleComponent";
import { loadData } from "../../data/actions";
import { RootState } from '../../data/reducers'

const mapStateToProps = (store: RootState): SampleComponentStateProps => {
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

export default connect<SampleComponentStateProps, SampleComponentDispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(SampleComponent);

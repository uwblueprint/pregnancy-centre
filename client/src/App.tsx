import './App.scss';
import React from "react";

import SampleContainer from "./components/SampleContainer";

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <SampleContainer requests={[]} />
      </header>
    </div>
  );
}

export default App;

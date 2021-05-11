import { Fragment } from "react";

import { Timer } from "@/components/Timer";

function App(): JSX.Element {
  return (
    <Fragment>
      <Timer />
      <AnotherComponent />
    </Fragment>
  );
}

const AnotherComponent = () => <div>render test</div>;

export default App;

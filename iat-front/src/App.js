import React, { Component } from "react";
import axios from "axios";

import Image from "./Image";
import "./App.css";

class App extends Component {
  state = { images: [] };
  async componentDidMount() {
    const { data } = await axios.get(
      "https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/images"
    );
    this.setState({ images: data.body });
  }
  render() {
    const imageName = window.location.search.replace("?image=", "");

    return (
      <div className="App">
        {imageName ? (
          <Image imageName={imageName} />
        ) : (
          this.state.images.map(image => {
            return (
              <a href={`?image=${image}`} key={image}>
                <img
                  src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${image}`}
                />
              </a>
            );
          })
        )}
      </div>
    );
  }
}

export default App;

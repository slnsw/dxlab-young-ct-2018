import React, { Component } from "react";
import axios from "axios";

import Image from "./Image";
import "./App.css";
import "./gallery.css";

class App extends Component {
  state = { imageList: [] };
  async componentDidMount() {
    const { data } = await axios.get(
      "https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/images"
    );
    this.setState({ imageList: data.body });
  }
  render() {
    const imageName = window.location.search.replace("?image=", "");

    return (
      <div className="App">
        {imageName ? (
          <Image imageList={this.state.imageList} imageName={imageName} />
        ) : (
          <React.Fragment>
            <h1>Image gallery</h1>
            {this.state.imageList.map(image => {
              return (
                <a href={`?image=${image}`} key={image}>
                  <img
                    className="thumbnail"
                    src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${image}`}
                  />
                </a>
              );
            })}{" "}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;

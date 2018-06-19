import React, { Component } from "react";
import axios from "axios";

class Image extends Component {
  async componentDidMount() {
    const { data } = await axios.get(
      `https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/images/${
        this.props.imageName
      }`
    );
    console.log(data.body);
  }
  render() {
    const currentIndex = this.props.imageList.indexOf(this.props.imageName);
    console.log(currentIndex);
    return (
      <React.Fragment>
        <h1>{this.props.imageName}</h1>
        <p>
          <a href="/">Return to index page</a>
        </p>
        <p>
          <a
            href={`?image=${
              currentIndex === 0
                ? this.props.imageList[this.props.imageList.length - 1]
                : this.props.imageList[currentIndex - 1]
            }`}
          >
            Back
          </a>
        </p>
        <p>
          <a
            href={`?image=${
              currentIndex === this.props.imageList.length - 1
                ? this.props.imageList[0]
                : this.props.imageList[currentIndex + 1]
            }`}
          >
            Next
          </a>
        </p>
        <img
          src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${
            this.props.imageName
          }`}
        />
      </React.Fragment>
    );
  }
}

export default Image;

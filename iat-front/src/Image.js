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
    return (
      <img
        src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${
          this.props.imageName
        }`}
      />
    );
  }
}

export default Image;

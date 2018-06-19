import React, { Component } from "react";
import axios from "axios";

class Image extends Component {
  state = { faces: {} };
  async componentDidMount() {
    const { data } = await axios.get(
      `https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/images/${
        this.props.imageName
      }`
    );
    this.setState({ faces: data.body });
    console.log(this.state.faces);
  }
  render() {
    const currentIndex = this.props.imageList.indexOf(this.props.imageName);

    const faceList = this.state.faces;
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
        <div
          style={{
            position: "relative",
            display: "inline-block"
          }}
        >
          <img
            src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${
              this.props.imageName
            }`}
          />
          {this.state.faces.FaceRecords ? (
            this.state.faces.FaceRecords.map(face => {
              console.log(face.Face.BoundingBox.Top);
              return (
                <div
                  key={face.Face.FaceId}
                  style={{
                    position: "absolute",
                    top: `${face.Face.BoundingBox.Top * 100}%`,
                    left: `${face.Face.BoundingBox.Left * 100}%`,
                    width: `${face.Face.BoundingBox.Width * 100}%`,
                    height: `${face.Face.BoundingBox.Height * 100}%`,
                    borderStyle: "solid",
                    borderWidth: "3px",
                    borderColor: "lightgreen"
                  }}
                />
              );
            })
          ) : (
            <div />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Image;

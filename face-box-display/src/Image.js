import React, { Component } from "react";
import axios from "axios";

class Image extends Component {
  state = { faces: {}, matchingFaces: [] };
  async componentDidMount() {
    const { data } = await axios.get(
      `https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/getFaces?image=${
        this.props.imageName
      }`
    );
    this.setState({ faces: data.body });
  }
  render() {
    const currentIndex = this.props.imageList.indexOf(this.props.imageName);

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
          {this.state.faces.faceRecords ? (
            this.state.faces.faceRecords.map(face => {
              return (
                <React.Fragment>
                  {face.face.matchingFaces != null ? (
                    <a href="">
                      <div
                        key={face.face.faceId}
                        style={{
                          position: "absolute",
                          top: `${face.face.boundingBox.top * 100}%`,
                          left: `${face.face.boundingBox.left * 100}%`,
                          width: `${face.face.boundingBox.width * 100}%`,
                          height: `${face.face.boundingBox.height * 100}%`,
                          borderStyle: "solid",
                          borderWidth: "3px",
                          borderColor: "lightgreen"
                        }}
                      />
                    </a>
                  ) : (
                    <div
                      key={face.face.faceId}
                      style={{
                        position: "absolute",
                        top: `${face.face.boundingBox.top * 100}%`,
                        left: `${face.face.boundingBox.left * 100}%`,
                        width: `${face.face.boundingBox.width * 100}%`,
                        height: `${face.face.boundingBox.height * 100}%`,
                        borderStyle: "solid",
                        borderWidth: "3px",
                        borderColor: "lightgreen"
                      }}
                    />
                  )}
                </React.Fragment>
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

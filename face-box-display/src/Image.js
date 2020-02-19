import React, { Component } from 'react';
import axios from 'axios';

class Image extends Component {
  state = { faces: null, matchingFaces: [] };
  async componentDidMount() {
    // const { data } = await axios.get(
    //   `https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/getFaces?image=${this.props.imageName}`
    // );

    const { data } = await axios.get(
      `./data/${this.props.imageName.replace('.jpg', '.json')}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    this.setState({ faces: toCamel(data) });
  }
  render() {
    const currentIndex = this.props.imageList.indexOf(this.props.imageName);
    const urlString = window.location;
    const url = new URL(urlString);
    const faceId = url.searchParams.get('faceId');

    return (
      <React.Fragment>
        <h1>{this.props.imageName}</h1>
        <p>
          <a href="./">Return to index page</a>
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
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <img
            // src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${this.props.imageName}`}
            src={`./images/${this.props.imageName}`}
            alt={this.props.imageName}
          />
          {this.state.faces && this.state.faces.faceRecords ? (
            this.state.faces.faceRecords.map(face => {
              return (
                <React.Fragment key={face.face.faceId}>
                  {face.face.matchingFaces != null ? (
                    <a
                      href={`?image=${this.props.imageName}&faceId=${face.face.faceId}`}
                    >
                      {faceId && face.face.faceId === faceId ? (
                        <div
                          key={face.face.faceId}
                          style={{
                            position: 'absolute',
                            top: `${face.face.boundingBox.top * 100}%`,
                            left: `${face.face.boundingBox.left * 100}%`,
                            width: `${face.face.boundingBox.width * 100}%`,
                            height: `${face.face.boundingBox.height * 100}%`,
                            borderStyle: 'solid',
                            borderWidth: '3px',
                            borderColor: '#e6007e',
                          }}
                        />
                      ) : (
                        <div
                          key={face.face.faceId}
                          style={{
                            position: 'absolute',
                            top: `${face.face.boundingBox.top * 100}%`,
                            left: `${face.face.boundingBox.left * 100}%`,
                            width: `${face.face.boundingBox.width * 100}%`,
                            height: `${face.face.boundingBox.height * 100}%`,
                            borderStyle: 'solid',
                            borderWidth: '3px',
                            borderColor: '#1300e6',
                          }}
                        />
                      )}
                    </a>
                  ) : (
                    <div
                      key={face.face.faceId}
                      style={{
                        position: 'absolute',
                        top: `${face.face.boundingBox.top * 100}%`,
                        left: `${face.face.boundingBox.left * 100}%`,
                        width: `${face.face.boundingBox.width * 100}%`,
                        height: `${face.face.boundingBox.height * 100}%`,
                        borderStyle: 'solid',
                        borderWidth: '3px',
                        borderColor: '#8cca3a',
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

        <p>Click on blue square to see face matches</p>

        {faceId !== null && this.state.faces !== null
          ? this.state.faces.faceRecords
              .filter(face => {
                return face.face.faceId === faceId;
              })
              .map(face => {
                return face.face.matchingFaces.map(matchingFace => {
                  return (
                    <React.Fragment key={matchingFace.face.externalImageId}>
                      <h2>{matchingFace.face.externalImageId}</h2>
                      <div
                        key={matchingFace.face.externalImageId}
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      >
                        <img
                          alt={matchingFace.face.externalImageId}
                          src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${matchingFace.face.externalImageId}`}
                          key={matchingFace.face.externalImageId}
                        />
                        <div
                          key={matchingFace.face.faceId}
                          style={{
                            position: 'absolute',
                            top: `${matchingFace.face.boundingBox.top * 100}%`,
                            left: `${matchingFace.face.boundingBox.left *
                              100}%`,
                            width: `${matchingFace.face.boundingBox.width *
                              100}%`,
                            height: `${matchingFace.face.boundingBox.height *
                              100}%`,
                            borderStyle: 'solid',
                            borderWidth: '3px',
                            borderColor: '#e6007e',
                          }}
                        />
                      </div>
                    </React.Fragment>
                  );
                });
              })
          : ''}
      </React.Fragment>
    );
  }
}

function toCamel(o) {
  var newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function(value) {
      if (typeof value === 'object') {
        value = toCamel(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (
          origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
        ).toString();
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = toCamel(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
}

export default Image;

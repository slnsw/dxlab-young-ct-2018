import React, { Component } from 'react';
import axios from 'axios';

import Image from './Image';
import './App.css';
import './gallery.css';

class App extends Component {
  state = { imageList: [] };
  async componentDidMount() {
    // const { data } = await axios.get(
    //   'https://oc958ljit3.execute-api.ap-southeast-2.amazonaws.com/dev/images'
    // );
    const { data } = await axios.get('./data/images.json');

    this.setState({ imageList: data.body });
  }
  render() {
    const urlString = window.location;
    const url = new URL(urlString);
    const imageName = url.searchParams.get('image');

    return (
      <div className="App">
        <p style={{ opacity: '0.5' }}>
          <strong>Young Creative Technologist Experiment</strong> by Vignesh
          Sankaran
        </p>
        {imageName ? (
          <Image
            key={imageName}
            imageList={this.state.imageList}
            imageName={imageName}
          />
        ) : (
          <React.Fragment>
            <h1>Image gallery</h1>
            {this.state.imageList.map(image => {
              return (
                <a href={`?image=${image}`} key={image}>
                  <img
                    className="thumbnail"
                    src={`https://s3-ap-southeast-2.amazonaws.com/samhood/${image}`}
                    alt={image}
                  />
                </a>
              );
            })}{' '}
          </React.Fragment>
        )}

        <footer style={{ margin: '5em' }}>
          <p>
            This research is supported through an{' '}
            <a href="https://dxlab.sl.nsw.gov.au/grants">award</a> offered by
            the DX Lab. Read the blog post{' '}
            <a href="https://dxlab.sl.nsw.gov.au/blog/young-cts-facial-recognition-research">
              here
            </a>
            .
          </p>
        </footer>
      </div>
    );
  }
}

export default App;

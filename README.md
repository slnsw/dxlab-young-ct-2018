# dxlab-young-ct-award

This contains the development of a facial recognition system against subsets
of the State Library's image collection. It contains multiple projects that each
perform their own function.

## Project directories

### iat-front

Front end for the image analysis tool. It displays bounding boxes around any
recognised faces, and lists similar faces that are in other images.

### iat-back

Lambda service that hits an image's Rekognition analysis JSON file in S3, and
if there are faces recognised, it searches for similar faces in other images and
returns the results of the search.

### rekognition-init

Script to run Rekognition against images in a designated S3 bucket, and saves
the output to individual JSON files for each image.

## Project status

The `rekognition-init` script is currently being worked on. Once it is completed,
`iat-front` will be the next thing to be worked on.

# Server

ML server code


## How to Run on jupyter notebook server

Check existing conda environment

```conda info --envs```

Switch to appropriate environment (mxnet_p36 in this example)

```conda activate mxnet_p36```

Run server on certain port (18000 in this example)

```jupyter notebook --ip=0.0.0.0 --port=18000```
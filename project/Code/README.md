# Chess Move Prediction using Deep Learning

This repository contains a Python implementation of a Chess Move Prediction system using deep learning techniques. The models predicts the best k candidate moves for a given chess position using a convolutional neural network.
Then with the use of the alpha beta pruning tree it can choose the best move from the k best move.

## Features

- Filters the Games Dataset that is in the pgn file
- Process the filtered game and convert it to boards array and equivalent move.
- Store and load the data in Google Drive
- Train the networks on different dataset each for the respective network.
- Retrain the models on different dataset like chess puzzles to make the system stronger on the middle/end game.
- Predicts the best k candidate moves for a given chess position.
- Implements caching for faster prediction using a Least Recently Used (LRU) cache.
- Supports limiting search time for move prediction to manage computational resources.
- Includes utility functions for converting between different chess representations.
- Integrates Stockfish engine for board evaluation.

## Requirements

- Python > 3.7
- TensorFlow
- NumPy
- Chess library
- Stockfish (for board evaluation)

## Usage

1. Install the required libraries using `pip`:

    by running the first subcell that has all the packages wanted to install

    ```bash
    pip install tensorflow numpy python-chess stockfish
    ```

2. Run the second subcell that name is importing packages.

3. Run the third subcell which name is define that has all the defined variable
with the mappers and path definitions.

4. Run the second main cell that has all the functions needed to run any other code.

5. You are good to go run any main cell each do some part of the jobs.

6. To load and process the dataset try running the data process cell:

    This cell will not run unless the LOADING_DATA variable has the True value.
    This main cell get all the games of the provided pgn file and filter them on some condition (mentioned in the helper functions)
    Then it generate a position for each move in this games, and trasform it into an array.
    Lastly it store the pair (position, move) in a 2 different file.
    The type of data processed and stored depened on the True value assigned to which piece in the define subcell.
    To process all the data you should run this main cell 'data process' 7 times each time for 1 piece and the last one with all the pieces has False so you prepare the data for the first model.

7. To train the model you can run the main cell train:
    This will depened on the True value assigned to which piece in the define subcell, and if the variable TRAINING_MODEL equals True.
    It will train the model respective to the piece that has the True flag.
    On the visualize subcell you can visualize the training process like accuracy and loss per epochs.
    Finally the resulted model will be saved on the Google Drive.
    To train all the models you should run this main cell 'train' 7 times each time for 1 piece and the last one with all the pieces has False so you train the first model.

8. To fine tune the models you can run the main cell retrain:
    This will depened on the True value assigned to which piece in the define subcell, and if the variable RETRAINING_MODEL equals True.
    It will retrain the model on the 2 different dataset (60% of the Puzzles and, 40% of the Games) respective to the piece that has the True flag.
    On the visualize subcell you can visualize the training process like accuracy and loss per epochs.
    Finally the resulted model will be saved on the Google Drive.
    To fine tune all the models you should run this main cell 'retrain' 7 times each time for 1 piece and the last one with all the pieces has False so you fine tune the first model.

9.


#Given chess board positions and the tactic labels, train neural network to be able to identify tactic

#TODO: Need to be able to convert PGN to FEN. Don't need to be able to go backwards.

import bz2
import chess



def boardfen_to_matrix(curboard):

    chmap = { ".":0, "p": 1, "r": 2, "n": 3, "b":4, "q":5, "k":6,
                 "P":7, "R":8, "N":9, "B":10, "Q":11, "K":12 }
    
    board_rows_letters = curboard.__str__().split("\n")
    board_rows_numeric = []

    for row in board_rows_letters:
        row = row.split(" ")
        numeric_row = [chmap[row[0]], chmap[row[1]], chmap[row[2]], chmap[row[3]],
                       chmap[row[4]], chmap[row[5]], chmap[row[6]], chmap[row[7]]]
        
        board_rows_numeric.append(numeric_row)
    return board_rows_numeric



def was_move_blunder(prevboard, curboard):
    #if there's a significant swing in the eval function between the two states, then move was a mistake
    #NOTE: can get fancier and separate out small mistake from larger mistakes. small mistakes
    #return score

puzzles_compressed = "lichess_db_puzzle.csv.bz2"

all_games_data = []
training_pairs = []

with bz2.open(puzzles_compressed, "rt") as puzzles_file:
    i = 0
  
    for game in puzzles_file: #arbitrary threshold to reduce processing time
        if i >= 10000:
            break
        else:
            i += 1
        all_games_data.append(game)

#process the raw input into form for training. 
for game in all_games_data:
    game_vars = game.split(",") 
    FEN_before_opponent = game_vars[1] #game state before opponent mistake
    opponent_move_str = game_vars[2].split(" ")[0] #first move in move combo is opponent mistake    

    
    board_state = chess.Board(FEN_before_opponent)
    opponent_move = chess.Move.from_uci(opponent_move_str)
    board_state.push(opponent_move)
    
    impending_tactic = game_vars[7] #string containing info about tactic
    training_pairs.append((boardfen_to_matrix(board_state), impending_tactic))





#based on the lichess puzzles database, the FEN is the game state before opponent moves
#We also have the opponents move. After opponent move, there's a tactical opportunity available.
#****To do after dinner - Figure out set of possible output labels and convert them to numbers.

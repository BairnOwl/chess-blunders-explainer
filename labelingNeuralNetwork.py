#Given chess board positions and the tactic labels, train neural network to be able to identify tactic
#Given two positions, check if the move was a tactical mistake




#Note: To convert PGN to FEN is trivial: board.fen() . Note: Can't convert FEN to PGN.

import bz2
import chess
import chess.engine
import numpy as np

def boardfen_to_vector(curboard):

    chmap = { ".":0, "p": 1, "r": 2, "n": 3, "b":4, "q":5, "k":6,
                 "P":7, "R":8, "N":9, "B":10, "Q":11, "K":12 }
    
    board_rows_letters = curboard.__str__().split("\n")
    board_rows_numeric = []

    for row in board_rows_letters:
        row = row.split(" ")
        numeric_row = [chmap[row[0]], chmap[row[1]], chmap[row[2]], chmap[row[3]],
                       chmap[row[4]], chmap[row[5]], chmap[row[6]], chmap[row[7]]]
        
        board_rows_numeric.append(numeric_row)
        
    return np.array(board_rows_numeric).flatten() #covert the 8*8 matrix into a 64*1 vector



def move_was_mistake(prevboard, curboard,
                     engine_loc = "C:\\Users\\chine\\Downloads\\stockfish_15_win_x64_popcnt\\stockfish_15_win_x64_popcnt\\stockfish_15_x64_popcnt.exe",
                     mistake_threshold = 2):
    """
      Detect if there was a significant change in the evaluation of the position
      Return True if evaluation changed significantly, else return False
      
    """
    

    engine = chess.engine.SimpleEngine.popen_uci(engine_loc)
    
    
    cur_move_info = engine.analyse(curboard, chess.engine.Limit(time=0.1))["score"] #return PovScore object
    cur_move_val = (cur_move_info.white().score())/100 #get score as number from white point of view. score is centipawn loss
    prev_move_info = engine.analyse(curboard, chess.engine.Limit(time=0.01))["score"]
    prev_move_val = (prev_move_info.white().score())/100 #get score as number from white point of view as well. score is centipawn loss

    
    if abs(cur_move_val - prev_move_val) >= mistake_threshold: 
        return True
    return False


    
def load_training_testing_pairs(puzzlesfilename, output_categories_filename, limit = 10000):

    all_games_data = []
    training_test_pairs = []
    output_categories = [] #list of (constrained) output labels we'll allow

    with bz2.open(puzzlesfilename, "rt") as puzzles_file:
        i = 0
      
        for game in puzzles_file: #arbitrary threshold to reduce processing time
            if i >= limit:
                break
            else:
                i += 1
            all_games_data.append(game)

    with open(output_categories_filename) as output_cats_file:
        for category in output_cats_file:
            output_categories.append(category.strip())
            
    #process the raw input into form for training. Technically, better to call this "position" instead of game - we're looking at single positions, not whole games.
    for game in all_games_data:
        game_vars = game.split(",") 
        FEN_before_opponent = game_vars[1] #game state before opponent mistake
        opponent_move_str = game_vars[2].split(" ")[0] #first move in move combo is opponent mistake    

        
        board_state = chess.Board(FEN_before_opponent)
        opponent_move = chess.Move.from_uci(opponent_move_str)
        board_state.push(opponent_move)

        impending_tactic = "unknown"
        
        tactics_info = game_vars[7].split(" ")
        for tactic_str in tactics_info:
            if tactic_str in output_categories:
                impending_tactic = tactic_str
                break
    
     
        training_test_pairs.append((boardfen_to_vector(board_state), impending_tactic))
        
    return training_test_pairs
        

puzzles_datafile = "lichess_db_puzzle.csv.bz2"
output_labelsfile = "puzzleThemesShort.txt"

#get formatted data. X is made up of successive 64*1 vectors. Y is a vector of output labels, with one per X vector
XandY = load_training_testing_pairs(puzzles_datafile, output_labelsfile, 50000)




#****To do after dinner - Figure out set of possible output labels and convert them to numbers.

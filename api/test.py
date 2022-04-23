from stockfish import Stockfish

stockfish = Stockfish(path= r"stockfish.exe")
# stockfish.set_depth(51)
stockfish.set_fen_position("rnbqkbnr/pppp1ppp/8/4p3/7P/7R/PPPPPPP1/RNBQKBN1 b Qkq - 1 2")
print(stockfish.get_evaluation())
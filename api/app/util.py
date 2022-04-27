import io
import random
from unicodedata import category
import chess.engine
import chess.pgn

class Position:

    isMistake = False
    mistakeCategory = None
    mistakeSide = None

    def __init__(self, fen, moveNum, score):
        self.fen = fen
        self.moveNum = moveNum
        self.score = score

    def label_mistake(self, mistakeSide, mistakeCategory):
        self.isMistake = True
        self.mistakeSide = mistakeSide
        self.mistakeCategory = [mistakeCategory]
    
    def label_missed_blunder(self):
        self.mistakeCategory.append("missed blunder")

    def encode(self):
        return {
            "fen": self.fen,
            "moveNum": self.moveNum,
            "score": self.score,
            "isMistake": self.isMistake,
            "mistakeSide": self.mistakeSide,
            "mistakeCategory": self.mistakeCategory
        }
    
class BlunderExplainer:

    def __init__(self, engine_loc):
        self._stockfish = chess.engine.SimpleEngine.popen_uci(engine_loc)

    def get_positions(self, pgn, mistake_threshold=2, time_limit=0.1):
        pgn = io.StringIO(pgn)
        game = chess.pgn.read_game(pgn)
        board = game.board()

        positions = [Position(board.fen(), 0, 0)]
        for i, move in enumerate(game.mainline_moves()):
            board.push(move)

            score = self._stockfish.analyse(board, chess.engine.Limit(time=time_limit))["score"].white().score() / 100
            position = Position(board.fen(), i+1, score)
            if abs(score - positions[-1].score) >= mistake_threshold: 
                mistakeSide = "white" if score - positions[-1].score < 0 else "black"
                mistakeCategory = self._predict_mistake(position.fen)
                position.label_mistake(mistakeSide, mistakeCategory)
                
                #check if missed blunder
                if positions[-1].isMistake and positions[-1].mistakeSide != mistakeSide:
                    position.label_missed_blunder()

            positions.append(position)

        return positions

    def _predict_mistake(self, fen):
        # TODO: overwrite this with real model call
        mistakes = ["doubleCheck", "fork", "exposedKing", "hangingPiece", "mate", "pin"]
        return random.choice(mistakes)

import io
from unicodedata import category
import chess.engine
import chess.pgn

class Position:

    isMistake = False
    category = None

    def __init__(self, fen, score):
        self.fen = fen
        self.score = score

    def label_mistake(self, category):
        self.isMistake = True
        self.category = category

    def encode(self):
        return {
            "fen": self.fen,
            "score": self.score,
            "isMistake": self.isMistake,
            "category": self.category
        }
    
class BlunderExplainer:

    def __init__(self, engine_loc):
        self._stockfish = chess.engine.SimpleEngine.popen_uci(engine_loc)

    def get_positions(self, pgn, mistake_threshold=2, time_limit=0.1):
        pgn = io.StringIO(pgn)
        game = chess.pgn.read_game(pgn)
        board = game.board()

        positions = [Position(board.fen(), 0)]
        for move in game.mainline_moves():
            board.push(move)

            score = self._stockfish.analyse(board, chess.engine.Limit(time=time_limit))["score"].white().score() / 100
            position = Position(board.fen(), score)
            if abs(score - positions[-1].score) >= mistake_threshold: 
                category = self._predict_mistake(position.fen)
                position.label_mistake(category)

            positions.append(position)

        return positions

    def _predict_mistake(self, fen):
        return "pin"
            
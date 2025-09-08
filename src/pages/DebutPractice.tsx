import {useParams} from "react-router-dom";
import {useState} from "react";
import {Chess, Move} from "chess.js";
import {Chessboard} from "react-chessboard";
import {debuts} from "../data/debuts";
import type { Debut } from "../data/debuts";
import NavBar from "../components/NavBar";
import Confetti from "react-confetti";
import {useWindowSize} from "react-use";

export default function DebutPractice() {
    const {debutId} = useParams<{ debutId?: string }>();
    const debut: Debut | undefined = debuts.find((d) => d.id === debutId);

    const [game, setGame] = useState<Chess>(new Chess());
    const [moveIndex, setMoveIndex] = useState<number>(0);
    const [message, setMessage] = useState<string>("Your move!");

    const {width, height} = useWindowSize();
    const isFinished: boolean = moveIndex === (debut?.moves.length ?? 0);

    function safeGameMutate(modify: (game: Chess) => void) {
        const newGame = new Chess(game.fen());
        modify(newGame);
        setGame(newGame);
    }

    function onDrop(sourceSquare: string, targetSquare: string | null): boolean {
        if (!debut) return false;
        if (isFinished) return false;

        if (targetSquare === null) return false;

        let move: Move | undefined;
        try {
            const newGame = new Chess(game.fen());
            const attempted = newGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
            setGame(newGame);
            move = attempted;
        } catch {
            move = undefined;
        }

        if (!move) return false;

        const expected = debut.moves[moveIndex];
        if (move.san === expected) {
            setMoveIndex(moveIndex + 1);
            if (moveIndex + 1 === debut.moves.length) {
                setMessage(`🎉 You mastered ${debut.name}!`);
            } else {
                setMessage("✅ Correct! Next move...");
            }
            return true;
        } else {
            safeGameMutate((g) => g.undo());
            setMessage("❌ Wrong move, try again!");
            return false;
        }
    }

    function resetPractice() {
        setGame(new Chess());
        setMoveIndex(0);
        setMessage("Your move!");
    }

    if (!debut) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg font-medium">Debut not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar title={debut.name}/>

            {isFinished && <Confetti width={width} height={height}/>}

            <div className="flex flex-col items-center p-4 gap-4">
                {/* Chessboard */}
                <div className="w-full max-w-xs">
                    <Chessboard
                        options={{
                            position: game.fen(),
                            onPieceDrop: ({ sourceSquare, targetSquare }) => onDrop(sourceSquare, targetSquare),
                            boardOrientation: "white",
                        }}
                    />
                </div>

                {/* Progress tracker */}
                <div className="w-full max-w-xs text-center">
                    <p className="text-lg font-medium">
                        Step {Math.min(moveIndex + 1, debut.moves.length)} / {debut.moves.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{width: `${(moveIndex / debut.moves.length) * 100}%`}}
                        ></div>
                    </div>
                </div>

                {/* Status message */}
                <p className={`text-lg font-medium ${isFinished ? "text-green-600" : ""}`}>
                    {message}
                </p>

                {/* Restart button */}
                <button
                    onClick={resetPractice}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Restart
                </button>
            </div>
        </div>
    );
}

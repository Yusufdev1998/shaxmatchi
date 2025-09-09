import {useParams} from "react-router-dom";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Chess, type Square} from "chess.js";
import {Chessboard, type SquareHandlerArgs} from "react-chessboard";
import type {Debut} from "../data/debuts";
import {debuts} from "../data/debuts";
import NavBar from "../components/NavBar";
import Confetti from "react-confetti";
import {useWindowSize} from "react-use";

export default function DebutPractice() {
    const {debutId} = useParams<{ debutId?: string }>();
    const debut: Debut | undefined = debuts.find(d => d.id === debutId);

    const [game, setGame] = useState<Chess>(new Chess());
    const [moveIndex, setMoveIndex] = useState<number>(0);
    const [message, setMessage] = useState<string>("Your move!");
    const soundsRef = useRef<Record<string, HTMLAudioElement> | null>(null);
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    function getMoveOptions(square: Square) {
        // get the moves for the square
        const moves = game.moves({
            square,
            verbose: true
        });
        // if no moves, clear the option squares
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }
        // create a new object to store the option squares
        const newSquares: Record<string, React.CSSProperties> = {};
        // loop through the moves and set the option squares
        for (const move of moves) {
            newSquares[move.to] = {
                background: game.get(move.to) && game.get(move.to)?.color !== game.get(square)?.color ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                // smaller circle for moving
                borderRadius: '50%'
            };
        }

        // set the square clicked to move from to yellow
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)'
        };

        // set the option squares
        setOptionSquares(newSquares);

        // return true to indicate that there are move options
        return true;
    }

    function onSquareClick({
                               square,
                               piece
                           }: SquareHandlerArgs) {

        if (!moveFrom && piece) {
            // get the move options for the square
            const hasMoveOptions = getMoveOptions(square as Square);

            // if move options, set the moveFrom to the square
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }
        const moves = game.moves({
            square: moveFrom as Square,
            verbose: true
        });
        const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

        // not a valid move
        if (!foundMove) {
            // check if clicked on new piece
            const hasMoveOptions = getMoveOptions(square as Square);

            // if new piece, setMoveFrom, otherwise clear moveFrom
            setMoveFrom(hasMoveOptions ? square : '');

            // return early
            return;
        }


        onDrop(moveFrom as Square, square);

        // clear moveFrom and optionSquares
        setMoveFrom('');
        setOptionSquares({});
    }

    // NEW: controls
    const [autoMode, setAutoMode] = useState<boolean>(true);
    const [userPlaysWhite, setUserPlaysWhite] = useState<boolean>(true);

    const {width, height} = useWindowSize();
    const isFinished: boolean = moveIndex === (debut?.moves.length ?? 0);

    function onDrop(sourceSquare: string, targetSquare: string | null): boolean {

        if (!debut || isFinished || targetSquare === null) return false;
        // Make a copy of the current position
        const trial = new Chess(game.fen());
        // Try the move on the copy
        try {
            const attempted = trial.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });
            if (!attempted) return false;

            const expected = debut.moves[moveIndex];
            if (attempted.san === expected) {
                setGame(trial);
                playSfx("move"); // 🔊 move sound
                const nextIndex = moveIndex + 1;
                setMoveIndex(nextIndex);
                if (nextIndex === debut.moves.length) {
                    playSfx("success")
                    setMessage(`🎉 You mastered ${debut.name}!`);
                } else {
                    setMessage("✅ Correct! Next move...");
                }
                return true;
            } else {
                setMessage("❌ Wrong move, try again!");
                playSfx("wrong"); // 🔊 wrong sound
                return false;
            }
        } catch {
            return false
        }
    }

    function resetPractice(nextPlaysWhite: boolean | null = null) {
        const playsWhite = nextPlaysWhite ?? userPlaysWhite;
        setGame(new Chess());
        setMoveIndex(0);
        setMessage("Your move!");
        if (nextPlaysWhite !== null) setUserPlaysWhite(playsWhite);
    }

    const ensureSounds = useCallback(() => {
        if (!soundsRef.current) {
            soundsRef.current = {
                move: new Audio("/sounds/move.mp3"),
                wrong: new Audio("/sounds/wrong.mp3"),
                success: new Audio("/sounds/success.mp3"),
            };
            Object.values(soundsRef.current).forEach(a => (a.preload = "auto"));
        }
        return soundsRef.current!;
    }, []);

    const playSfx = useCallback((name: "move" | "wrong" | "success") => {
        const bank = ensureSounds();
        const base = bank[name];
        if (!base) return;
        const inst = base.cloneNode(true) as HTMLAudioElement;
        void inst.play().catch(() => {
        });
    }, [ensureSounds]);

    // NEW: autoplay effect for opponent moves
    useEffect(() => {
        if (!debut || !autoMode || isFinished) return;

        // Determine if it's the user's turn
        const turn = game.turn(); // 'w' or 'b'
        const isUsersTurn =
            (userPlaysWhite && turn === "w") || (!userPlaysWhite && turn === "b");

        if (isUsersTurn) return;

        // It's opponent's turn → autoplay the next expected move if available
        const expected = debut.moves[moveIndex];
        if (!expected) return;

        // Try to make the expected SAN move
        const ng = new Chess(game.fen());
        const played = ng.move(expected);
        if (!played) {
            // If a line is illegal from the current state, don't loop; inform the user
            setMessage("⚠️ This line isn't legal from current position.");
            return;
        }

        setGame(ng);
        playSfx("move");
        const nextIndex = moveIndex + 1;
        setMoveIndex(nextIndex);
        if (nextIndex === debut.moves.length) {
            setMessage(`🎉 You mastered ${debut.name}!`);
            playSfx("success");
        } else {
            setMessage("🤖 Auto played. Your move!");
        }
        // the dependency list below will retrigger if another auto move is needed (rare)
    }, [autoMode, moveIndex, userPlaysWhite, debut, isFinished, game, playSfx]);

    if (!debut) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg font-medium">Debut not found.</p>
            </div>
        );
    }

    const boardOrientation = userPlaysWhite ? "white" : "black";
    const total = debut.moves.length;
    const progress = total ? (moveIndex / total) * 100 : 0;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar title={debut.name}/>

            {isFinished && <Confetti width={width} height={height}/>}

            <div className="flex flex-col items-center p-4 gap-4">
                {/* Chessboard */}
                <div className="w-full max-w-sm">
                    <Chessboard
                        options={{
                            position: game.fen(),
                            onPieceDrop: ({sourceSquare, targetSquare}) =>
                                onDrop(sourceSquare, targetSquare),
                            boardOrientation,
                            onSquareClick,
                            squareStyles: optionSquares,
                        }}
                    />
                </div>

                {/* Progress tracker */}
                <div className="w-full max-w-sm text-center">
                    <p className="text-lg font-medium">
                        Step {Math.min(moveIndex + 1, total)} / {total}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>

                {/* Status message */}
                <p className={`text-lg font-medium ${isFinished ? "text-green-600" : ""}`}>
                    {message}
                </p>

                {/* Controls row */}
                <div className="w-full max-w-sm flex flex-col gap-3">
                    {/* Auto switch */}
                    <label className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border">
                        <span className="font-medium">Auto (opponent moves)</span>
                        <input
                            type="checkbox"
                            checked={autoMode}
                            onChange={(e) => setAutoMode(e.target.checked)}
                            className="h-5 w-5 accent-blue-600 cursor-pointer"
                        />
                    </label>

                    {/* Side toggle */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border">
                        <span className="font-medium">Play as</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => resetPractice(true)}
                                className={`px-3 py-1 rounded-lg border ${
                                    userPlaysWhite
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-800 hover:bg-gray-100"
                                }`}
                            >
                                White
                            </button>
                            <button
                                onClick={() => resetPractice(false)}
                                className={`px-3 py-1 rounded-lg border ${
                                    !userPlaysWhite
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-800 hover:bg-gray-100"
                                }`}
                            >
                                Black
                            </button>
                        </div>
                    </div>
                </div>

                {/* Restart button */}
                <button
                    onClick={() => resetPractice(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Restart
                </button>
            </div>
        </div>
    );
}

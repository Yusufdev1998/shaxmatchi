import React from "react";
import {Link} from "react-router-dom";
import NavBar from "../components/NavBar";
import {db} from "../firebase";
import {collection, onSnapshot, query, Timestamp} from "firebase/firestore";

interface DebutDoc {
    id: string;
    name: string;
    pgn: string;
    createdAt?: Timestamp;
}


export default function DebutList() {
    const [debuts, setDebuts] = React.useState<DebutDoc[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        const q = query(collection(db, "debuts"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                const list: DebutDoc[] = [];
                snap.forEach((d) => {
                    const data = d.data() as Omit<DebutDoc, "id">;
                    list.push({id: d.id, ...data});
                });
                list.sort((a, b) => {
                    const at = a.createdAt?.toMillis?.() || 0;
                    const bt = b.createdAt?.toMillis?.() || 0;
                    if (at !== bt) return bt - at;
                    return a.name.localeCompare(b.name);
                });
                setDebuts(list);
                setLoading(false);
            },
            (e) => {
                setError(e.message);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const filtered = React.useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return debuts;
        return debuts.filter((d) => d.name.toLowerCase().includes(term));
    }, [debuts, search]);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar title="Shaxmatchi"/>

            <div className="p-4 flex flex-col gap-4 max-w-5xl mx-auto w-full">
                <h1 className="text-3xl font-extrabold text-center">Debyutni tanlang</h1>
                <div className="flex items-center gap-2 mt-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nomi bo'yicha qidirish..."
                        className="flex-1 border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} ta</span>
                </div>

                {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}

                {loading ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({length: 6}).map((_, i) => (
                            <li key={i} className="p-5 bg-white rounded-2xl shadow animate-pulse h-[88px]"/>
                        ))}
                    </ul>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-gray-600 p-6 bg-white rounded-xl shadow">Hozircha debyutlar yo'q.</div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((debut) => (
                            <Link
                                key={debut.id}
                                to={`/practice/${debut.id}`}
                                className="group p-5 bg-white rounded-2xl shadow border hover:shadow-md hover:-translate-y-0.5 transition transform"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-lg">{debut.name}</div>
                                    <span
                                        className="text-blue-600 opacity-0 group-hover:opacity-100 transition">→</span>
                                </div>
                            </Link>
                        ))}
                    </ul>
                )}
            </div>


        </div>
    );
}

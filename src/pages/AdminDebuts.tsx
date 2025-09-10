import React from "react";
import {useAuth} from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import {db} from "../firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

interface DebutDoc {
    id: string;
    name: string;
    pgn: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export default function AdminDebuts() {
    const {user, loading} = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = React.useState<DebutDoc[]>([]);
    const [form, setForm] = React.useState<{ id?: string; name: string; pgn: string }>({name: "", pgn: ""});
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Access control: allow only particular users by email via env var
    // Read allowed admin emails from Vite env (comma-separated). If not provided, allow any authenticated user.
    const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
    const allowedAdminEmails: string[] = env.VITE_ADMIN_EMAILS
        ? String(env.VITE_ADMIN_EMAILS)
            .split(",")
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean)
        : [];
    const isAllowed = !!user && (allowedAdminEmails.length === 0 || allowedAdminEmails.includes((user.email || "").toLowerCase()));

    React.useEffect(() => {
        if (!loading && !user) {
            navigate("/signin", {replace: true});
        }
    }, [loading, user, navigate]);

    React.useEffect(() => {
        if (!user) return;
        if (!isAllowed) return;

        const q = query(collection(db, "debuts"));
        const unsub = onSnapshot(q, (snap) => {
            const list: DebutDoc[] = [];
            snap.forEach((d) => {
                const data = d.data() as Omit<DebutDoc, "id">;
                list.push({id: d.id, ...data});
            });
            // sort by createdAt if present, otherwise by name
            list.sort((a, b) => {
                const at = a.createdAt?.toMillis?.() || 0;
                const bt = b.createdAt?.toMillis?.() || 0;
                if (at !== bt) return bt - at;
                return a.name.localeCompare(b.name);
            });
            setItems(list);
        }, (e) => setError(e.message));

        return () => unsub();
    }, [user, isAllowed]);

    const resetForm = () => setForm({name: "", pgn: ""});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAllowed) return;
        setSaving(true);
        setError(null);
        try {
            const {id, name, pgn} = form;
            if (!name.trim() || !pgn.trim()) {
                throw new Error("Iltimos, nom va PGNni kiriting.");
            }
            if (id) {
                await updateDoc(doc(db, "debuts", id), {
                    name: name.trim(),
                    pgn: pgn.trim(),
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, "debuts"), {
                    name: name.trim(),
                    pgn: pgn.trim(),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            resetForm();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (it: DebutDoc) => {
        setForm({id: it.id, name: it.name, pgn: it.pgn});
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleDelete = async (id: string) => {
        if (!isAllowed) return;
        if (!confirm("Ushbu debyut o'chirilsinmi? Qaytarib bo'lmaydi.")) return;
        try {
            await deleteDoc(doc(db, "debuts", id));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar title="Debyutlar"/>
            <div className="p-4 max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Debyutlar</h2>
                    </div>

                </div>

                {!loading && user && !isAllowed && (
                    <div className="bg-red-50 text-red-700 p-4 rounded">
                        Sizga debyutlarni boshqarishga ruxsat berilmagan.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>
                )}

                {user && isAllowed && (
                    <>
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-600">Nomi</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                                    placeholder="Masalan: Ruy Lopez"
                                    className="border rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-600">PGN</label>
                                <textarea
                                    value={form.pgn}
                                    onChange={(e) => setForm((f) => ({...f, pgn: e.target.value}))}
                                    placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 ... Misol"
                                    className="border rounded px-3 py-2 min-h-[100px]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button disabled={saving}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                    {form.id ? (saving ? "Saqlanmoqda..." : "Yangilash") : (saving ? "Qo'shilmoqda..." : "Qo'shish")}
                                </button>
                                {form.id && (
                                    <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">Bekor
                                        qilish</button>
                                )}
                            </div>

                        </form>

                        <div className="bg-white rounded-xl shadow">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b">
                                    <th className="p-3">Nomi</th>
                                    <th className="p-3">PGN</th>
                                    <th className="p-3 w-40">Amal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-4 text-center text-gray-500">Hozircha debyutlar
                                            yo'q.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((it) => (
                                        <tr key={it.id} className="border-b align-top">
                                            <td className="p-3 font-medium">{it.name}</td>
                                            <td className="p-3 whitespace-pre-wrap text-sm text-gray-700">{it.pgn}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(it)}
                                                            className="px-3 py-1 rounded border"
                                                            aria-label="Tahrirlash">✏️
                                                    </button>
                                                    <button onClick={() => handleDelete(it.id)}
                                                            className="px-3 py-1 rounded border text-red-600"
                                                            aria-label="O'chirish">🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

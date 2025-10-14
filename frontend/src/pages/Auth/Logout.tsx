import { supabase } from "../../lib/supabaseClient";

export default function Logout() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
            Выйти
        </button>
    );
}

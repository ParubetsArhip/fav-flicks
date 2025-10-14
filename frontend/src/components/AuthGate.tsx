import { useEffect, useState } from "react";
import {supabase} from "../lib/supabaseClient.ts";
import AuthPage from "../pages/Auth/AuthPage.tsx";
import type { User } from "@supabase/supabase-js";

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };
        getUser();

        // подписка на изменения сессии (login/logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return <p>Загрузка...</p>;

    if (!user) {
        return <AuthPage />;
    }

    return <>{children}</>;
}

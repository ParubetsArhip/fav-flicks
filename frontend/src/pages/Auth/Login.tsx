import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabaseClient";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Invalid password"),
});

type FormData = z.infer<typeof schema>;

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const res = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });
        if (res.error) {
            alert(res.error.message);
            return;
        }
        if (onSuccess) onSuccess?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
        >
            <input
                {...register("email")}
                placeholder="Email"
                className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
            {formState.errors.email && (
                <p className="text-red-400 text-sm">
                    {formState.errors.email.message}
                </p>
            )}

            <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
            {formState.errors.password && (
                <p className="text-red-400 text-sm">
                    {formState.errors.password.message}
                </p>
            )}

            <button
                type="submit"
                disabled={formState.isSubmitting}
                className="mt-2 px-4 py-2 bg-violet-600 rounded-xl text-white shadow-md hover:bg-violet-700 transition"
            >
                {formState.isSubmitting ? "Login..." : "Login"}
            </button>

            <button
                type="button"
                onClick={async () =>
                    await supabase.auth.signInWithOAuth({ provider: "google" })
                }
                className="mt-2 px-4 py-2 rounded-xl border border-gray-400 text-gray-200 hover:bg-white/10 transition"
            >
                Login with Google
            </button>
        </form>
    );
}

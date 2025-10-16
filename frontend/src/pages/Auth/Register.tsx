import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabaseClient";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof schema>;

export default function Register({ onSuccess }: { onSuccess?: () => void }) {
    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const res = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { name: data.name },
            },
        });

        if (res.error) {
            alert(res.error.message);
            return;
        }

        alert("Registration successful. Check your email.");
        if (onSuccess) onSuccess?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
        >
            <input
                {...register("name")}
                placeholder="Your name"
                className="p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
            {formState.errors.name && (
                <p className="text-red-400 text-sm">
                    {formState.errors.name.message}
                </p>
            )}

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
                className="mt-2 px-4 py-2 bg-green-600 rounded-xl text-white shadow-md hover:bg-green-700 transition"
            >
                {formState.isSubmitting ? "Register..." : "Register"}
            </button>
        </form>
    );
}

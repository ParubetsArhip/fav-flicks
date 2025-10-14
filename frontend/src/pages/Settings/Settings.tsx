import { supabase } from "../../lib/supabaseClient";

const Settings = () => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert(error.message);
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
                <h1 className="font-bold text-3xl text-white mb-6">Profile</h1>

                <p className="text-gray-300 mb-8">
                    Welcome! 🎉 <br />
                    Your account information will be here.
                </p>

                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md
                    transition transform hover:scale-105 cursor-pointer"
                >
                    Log out of your account
                </button>
            </div>
        </div>
    );
};

export default Settings;

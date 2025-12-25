export async function registerUser(username: string, password: string, email: string, fullName: string) {
    try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email, fullName }),
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: "Network error" };
    }
}
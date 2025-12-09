

export async function loginUser(username: string, password: string) {
    try {
        const res = await fetch("http://localhost:8081/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Network error" };
    }
}

export async function loginUser(username: string, password: string) {
    try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        // Backend trả về: { cartId, userId, role }
        if (data.userId) {
            return {
                success: true,
                userId: data.userId,
                cartId: data.cartId,
                isAdmin: data.role === 'admin'
            };
        }

        return { success: false, message: "Login failed" };

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Network error" };
    }
}
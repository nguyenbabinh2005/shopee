import { ProductDetailResponse } from "@/types/productDetail";

export async function getProductDetailById(
  id: number
): Promise<ProductDetailResponse | null> {
  try {
    const res = await fetch(
      `http://localhost:8080/api/products/id/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("❌ Fetch product detail failed:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Product detail error:", error);
    return null;
  }
}

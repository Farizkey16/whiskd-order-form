import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BakeryProduct } from "@/components/order-form";

const notion = new Client({
  auth: process.env.NOTION_API,
});

export async function getProducts(): Promise<BakeryProduct[]> {
  const databaseId = process.env.NOTION_DB_ID;

  if (!databaseId) {
    throw new Error("NOTION_DB_ID is missing in environment variables.");
  }

  try {
    // 1. Retrieve Database Metadata to get the Data Source ID
    const dbResponse = await notion.databases.retrieve({
      database_id: databaseId,
    });

    const dataSourceId = (dbResponse as any).data_sources?.[0]?.id;

    if (!dataSourceId) {
      throw new Error("No Data Source ID found. Ensure the integration has access.");
    }

    // 2. Query the Data Source
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [
        {
          property: "Marketing Name", // Sort by family to keep groups clean
          direction: "ascending",
        },
        {
          property: "Price (Rp)", // Sort variants by price (low to high)
          direction: "ascending",
        }
      ],
    });

    // 3. Map and Return Data
    const fullPages = response.results.filter(
      (page): page is PageObjectResponse => "properties" in page
    );

    const groupedProducts: Record<string, BakeryProduct> = {};

    for (const page of fullPages) {
      const props = page.properties;

      // 1. Get the Key Identifiers
      const marketingName = (props["Marketing Name"] as any)?.select?.name || "Uncategorized";
      const sizeName = (props["Size Variant"] as any)?.select?.name || "Standard";
      const variantPrice = (props["Price (Rp)"] as any)?.number || 0;
      const variantId = page.id;
      const currentStock = (props["Current Stock"] as any)?.formula?.number || 0;

      const categoryName = (props["Product Category"] as any)?.select?.name || "General";
      
      // Image (Get first one found in the group)
      const fileObj = (props["Files & Media"] as any)?.files?.[0];
      const imageUrl = fileObj?.type === "file" 
        ? fileObj.file.url 
        : fileObj?.external?.url || "";

      // 2. Initialize the Group if it doesn't exist
      if (!groupedProducts[marketingName]) {
        groupedProducts[marketingName] = {
          id: variantId,       // Default ID (usually the cheapest one since we sorted)
          name: marketingName, // The clean name "Classic Tiramisu"
          price: variantPrice, // The base price "50,000"
          sizes: [],           // We will fill this up
          imageUrl: imageUrl,
          category: categoryName,
          stock: currentStock,
          variants: {}         // Storage for the lookup logic
        };
      }

      // 3. Add this specific variant to the group
      const product = groupedProducts[marketingName];
      
      // Add size to the dropdown list
      if (!product.sizes.includes(sizeName)) {
        product.sizes.push(sizeName);
      }

      // Store the specific data for this size
      product.variants[sizeName] = {
        id: variantId,
        price: variantPrice
      };

      // Ensure we keep the image if the first one was empty but this one has it
      if (!product.imageUrl && imageUrl) {
        product.imageUrl = imageUrl;
      }
    }

    // Convert object back to array
    return Object.values(groupedProducts);

  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; 
  }
}
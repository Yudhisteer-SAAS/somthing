import type { Database } from "@/integrations/supabase/types";
import { POSTER_UNIT_PRICE } from "@/utils/pricing";

export type StorefrontProduct = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    tags: string[];
};

const CATEGORY_CYCLE = ["Abstract", "Botanical", "Travel", "Line Art"];
const TAGS_BY_CATEGORY: Record<string, string[]> = {
    Abstract: ["modern", "minimal"],
    Botanical: ["nature", "fresh"],
    Travel: ["wanderlust", "cityscape"],
    "Line Art": ["outline", "contemporary"],
};

const REAL_POSTER_IMAGE_NUMBERS = [
    1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];

const FALLBACK_NAMES = [
    "Desert Sunrise",
    "Tropical Dreams",
    "Sunset Paradise",
    "Elegant Portrait",
    "Ocean Waves",
    "Autumn Circles",
    "Forest Whispers",
    "City Lights",
    "Minimal Lines",
    "Abstract Fusion",
    "Zen Garden",
    "Mountain Peak",
    "Golden Horizon",
    "Monsoon Streets",
    "Blue Cascade",
    "Wild Fern",
    "Quiet Dunes",
    "Night Tram",
    "Calm Geometry",
    "Bloom Theory",
];

export const fallbackPosterProducts: StorefrontProduct[] = FALLBACK_NAMES.map(
    (name, index) => {
        const posterNumber =
            REAL_POSTER_IMAGE_NUMBERS[index % REAL_POSTER_IMAGE_NUMBERS.length];
        const category = CATEGORY_CYCLE[index % CATEGORY_CYCLE.length];
        const tags = TAGS_BY_CATEGORY[category] || ["wall art"];

        return {
            id: String(index + 1),
            name,
            category,
            price: POSTER_UNIT_PRICE,
            image: `/posters/poster (${posterNumber}).jpg`,
            description: `${name} is a premium ${category.toLowerCase()} poster print for modern homes and workspaces.`,
            tags,
        };
    },
);

export const fallbackShopCategories = [
    "All",
    ...Array.from(
        new Set(fallbackPosterProducts.map((product) => product.category)),
    ),
];

type DatabaseProductWithCategory =
    Database["public"]["Tables"]["products"]["Row"] & {
        categories?: { name: string } | null;
    };

export const mapDatabaseProductToStorefront = (
    product: DatabaseProductWithCategory,
): StorefrontProduct => ({
    id: product.id,
    name: product.name,
    category: product.categories?.name || "Uncategorized",
    price: POSTER_UNIT_PRICE,
    image: product.image_url || fallbackPosterProducts[0].image,
    description:
        product.description ||
        `${product.name} is a premium wall art poster available in our store.`,
    tags: product.tags || [],
});

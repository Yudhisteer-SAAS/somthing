import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CheckCircle2,
    Gift,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { breadcrumbSchema } from "@/utils/schemas";
import {
    DELIVERY_CHARGE,
    FIVE_POSTER_PRICE,
    formatINR,
    getPosterPricingBreakdown,
    POSTER_UNIT_PRICE,
    THREE_POSTER_PRICE,
} from "@/utils/pricing";
import { supabase } from "@/integrations/supabase/client";
import {
    fallbackPosterProducts,
    mapDatabaseProductToStorefront,
    type StorefrontProduct,
} from "@/data/posterCatalog";

const MAX_TOTAL_POSTERS = 10;
const FREE_POSTERS_PER_ACCOUNT = 1;

const RAZORPAY_BUTTON_IDS: Record<number, string> = {
    100: "pl_SbGVwbuVTvkipz",
    150: "pl_SbIPNZ0KMhlAwM",
    200: "pl_SbITsZTGYgmx0W",
    230: "pl_SbIVeXyaJuTtVh",
    250: "pl_SbItK3VSWs493T",
    280: "pl_SbIv6PQYDnvTPL",
    300: "pl_SbIwv184eCkDT3",
    330: "pl_SbIyDjlOg1Z1wG",
    380: "pl_SbIzR3aXmmkX70",
    400: "pl_SbJ0n0sf0S4ZLc",
};

const getClaimKey = (userId: string) => `innothon-3-claimed-${userId}`;

const createOrderId = () => {
    const ts = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `INNO-${ts}-${random}`;
};

const Innothon = () => {
    const { user, isLoading } = useAuth();
    const { toast } = useToast();

    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
    const [customerName, setCustomerName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [confirmOrder, setConfirmOrder] = useState(false);
    const [detailsConfirmed, setDetailsConfirmed] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [hasClaimed, setHasClaimed] = useState(false);

    const { data: dbProducts } = useQuery({
        queryKey: ["innothon-products"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            return data;
        },
    });

    const posters = useMemo<StorefrontProduct[]>(() => {
        const dbMapped = (dbProducts || []).map(mapDatabaseProductToStorefront);
        const seen = new Set<string>();

        const merged = [...dbMapped, ...fallbackPosterProducts].filter((item) => {
            if (seen.has(item.id)) {
                return false;
            }
            seen.add(item.id);
            return true;
        });

        return merged;
    }, [dbProducts]);

    useEffect(() => {
        if (user?.email && !email) {
            setEmail(user.email);
        }
    }, [user, email]);

    useEffect(() => {
        if (!user) {
            setHasClaimed(false);
            return;
        }

        setHasClaimed(localStorage.getItem(getClaimKey(user.id)) === "true");
    }, [user]);

    useEffect(() => {
        setDetailsConfirmed(false);
        setOrderId("");
    }, [selectedQuantities, customerName, mobile, email, address, pincode, confirmOrder]);

    const totalSelected = useMemo(
        () => Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0),
        [selectedQuantities],
    );

    const paidQuantity = Math.max(0, totalSelected - FREE_POSTERS_PER_ACCOUNT);
    const paidPricing = useMemo(
        () => getPosterPricingBreakdown(paidQuantity),
        [paidQuantity],
    );

    const shippingCharge =
        paidQuantity === 0
            ? DELIVERY_CHARGE
            : paidPricing.discountedSubtotal >= 200
              ? 0
              : DELIVERY_CHARGE;

    const payableAmount = paidPricing.discountedSubtotal + shippingCharge;
    const paymentButtonId = RAZORPAY_BUTTON_IDS[payableAmount];

    const selectedPosterItems = useMemo(
        () =>
            posters
                .filter((poster) => (selectedQuantities[poster.id] || 0) > 0)
                .map((poster) => ({
                    ...poster,
                    quantity: selectedQuantities[poster.id],
                })),
        [posters, selectedQuantities],
    );

    const setQuantityForPoster = (posterId: string, nextQty: number) => {
        const safeNext = Math.max(0, Math.floor(nextQty));
        const currentQty = selectedQuantities[posterId] || 0;
        const nextTotal = totalSelected - currentQty + safeNext;

        if (nextTotal > MAX_TOTAL_POSTERS) {
            toast({
                title: "Limit reached",
                description: `You can select up to ${MAX_TOTAL_POSTERS} posters in Innothon checkout.`,
                variant: "destructive",
            });
            return;
        }

        setSelectedQuantities((prev) => {
            const next = { ...prev };
            if (safeNext === 0) {
                delete next[posterId];
            } else {
                next[posterId] = safeNext;
            }
            return next;
        });
    };

    const handleConfirmOrder = () => {
        if (!user) {
            toast({
                title: "Login required",
                description: "Please login to claim your free poster.",
                variant: "destructive",
            });
            return;
        }

        if (hasClaimed) {
            toast({
                title: "Offer already claimed",
                description: "This account has already used the Innothon free-poster offer.",
                variant: "destructive",
            });
            return;
        }

        if (totalSelected < 1) {
            toast({
                title: "Select posters first",
                description: "Please select at least one poster to proceed.",
                variant: "destructive",
            });
            return;
        }

        if (customerName.trim().length < 2) {
            toast({
                title: "Name required",
                description: "Please enter your full name.",
                variant: "destructive",
            });
            return;
        }

        if (!/^\d{10}$/.test(mobile.trim())) {
            toast({
                title: "Invalid mobile number",
                description: "Please enter a valid 10-digit mobile number.",
                variant: "destructive",
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        if (address.trim().length < 10) {
            toast({
                title: "Address required",
                description: "Please enter a complete address.",
                variant: "destructive",
            });
            return;
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            toast({
                title: "Invalid pincode",
                description: "Please enter a valid 6-digit pincode.",
                variant: "destructive",
            });
            return;
        }

        if (!confirmOrder) {
            toast({
                title: "Order confirmation required",
                description: "Please confirm order details before payment.",
                variant: "destructive",
            });
            return;
        }

        if (!paymentButtonId) {
            toast({
                title: "Payment button missing",
                description: `No Razorpay button found for payable amount ${formatINR(payableAmount)}.`,
                variant: "destructive",
            });
            return;
        }

        const generatedOrderId = createOrderId();
        setOrderId(generatedOrderId);
        setDetailsConfirmed(true);

        localStorage.setItem(getClaimKey(user.id), "true");
        setHasClaimed(true);

        toast({
            title: "Order confirm",
            description: `Order ID: ${generatedOrderId}`,
        });
    };

    const availableTotals = useMemo(() => {
        const totals = new Set<number>();

        for (let selectedTotal = 1; selectedTotal <= MAX_TOTAL_POSTERS; selectedTotal += 1) {
            const paidQty = Math.max(0, selectedTotal - FREE_POSTERS_PER_ACCOUNT);
            const paid = getPosterPricingBreakdown(paidQty);
            const shipping = paidQty === 0 ? DELIVERY_CHARGE : paid.discountedSubtotal >= 200 ? 0 : DELIVERY_CHARGE;
            totals.add(paid.discountedSubtotal + shipping);
        }

        return Array.from(totals).sort((a, b) => a - b);
    }, []);

    const missingTotals = availableTotals.filter((amount) => !RAZORPAY_BUTTON_IDS[amount]);

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "Innothon", url: "https://somthing-ten.vercel.app/innothon" },
    ]);

    return (
        <>
            <SEOHead
                title="INNOTHON 3.0 | Free Poster Offer | Somthing"
                description="Select posters first. Get 1 free poster per account and pay via Razorpay."
                keywords="innothon 3.0, free poster, razorpay, poster selection"
                canonical="/innothon"
                schema={breadcrumbs}
            />

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-28 pb-16">
                    <section className="container mx-auto px-4 md:px-6">
                        <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary to-background p-6 md:p-10">
                            <p className="text-sm font-semibold tracking-wide text-primary">
                                INNOTHON 3.0 SPONSOR OFFER
                            </p>
                            <h1 className="mt-3 text-3xl md:text-5xl font-bold">
                                Select Posters, Get 1 Free
                            </h1>
                            <p className="mt-4 max-w-3xl text-muted-foreground text-base md:text-lg">
                                Select poster designs first. Every account gets 1 poster free. For 1 selected poster,
                                you pay only delivery {formatINR(DELIVERY_CHARGE)}.
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Gift className="h-4 w-4" />
                                        <span className="text-sm font-medium">Free Benefit</span>
                                    </div>
                                    <p className="text-2xl font-bold">1 poster/account</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Truck className="h-4 w-4" />
                                        <span className="text-sm font-medium">Delivery</span>
                                    </div>
                                    <p className="text-2xl font-bold">{formatINR(DELIVERY_CHARGE)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Free at ₹200 and above</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-sm font-medium">Secure Payment</span>
                                    </div>
                                    <p className="text-2xl font-bold">Razorpay</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto mt-8 px-4 md:px-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Select Posters (Up to {MAX_TOTAL_POSTERS})</CardTitle>
                                <CardDescription>
                                    Add/remove poster designs. Your first poster is automatically free.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {posters.map((poster) => {
                                        const qty = selectedQuantities[poster.id] || 0;

                                        return (
                                            <div key={poster.id} className="rounded-xl border p-3">
                                                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                                                    <img
                                                        src={poster.image}
                                                        alt={poster.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm font-semibold">{poster.name}</p>
                                                <p className="text-xs text-muted-foreground">{poster.category}</p>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setQuantityForPoster(poster.id, qty - 1)}
                                                        disabled={qty === 0 || hasClaimed}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center font-semibold">{qty}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setQuantityForPoster(poster.id, qty + 1)}
                                                        disabled={hasClaimed}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="container mx-auto mt-8 px-4 md:px-6">
                        <Card className="max-w-3xl mx-auto">
                            <CardHeader>
                                <CardTitle>2. Confirm Order & Pay</CardTitle>
                                <CardDescription>
                                    Fill details, confirm order, then pay with Razorpay.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {!isLoading && !user && (
                                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                        Login is required to claim 1 free poster per account.
                                    </div>
                                )}

                                {hasClaimed && (
                                    <div className="rounded-lg border border-amber-400/60 bg-amber-50 p-4 text-sm text-amber-700">
                                        This account has already claimed the Innothon free-poster offer.
                                    </div>
                                )}

                                <div className="rounded-lg bg-secondary p-4 text-sm space-y-1">
                                    <p>Total Selected Posters: <span className="font-semibold">{totalSelected}</span></p>
                                    <p>Free Posters Applied: <span className="font-semibold">{totalSelected > 0 ? 1 : 0}</span></p>
                                    <p>Paid Posters Count: <span className="font-semibold">{paidQuantity}</span></p>
                                    <p>Paid Posters Original: <span className="font-semibold">{formatINR(paidPricing.originalSubtotal)}</span></p>
                                    <p>Bundle Discount: <span className="font-semibold text-primary">-{formatINR(paidPricing.savings)}</span></p>
                                    <p>Paid Posters Final: <span className="font-semibold">{formatINR(paidPricing.discountedSubtotal)}</span></p>
                                    <p>Delivery: <span className="font-semibold">{shippingCharge === 0 ? "Free" : formatINR(shippingCharge)}</span></p>
                                    <p className="pt-1 text-base">Total Payable: <span className="font-bold">{formatINR(payableAmount)}</span></p>
                                </div>

                                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                                    <p className="font-medium mb-1">Pricing model</p>
                                    <p>1 poster = {formatINR(POSTER_UNIT_PRICE)}</p>
                                    <p>
                                        3 posters = <span className="line-through">{formatINR(POSTER_UNIT_PRICE * 3)}</span>{" "}
                                        {formatINR(THREE_POSTER_PRICE)}
                                    </p>
                                    <p>
                                        5 posters = <span className="line-through">{formatINR(POSTER_UNIT_PRICE * 5)}</span>{" "}
                                        {formatINR(FIVE_POSTER_PRICE)}
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input
                                            id="mobile"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            placeholder="10-digit mobile number"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input
                                            id="pincode"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="6-digit pincode"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="House/Flat, Area, City, State"
                                    />
                                </div>

                                <label className="flex items-start gap-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={confirmOrder}
                                        onChange={(e) => setConfirmOrder(e.target.checked)}
                                        className="mt-1"
                                    />
                                    <span>
                                        I confirm my order details (name, mobile, email, address and pincode) are correct.
                                    </span>
                                </label>

                                <Button
                                    onClick={handleConfirmOrder}
                                    className="w-full"
                                    disabled={!user || hasClaimed}
                                >
                                    Confirm Order
                                </Button>

                                {detailsConfirmed && orderId && paymentButtonId && (
                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex items-center gap-2 text-sm text-primary">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Order confirm. Order ID: {orderId}
                                        </div>

                                        <form key={`${paymentButtonId}-${orderId}`}>
                                            <input type="hidden" name="order_id" value={orderId} />
                                            <input type="hidden" name="name" value={customerName} />
                                            <input type="hidden" name="mobile" value={mobile} />
                                            <input type="hidden" name="email" value={email} />
                                            <input type="hidden" name="address" value={address} />
                                            <input type="hidden" name="pincode" value={pincode} />
                                            <input type="hidden" name="selected_total" value={totalSelected} />
                                            <input type="hidden" name="paid_quantity" value={paidQuantity} />
                                            <input type="hidden" name="free_posters" value={FREE_POSTERS_PER_ACCOUNT} />
                                            <input type="hidden" name="selected_posters" value={JSON.stringify(selectedPosterItems.map((item) => ({ id: item.id, name: item.name, qty: item.quantity })))} />
                                            <input type="hidden" name="payable_amount" value={payableAmount} />
                                            <script
                                                src="https://checkout.razorpay.com/v1/payment-button.js"
                                                data-payment_button_id={paymentButtonId}
                                                async
                                            />
                                        </form>
                                    </div>
                                )}

                                {missingTotals.length > 0 && (
                                    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                        Missing Razorpay buttons for payable amounts: {missingTotals.map((amount) => formatINR(amount)).join(", ")}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="container mx-auto mt-8 px-4 md:px-6">
                        <Card className="max-w-3xl mx-auto">
                            <CardHeader>
                                <CardTitle>FAQ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <p className="font-semibold">Can I get 1 free poster even if I buy more posters?</p>
                                    <p className="text-muted-foreground">
                                        Yes. This offer always gives 1 free poster per account, even when you purchase additional posters.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">If I want 5 posters, can I select 4 and still get 1 free?</p>
                                    <p className="text-muted-foreground">
                                        Yes. Select 4 posters and you get 1 free, total 5 posters. Delivery remains {formatINR(DELIVERY_CHARGE)} in this case.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">What if I select 5 posters?</p>
                                    <p className="text-muted-foreground">
                                        Then you get 1 more free, total 6 posters. Paid posters hit the free-delivery threshold, so delivery becomes free.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">What is the maximum quantity allowed?</p>
                                    <p className="text-muted-foreground">
                                        You can select up to {MAX_TOTAL_POSTERS} posters in Innothon checkout.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Innothon;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, Truck, Gift, Smartphone } from "lucide-react";
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

const DELIVERY_CHARGE = 49;
const HACKATHON_START = new Date("2026-04-08T09:00:00+05:30");
const HACKATHON_END = new Date(HACKATHON_START.getTime() + 36 * 60 * 60 * 1000);

const toTwoDigits = (value: number) => value.toString().padStart(2, "0");

const Innothon = () => {
    const { user, isLoading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [now, setNow] = useState(new Date());
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [hasClaimed, setHasClaimed] = useState(false);

    const claimKey = user ? `innothon-free-poster-claimed-${user.id}` : null;

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!claimKey) {
            setHasClaimed(false);
            return;
        }

        setHasClaimed(localStorage.getItem(claimKey) === "true");
    }, [claimKey]);

    const isHackathonLive = now >= HACKATHON_START && now <= HACKATHON_END;

    const timeLeft = useMemo(() => {
        const diff = HACKATHON_END.getTime() - now.getTime();
        if (diff <= 0) {
            return { hours: "00", minutes: "00", seconds: "00" };
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            hours: toTwoDigits(hours),
            minutes: toTwoDigits(minutes),
            seconds: toTwoDigits(seconds),
        };
    }, [now]);

    const handleReserve = () => {
        if (!user) {
            navigate("/auth", { state: { from: { pathname: "/innothon" } } });
            return;
        }

        if (!isHackathonLive) {
            toast({
                title: "Offer is not active",
                description:
                    "The INNOTHON free-poster offer is only available during the 36-hour hackathon window.",
                variant: "destructive",
            });
            return;
        }

        if (hasClaimed) {
            toast({
                title: "Already claimed",
                description:
                    "This account has already claimed the free poster for INNOTHON.",
                variant: "destructive",
            });
            return;
        }

        if (!/^\+?[0-9]{10,15}$/.test(mobile.trim())) {
            toast({
                title: "Invalid mobile number",
                description:
                    "Enter a valid mobile number with 10 to 15 digits.",
                variant: "destructive",
            });
            return;
        }

        if (address.trim().length < 10) {
            toast({
                title: "Address required",
                description: "Please enter a complete delivery address.",
                variant: "destructive",
            });
            return;
        }

        if (claimKey) {
            localStorage.setItem(claimKey, "true");
        }

        setHasClaimed(true);

        toast({
            title: "Poster reserved",
            description: `Your free poster is reserved. Please complete delivery payment of Rs. ${DELIVERY_CHARGE}.`,
        });
    };

    const breadcrumbs = breadcrumbSchema([
        { name: "Home", url: "https://somthing-ten.vercel.app/" },
        { name: "Innothon", url: "https://somthing-ten.vercel.app/innothon" },
    ]);

    return (
        <>
            <SEOHead
                title="INNOTHON Offer | 1 Free Poster Per Account | Somthing"
                description="INNOTHON special: one free poster per account during the 36-hour hackathon. Login required. Pay only delivery charges."
                keywords="innothon, free poster, hackathon offer, delivery only"
                canonical="/innothon"
                schema={breadcrumbs}
            />

            <div className="min-h-screen bg-background">
                <Header />

                <main className="pt-28 pb-16">
                    <section className="container mx-auto px-4 md:px-6">
                        <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary to-background p-6 md:p-10">
                            <p className="text-sm font-semibold tracking-wide text-primary">
                                INNOTHON LIMITED OFFER
                            </p>
                            <h1 className="mt-3 text-3xl md:text-5xl font-bold">
                                1 Free Poster Per Account
                            </h1>
                            <p className="mt-4 max-w-2xl text-muted-foreground text-base md:text-lg">
                                During INNOTHON (36 hours), every account can
                                claim exactly one free poster. You only pay
                                delivery charges.
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Gift className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Poster Cost
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">Rs. 0</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Truck className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Delivery Charge
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        Rs. {DELIVERY_CHARGE}
                                    </p>
                                </div>
                                <div className="rounded-xl border bg-background p-4">
                                    <div className="mb-2 flex items-center gap-2 text-primary">
                                        <Clock3 className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Time Left
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {isHackathonLive
                                            ? `${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`
                                            : "Offer Closed"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="container mx-auto mt-8 px-4 md:px-6">
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle>Reserve Your Free Poster</CardTitle>
                                <CardDescription>
                                    Login is required and one claim is allowed
                                    per account for INNOTHON.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {!isLoading && !user ? (
                                    <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                                        You need to login first to claim this
                                        offer.
                                        <div className="mt-4">
                                            <Button
                                                onClick={() =>
                                                    navigate("/auth", {
                                                        state: {
                                                            from: {
                                                                pathname:
                                                                    "/innothon",
                                                            },
                                                        },
                                                    })
                                                }
                                            >
                                                Login to Continue
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">
                                                Mobile Number
                                            </Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="mobile"
                                                    value={mobile}
                                                    onChange={(e) =>
                                                        setMobile(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 9876543210"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">
                                                Delivery Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                placeholder="House/Flat, Area, City, PIN"
                                            />
                                        </div>

                                        <div className="rounded-lg bg-secondary p-4 text-sm">
                                            <p>
                                                Poster:{" "}
                                                <span className="font-semibold">
                                                    Free
                                                </span>
                                            </p>
                                            <p>
                                                Delivery:{" "}
                                                <span className="font-semibold">
                                                    Rs. {DELIVERY_CHARGE}
                                                </span>
                                            </p>
                                            <p className="mt-1">
                                                Total payable now:{" "}
                                                <span className="font-bold">
                                                    Rs. {DELIVERY_CHARGE}
                                                </span>
                                            </p>
                                        </div>

                                        <Button
                                            className="w-full"
                                            disabled={
                                                !user ||
                                                !isHackathonLive ||
                                                hasClaimed ||
                                                isLoading
                                            }
                                            onClick={handleReserve}
                                        >
                                            {hasClaimed
                                                ? "Already Claimed by This Account"
                                                : isHackathonLive
                                                  ? `Reserve Now (Pay Rs. ${DELIVERY_CHARGE} Delivery)`
                                                  : "Offer Not Active"}
                                        </Button>
                                    </>
                                )}
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
